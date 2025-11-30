import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/authService';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.html',
})
export class SignupComponent {
  email = '';
  password = '';
  errorMessage = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  signup() {
    this.errorMessage = '';
    this.loading = true;

    this.auth
      .signup(this.email, this.password)
      .then(() => this.router.navigate(['/dashboard']))
      .catch((err) => (this.errorMessage = err.message))
      .finally(() => (this.loading = false));
  }
}
