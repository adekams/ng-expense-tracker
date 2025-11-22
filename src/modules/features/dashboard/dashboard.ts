import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import {
  TransactionService,
  Transaction,
} from '@features/transactions/services/transaction';
import { TransactionListComponent } from '@features/transactions/components/transaction-list/transaction-list';
import { TransactionFormComponent } from '@features/transactions/modals/transaction-form/transaction-form';
import { ExchangeRateService } from '@features/transactions/services/exchange-rate.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
})
export class DashboardComponent implements OnInit {
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
  clearConfirmVisible: boolean = false;
  baseCurrency: string = 'NGN';
  summaryCurrency: string = 'NGN';

  @ViewChild('transactionList') transactionList!: TransactionListComponent;
  @ViewChild('transactionForm') transactionForm!: TransactionFormComponent;

  constructor(
    private cdr: ChangeDetectorRef,
    private transactionSvc: TransactionService,
    private exchangeRateSvc: ExchangeRateService
  ) {}

  ngOnInit() {
    this.loadTransactions();
  }

  resetForm() {
    this.transactionFormAdded = true;

    setTimeout(() => {
      if (this.transactionForm && this.transactionForm.form) {
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
    this.transactionFormAdded = false;
    this.transactionSvc.getTransactions().subscribe((data) => {
      this.transactions = data;
      this.calculateSummary();
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
      [...uniqueCurrencies][0] === this.baseCurrency
    ) {
      // All transactions in base currency? direct totals
      this.totalIncome = this.transactions
        .filter((t) => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);
      this.totalExpenses = this.transactions
        .filter((t) => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      this.balance = this.totalIncome - this.totalExpenses;
      this.summaryCurrency = this.baseCurrency;
    } else {
      // Mixed currencies? convert to baseCurrency
      this.convertAndComputeTotals();
    }
  }

  convertAndComputeTotals() {
    this.exchangeRateSvc.getRates(this.baseCurrency).subscribe((rates) => {
      let income = 0;
      let expenses = 0;

      this.transactions.forEach((tx) => {
        const rate = rates[tx.currency] || 1;
        const converted = tx.amount * rate; // convert to base
        if (tx.amount > 0) income += converted;
        else expenses += Math.abs(converted);
      });

      this.totalIncome = income;
      this.totalExpenses = expenses;
      this.balance = income - expenses;
      this.summaryCurrency = this.baseCurrency;

      this.cdr.detectChanges();
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
