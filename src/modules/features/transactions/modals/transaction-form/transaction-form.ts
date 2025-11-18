import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransactionService } from '../../services/transaction';

@Component({
  selector: 'app-transaction-form',
  standalone: false,
  templateUrl: './transaction-form.html',
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
      amount: [0, [Validators.required, Validators.min(0.01)]],
      category: ['', Validators.required],
      date: [new Date().toISOString().substring(0, 10), Validators.required],
      description: [''],
    });
  }

  submit() {
    if (this.form.valid) {
      this.transactionService.addTransaction(this.form.value);
      this.form.reset({
        amount: 0,
        category: '',
        date: new Date().toISOString().substring(0, 10),
        description: '',
      });
      this.added.emit();
    }
  }

  onClose() {
    this.close.emit();
  }
}
