import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  currency: string;
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

  constructor(private firestore: Firestore, private authSvc: AuthService) {}

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
    const user = this.auth.currentUser;
    const transactionsRef = collection(this.firestore, 'transactions');
    const q = query(transactionsRef, where('userId', '==', user?.uid));
    return collectionData(q, { idField: 'id' }) as Observable<Transaction[]>;
  }

  addTransaction(tx: Transaction) {
    const user = this.auth.currentUser;
    return addDoc(collection(this.firestore, 'transactions'), { ...tx, userId: user?.uid });
  }

  deleteTransaction(id: string) {
    return deleteDoc(doc(this.firestore, `transactions/${id}`));
  }

  clearAll(): void {
    localStorage.removeItem(this.storageKey);
    this.updateLocalStorage([]);
  }
}
