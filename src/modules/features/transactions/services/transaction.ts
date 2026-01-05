import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

export interface Transaction {
  id: string;
  amount: number;
  currency: string; // e.g. "NGN", "USD", "EUR"
  category: string;
  date: string;
  description?: string;
}

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private storageKey = 'transactions';
  private transactions$ = new BehaviorSubject<Transaction[]>(
    this.loadFromStorage()
  );

  constructor() {}

  private updateLocalStorage(transactions: Transaction[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(transactions));
    this.transactions$.next(transactions);
  }

  private loadFromStorage(): Transaction[] {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  private saveToStorage(transactions: Transaction[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(transactions));
  }

  getTransactions(): Observable<Transaction[]> {
    return this.transactions$.asObservable();
  }

  addTransaction(transaction: Omit<Transaction, 'id'>) {
    const newTransaction: Transaction = { ...transaction, id: uuidv4() };
    const updated = [...this.transactions$.value, newTransaction];
    this.saveToStorage(updated);
    this.transactions$.next(updated); // emit updated list
  }

  deleteTransaction(id: string) {
    const filtered = this.transactions$.value.filter((t) => t.id !== id);
    this.saveToStorage(filtered);
    this.transactions$.next(filtered); // emit updated list
  }

  clearAll(): void {
    localStorage.removeItem(this.storageKey);
    this.updateLocalStorage([]);
  }
}
