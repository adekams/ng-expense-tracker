import { Component, OnInit } from '@angular/core';
import { Transaction, TransactionService } from '../../services/transaction';

@Component({
  selector: 'app-transaction-list',
  standalone: false,
  templateUrl: './transaction-list.html',
  styleUrl: './transaction-list.scss',
})
export class TransactionListComponent implements OnInit {
  transactions: Transaction[] = [];
  selectedTransactionId: string | null = null;
  confirmationVisible = false;
  symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    NGN: '₦',
    GBP: '£',
  };
  constructor(private transactionService: TransactionService) {}

  ngOnInit() {
    this.loadTransactions();
  }

  loadTransactions() {
    this.transactionService
      .getTransactions()
      .subscribe((data) => (this.transactions = data));
  }

  deleteTransaction(id: string) {
    this.transactionService.deleteTransaction(id);
    this.loadTransactions();
  }

  showDeleteConfirmation(id: string) {
    this.selectedTransactionId = id;
    this.confirmationVisible = true;
  }

  hideDeleteConfirmation() {
    this.confirmationVisible = false;
    this.selectedTransactionId = null;
  }

  confirmDelete() {
    if (this.selectedTransactionId) {
      this.transactionService.deleteTransaction(this.selectedTransactionId);
      this.loadTransactions(); // reload list
    }
    this.hideDeleteConfirmation();
  }
}
