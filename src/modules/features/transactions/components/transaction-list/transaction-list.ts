import { Component, OnInit } from '@angular/core';
import { Transaction, TransactionService } from '../../services/transaction';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfirmModalComponent } from '@shared/modals/confirm-modal/confirm-modal';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  templateUrl: './transaction-list.html',
  styleUrl: './transaction-list.scss',
  imports: [CommonModule, ReactiveFormsModule, ConfirmModalComponent],
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
      this.loadTransactions();
    }
    this.hideDeleteConfirmation();
  }
}
