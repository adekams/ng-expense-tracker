import { Injectable } from '@angular/core';
import { authState, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Auth, signInWithEmailAndPassword, signOut } from 'firebase/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private auth: Auth) {}

  signUp(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  signIn(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  signOut() {
    return signOut(this.auth);
  }

  getUser() {
    return authState(this.auth);
  }
}
