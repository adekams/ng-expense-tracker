import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth, deleteUser, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { onAuthStateChanged } from 'firebase/auth';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import {
  Transaction,
  TransactionService,
} from '@features/transactions/services/transaction';
import { TransactionListComponent } from '@features/transactions/components/transaction-list/transaction-list';
import { TransactionFormComponent } from '@features/transactions/modals/transaction-form/transaction-form';
import { ExchangeRateService } from '@features/transactions/services/exchange-rate.service';
import { ConfirmModalComponent } from '@shared/modals/confirm-modal/confirm-modal';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  imports: [
    CommonModule,
    FormsModule,
    TransactionListComponent,
    TransactionFormComponent,
    ConfirmModalComponent,
  ],
})
export class DashboardComponent implements OnInit, OnDestroy {
  private readonly analyticsPalette = [
    '#2563eb',
    '#0f766e',
    '#ea580c',
    '#7c3aed',
    '#dc2626',
    '#0891b2',
  ];
  private destroy$ = new Subject<void>();

  private auth = inject(Auth);

  symbols: Record<string, string> = {
    USD: '$',
    EUR: '\u20AC',
    NGN: '\u20A6',
    GBP: '\u00A3',
  };

  transactionFormAdded = false;
  transactions: Transaction[] = [];
  totalIncome = 0;
  totalExpenses = 0;
  balance = 0;
  clearConfirmVisible = false;
  baseCurrency = 'NGN';
  summaryCurrency = 'NGN';
  currencyInsights: CurrencyInsight[] = [];
  expenseBreakdown: ExpenseBreakdownItem[] = [];
  exchangeRateInsights: ExchangeRateInsight[] = [];
  exchangeRateDate: string | null = null;
  expenseBreakdownGradient = 'conic-gradient(#e5e7eb 0 100%)';
  currentYear = new Date().getFullYear();

  errorMessage: string | null = null;

  userEmail: string | null = null;
  showUserMenu = false;
  deleteAccountVisible = false;

  @ViewChild('transactionList') transactionList!: TransactionListComponent;
  @ViewChild('transactionForm') transactionForm!: TransactionFormComponent;

  constructor(
    private router: Router,
    private toast: ToastrService,
    private cdr: ChangeDetectorRef,
    private transactionSvc: TransactionService,
    private exchangeRateSvc: ExchangeRateService
  ) {}

  ngOnInit() {
    const user = this.auth.currentUser;
    this.userEmail = user?.email || null;

    this.loadTransactions();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  closeUserMenu() {
    this.showUserMenu = false;
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
      this.resetAnalytics();
      return;
    }

    const uniqueCurrencies = new Set(this.transactions.map((tx) => tx.currency));

    if (
      uniqueCurrencies.size === 1 &&
      uniqueCurrencies.has(this.baseCurrency)
    ) {
      this.totalIncome = this.transactions
        .filter((tx) => tx.amount > 0)
        .reduce((sum, tx) => sum + tx.amount, 0);

      this.totalExpenses = this.transactions
        .filter((tx) => tx.amount < 0)
        .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

      this.balance = this.totalIncome - this.totalExpenses;
      this.summaryCurrency = this.baseCurrency;
      this.buildAnalytics();
      return;
    }

    this.convertAndComputeTotals();
  }

  convertAndComputeTotals() {
    this.errorMessage = null;

    if (!this.transactions.length) {
      return;
    }

    const currencies = Array.from(
      new Set(this.transactions.map((tx) => tx.currency))
    ).filter((currency) => currency !== this.baseCurrency);

    this.exchangeRateSvc
      .getRates(this.baseCurrency, currencies)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          const rates = data.quotes;
          let income = 0;
          let expenses = 0;

          this.transactions.forEach((tx) => {
            const convertedAmount = this.convertAmountToBase(
              tx.amount,
              tx.currency,
              rates
            );

            if (convertedAmount === null) {
              return;
            }

            if (convertedAmount > 0) {
              income += convertedAmount;
            } else {
              expenses += Math.abs(convertedAmount);
            }
          });

          this.totalIncome = income;
          this.totalExpenses = expenses;
          this.balance = income - expenses;
          this.summaryCurrency = this.baseCurrency;
          this.buildAnalytics(rates, data.date);
        },
        error: () => {
          this.errorMessage =
            'Exchange-rate data is unavailable right now. Converted analytics may be incomplete.';
          this.resetAnalytics(false);
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
    this.resetAnalytics();
    this.hideClearConfirm();
    this.cdr.detectChanges();
  }

  showDeleteAccount() {
    this.deleteAccountVisible = true;
  }

  hideDeleteAccount() {
    this.deleteAccountVisible = false;
  }

  async logout() {
    await signOut(this.auth);
    this.toast.success('Logged out successfully');
    this.router.navigate(['/login']);
  }

  async confirmDeleteAccount() {
    const user = this.auth.currentUser;

    if (!user) {
      return;
    }

    try {
      await deleteUser(user);
      this.toast.success('Your Account has been deleted successfully');
      this.router.navigate(['/login']);
    } catch (err: any) {
      if (err.code === 'auth/requires-recent-login') {
        this.toast.error('Please log in again before deleting your account.');
      } else {
        this.toast.error('Failed to delete account.');
      }
    }

    this.deleteAccountVisible = false;
  }

  private convertAmountToBase(
    amount: number,
    currency: string,
    rates: Record<string, number> = {}
  ): number | null {
    if (currency === this.baseCurrency) {
      return amount;
    }

    const rate = this.resolveRateToBase(currency, rates);

    if (rate === null) {
      return null;
    }

    return amount * rate;
  }

  private buildAnalytics(
    rates: Record<string, number> = {},
    exchangeDate: string | null = null
  ) {
    const currencyMap = new Map<
      string,
      { income: number; expenses: number; transactionCount: number }
    >();
    const categoryMap = new Map<string, number>();
    let totalTrackedExpenses = 0;

    this.transactions.forEach((tx) => {
      const convertedAmount = this.convertAmountToBase(
        tx.amount,
        tx.currency,
        rates
      );

      if (convertedAmount === null) {
        return;
      }

      const currencyTotals = currencyMap.get(tx.currency) ?? {
        income: 0,
        expenses: 0,
        transactionCount: 0,
      };

      currencyTotals.transactionCount += 1;

      if (convertedAmount > 0) {
        currencyTotals.income += convertedAmount;
      } else {
        const expenseAmount = Math.abs(convertedAmount);
        currencyTotals.expenses += expenseAmount;
        totalTrackedExpenses += expenseAmount;

        const category = tx.category?.trim() || 'Uncategorized';
        categoryMap.set(category, (categoryMap.get(category) ?? 0) + expenseAmount);
      }

      currencyMap.set(tx.currency, currencyTotals);
    });

    const currencyRows = Array.from(currencyMap.entries())
      .map(([currency, totals], index) => ({
        currency,
        income: totals.income,
        expenses: totals.expenses,
        balance: totals.income - totals.expenses,
        transactionCount: totals.transactionCount,
        expenseShare: 0,
        color: this.analyticsPalette[index % this.analyticsPalette.length],
      }))
      .sort(
        (a, b) =>
          b.expenses - a.expenses ||
          b.transactionCount - a.transactionCount ||
          a.currency.localeCompare(b.currency)
      );

    const totalCurrencyExpenses = currencyRows.reduce(
      (sum, item) => sum + item.expenses,
      0
    );

    this.currencyInsights = currencyRows.map((item) => ({
      ...item,
      expenseShare: totalCurrencyExpenses
        ? (item.expenses / totalCurrencyExpenses) * 100
        : 0,
    }));

    this.expenseBreakdown = Array.from(categoryMap.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([category, amount], index) => ({
        category,
        amount,
        share: totalTrackedExpenses ? (amount / totalTrackedExpenses) * 100 : 0,
        color: this.analyticsPalette[index % this.analyticsPalette.length],
      }));

    this.exchangeRateInsights = Array.from(
      new Set(this.transactions.map((tx) => tx.currency))
    )
      .filter((currency) => currency !== this.baseCurrency)
      .map((currency, index) => {
        const rateToBase = this.resolveRateToBase(currency, rates);

        if (rateToBase === null) {
          return null;
        }

        return {
          currency,
          basePerUnit: rateToBase,
          color: this.analyticsPalette[index % this.analyticsPalette.length],
        };
      })
      .filter((item): item is ExchangeRateInsight => item !== null);

    this.exchangeRateDate = exchangeDate;
    this.expenseBreakdownGradient = this.buildExpenseGradient();
  }

  private buildExpenseGradient() {
    if (!this.expenseBreakdown.length) {
      return 'conic-gradient(#e5e7eb 0 100%)';
    }

    let currentStop = 0;
    const segments = this.expenseBreakdown.map((item) => {
      const start = currentStop;
      currentStop += item.share;
      return `${item.color} ${start}% ${currentStop}%`;
    });

    return `conic-gradient(${segments.join(', ')})`;
  }

  private resetAnalytics(clearError = true) {
    this.currencyInsights = [];
    this.expenseBreakdown = [];
    this.exchangeRateInsights = [];
    this.exchangeRateDate = null;
    this.expenseBreakdownGradient = 'conic-gradient(#e5e7eb 0 100%)';

    if (clearError) {
      this.errorMessage = null;
    }
  }

  private resolveRateToBase(
    currency: string,
    rates: Record<string, number>
  ): number | null {
    const directKey = `${currency}${this.baseCurrency}`;
    const inverseKey = `${this.baseCurrency}${currency}`;

    if (typeof rates[directKey] === 'number' && rates[directKey] > 0) {
      return rates[directKey];
    }

    if (typeof rates[inverseKey] === 'number' && rates[inverseKey] > 0) {
      return 1 / rates[inverseKey];
    }

    return null;
  }
}

interface CurrencyInsight {
  currency: string;
  income: number;
  expenses: number;
  balance: number;
  transactionCount: number;
  expenseShare: number;
  color: string;
}

interface ExpenseBreakdownItem {
  category: string;
  amount: number;
  share: number;
  color: string;
}

interface ExchangeRateInsight {
  currency: string;
  basePerUnit: number;
  color: string;
}
