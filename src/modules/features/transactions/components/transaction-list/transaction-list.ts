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
}
