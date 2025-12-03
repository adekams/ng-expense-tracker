import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  inject,
} from '@angular/core';

import {
  TransactionService,
  Transaction,
} from '@features/transactions/services/transaction';
import { TransactionListComponent } from '@features/transactions/components/transaction-list/transaction-list';
import { TransactionFormComponent } from '@features/transactions/modals/transaction-form/transaction-form';
import { ExchangeRateService } from '@features/transactions/services/exchange-rate.service';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmModalComponent } from '@shared/modals/confirm-modal/confirm-modal';
import { ToastrService } from 'ngx-toastr';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { onAuthStateChanged } from 'firebase/auth';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.html',
  imports: [
    CommonModule,
    FormsModule,
    TransactionListComponent,
    TransactionFormComponent,
    ConfirmModalComponent,
  ],
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  private auth = inject(Auth);

  symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    NGN: '₦',
    GBP: '£',
  };

  transactionFormAdded = false;
  transactions: Transaction[] = [];
  totalIncome = 0;
  totalExpenses = 0;
  balance = 0;
  clearConfirmVisible = false;
  baseCurrency = 'NGN';
  summaryCurrency = 'NGN';

  errorMessage: string | null = null;

  @ViewChild('transactionList') transactionList!: TransactionListComponent;
  @ViewChild('transactionForm') transactionForm!: TransactionFormComponent;

  constructor(
    private toast: ToastrService,
    private cdr: ChangeDetectorRef,
    private transactionSvc: TransactionService,
    private exchangeRateSvc: ExchangeRateService
  ) {}

  ngOnInit() {
    this.loadTransactions();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  resetForm() {
    this.transactionFormAdded = true;

    setTimeout(() => {
      if (this.transactionForm?.form) {
        const today = new Date().toISOString().split('T')[0];

        this.transactionForm.form.reset({
          amount: 0,
          category: '',
          date: today,
          description: '',
          currency: this.baseCurrency,
        });
      }
    });
  }

  loadTransactions() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.transactionFormAdded = false;

        this.transactionSvc
          .getTransactions()
          .pipe(takeUntil(this.destroy$))
          .subscribe((data) => {
            this.transactions = data;

            // Save local copy ONCE (not inside service)
            this.transactionSvc.updateLocalStorage(data);

            this.calculateSummary();
          });
      }
    });
  }

  calculateSummary() {
    if (!this.transactions.length) {
      this.totalIncome = 0;
      this.totalExpenses = 0;
      this.balance = 0;
      return;
    }

    const uniqueCurrencies = new Set(this.transactions.map((t) => t.currency));

    if (
      uniqueCurrencies.size === 1 &&
      uniqueCurrencies.has(this.baseCurrency)
    ) {
      this.totalIncome = this.transactions
        .filter((t) => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);

      this.totalExpenses = this.transactions
        .filter((t) => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      this.balance = this.totalIncome - this.totalExpenses;
      this.summaryCurrency = this.baseCurrency;
      return;
    }

    this.convertAndComputeTotals();
  }

  convertAndComputeTotals() {
    this.errorMessage = null;
    if (!this.transactions.length) return;

    const currencies = Array.from(
      new Set(this.transactions.map((tx) => tx.currency))
    ).filter((c) => c !== this.baseCurrency);

    this.exchangeRateSvc
      .getRates(this.baseCurrency, currencies)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          const rates = data.quotes;
          let income = 0;
          let expenses = 0;

          this.transactions.forEach((tx) => {
            if (tx.currency === this.baseCurrency) {
              if (tx.amount > 0) income += tx.amount;
              else expenses += Math.abs(tx.amount);
            } else {
              const key = `${this.baseCurrency}${tx.currency}`;
              const rate = rates[key];

              if (!rate) return;

              const converted = tx.amount / rate;

              if (tx.amount > 0) income += converted;
              else expenses += Math.abs(converted);
            }
          });

          this.totalIncome = income;
          this.totalExpenses = expenses;
          this.balance = income - expenses;
          this.summaryCurrency = this.baseCurrency;
        },
        error: () => {
          this.toast.error('Failed to fetch exchange rates.');
        },
      });
  }

  onTransactionAdded() {
    this.transactionFormAdded = false;
    this.loadTransactions();
  }

  showClearConfirm() {
    this.clearConfirmVisible = true;
  }

  hideClearConfirm() {
    this.clearConfirmVisible = false;
  }

  confirmClearAll() {
    this.transactionSvc.clearAll();
    this.transactions = [];
    this.totalIncome = 0;
    this.totalExpenses = 0;
    this.balance = 0;
    this.transactionFormAdded = false;
    this.hideClearConfirm();
    this.cdr.detectChanges();
  }
}
