import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/authService';

@Component({
  selector: 'app-login',
  standalone: true,
  styleUrl: './login.scss',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.errorMessage = '';
    this.loading = true;

    this.auth
      .login(this.email, this.password)
      .then(() => this.router.navigate(['/dashboard']))
      .catch((err) => (this.errorMessage = err.message))
      .finally(() => (this.loading = false));
  }

  clicked() {
    alert('clicked');
  }
}
