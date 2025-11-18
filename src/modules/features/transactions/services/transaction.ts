import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
}

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private storageKey = 'transactions';

  constructor() {}

  getTransactions(): Observable<Transaction[]> {
    const data = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    return of(data);
  }

  addTransaction(transaction: Omit<Transaction, 'id'>): void {
    const transactions = JSON.parse(
      localStorage.getItem(this.storageKey) || '[]'
    );
    transactions.push({ ...transaction, id: uuidv4() });
    localStorage.setItem(this.storageKey, JSON.stringify(transactions));
  }

  deleteTransaction(id: string): void {
    const transactions = JSON.parse(
      localStorage.getItem(this.storageKey) || '[]'
    );
    const filtered = transactions.filter((t: Transaction) => t.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(filtered));
  }
}
