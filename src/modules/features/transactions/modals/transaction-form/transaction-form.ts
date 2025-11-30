import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TransactionService } from '../../services/transaction';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  templateUrl: './transaction-form.html',
  imports: [CommonModule, ReactiveFormsModule],
})
export class TransactionFormComponent {
  @Output() added = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService
  ) {
    this.form = this.fb.group({
      currency: ['NGN', Validators.required],
      amount: [0, [Validators.required]],
      category: ['', Validators.required],
      date: [new Date().toISOString().substring(0, 10), Validators.required],
      description: [''],
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const form = this.form.value;

    const newTx = {
      amount: form.amount,
      currency: form.currency,
      category: form.category,
      date: form.date,
      description: form.description?.trim() || '-',
    };

    this.transactionService.addTransaction(newTx);

    this.form.reset({
      amount: 0,
      category: '',
      currency: 'NGN',
      date: new Date().toISOString().substring(0, 10),
      description: '',
    });

    this.added.emit();
  }

  onClose() {
    this.close.emit();
  }
}
