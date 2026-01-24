import { inject, Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  serverTimestamp,
} from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';

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

  private firestore = inject(Firestore);
  private auth = inject(Auth);

  constructor() {}

  updateLocalStorage(transactions: Transaction[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(transactions));
    this.transactions$.next(transactions);
  }

  private loadFromStorage(): Transaction[] {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  getTransactions(): Observable<Transaction[]> {
    const user = this.auth.currentUser;
    if (!user) return this.transactions$.asObservable();

    const ref = collection(this.firestore, 'transactions');
    const q = query(ref, where('userId', '==', user.uid));

    return collectionData(q, { idField: 'id' }) as Observable<Transaction[]>;
  }

  async addTransaction(tx: Omit<Transaction, 'id' | 'userId'>) {
    const user = this.auth.currentUser;
    if (!user) throw new Error('User not logged in');

    return addDoc(collection(this.firestore, 'transactions'), {
      ...tx,
      userId: user.uid,
      createdAt: serverTimestamp(),
    });
  }

  deleteTransaction(id: string) {
    return deleteDoc(doc(this.firestore, `transactions/${id}`));
  }

  clearAll() {
    localStorage.removeItem(this.storageKey);
    this.transactions$.next([]);
  }
}
