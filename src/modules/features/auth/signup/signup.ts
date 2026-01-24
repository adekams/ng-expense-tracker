import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.scss'],
})
export class SignupComponent {
  errorMessage = '';
  isLoading = false;
  signUpForm!: any;
  constructor(
    private toast: ToastrService,
    private fb: FormBuilder,
    private auth: Auth,
    private router: Router
  ) {
    this.signUpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  async handleSignup() {
    this.errorMessage = '';
    this.isLoading = true;

    try {
      await createUserWithEmailAndPassword(
        this.auth,
        this.signUpForm.value.email,
        this.signUpForm.value.password
      );

      this.isLoading = false;
      this.toast.success('Account created! You can now log in.');
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 1000);
    } catch (err: any) {
      this.isLoading = false;
      this.errorMessage = err.message || 'Signup failed';
    }
  }
}
