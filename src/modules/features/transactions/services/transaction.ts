import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { collectionData } from '@angular/fire/firestore';

import {
  Firestore,
  collection,
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

  constructor(private firestore: Firestore, private auth: Auth) {}

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
    const transactionsRef = collection(this.firestore, 'transactions');
    const q = query(transactionsRef, where('userId', '==', user.uid));
    const obs = collectionData(q, { idField: 'id' }) as Observable<
      Transaction[]
    >;

    // Keep local cache in sync
    obs.subscribe((data) => this.updateLocalStorage(data));
    return this.transactions$.asObservable(); // Always return local + synced
  }

  // Accept only the form data, then add userId & timestamp
  async addTransaction(tx: Omit<Transaction, 'id' | 'userId'>) {
    const user = this.auth.currentUser;
    if (!user) throw new Error('User not logged in');

    const docRef = await addDoc(collection(this.firestore, 'transactions'), {
      ...tx,
      userId: user.uid,
      createdAt: serverTimestamp(),
    });

    return docRef;
  }

  deleteTransaction(id: string) {
    return deleteDoc(doc(this.firestore, `transactions/${id}`));
  }

  clearAll(): void {
    localStorage.removeItem(this.storageKey);
    this.updateLocalStorage([]);
  }
}
