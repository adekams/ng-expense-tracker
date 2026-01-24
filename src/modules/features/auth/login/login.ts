import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@core/services/authService';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class LoginComponent {
  loginForm!: any;
  constructor(
    private toast: ToastrService,
    private fb: FormBuilder,
    private authSvc: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  async onLogin() {
    if (this.loginForm.invalid) return;

    try {
      await this.authSvc.login(
        this.loginForm.value.email!,
        this.loginForm.value.password!
      );
      this.toast.success('Logged in successfully!');
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 1000);
    } catch (err) {
      alert('Login failed. Check your email or password.');
    }
  }
}
