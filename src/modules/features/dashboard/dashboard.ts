import { Component, OnInit, ViewChild } from '@angular/core';
import {
  TransactionService,
  Transaction,
} from '@features/transactions/services/transaction';
import { TransactionListComponent } from '@features/transactions/components/transaction-list/transaction-list';
import { TransactionFormComponent } from '@features/transactions/modals/transaction-form/transaction-form';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
})
export class DashboardComponent implements OnInit {
  transactionFormAdded = false;
  transactions: Transaction[] = [];
  totalIncome = 0;
  totalExpenses = 0;
  balance = 0;

  @ViewChild('transactionList') transactionList!: TransactionListComponent;
  @ViewChild('transactionForm') transactionForm!: TransactionFormComponent;

  constructor(private transactionService: TransactionService) {}

  ngOnInit() {
    this.transactionService.getTransactions().subscribe((data) => {
      this.transactions = data;
      this.calculateSummary();
    });
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
        });
      }
    });
  }

  loadTransactions() {
    this.transactionFormAdded = false;
    this.transactionService.getTransactions().subscribe((data) => {
      this.transactions = data;
      this.calculateSummary();
    });
  }

  calculateSummary() {
    this.totalIncome = this.transactions
      .filter((t) => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
    this.totalExpenses = this.transactions
      .filter((t) => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    this.balance = this.totalIncome - this.totalExpenses;
  }

  onTransactionAdded() {
    this.transactionFormAdded = false; // close modal
  }
}
