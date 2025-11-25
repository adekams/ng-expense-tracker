import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { TransactionList } from './components/transaction-list/transaction-list';
import { TransactionForm } from './modals/transaction-form/transaction-form';
import { SharedModule } from '@shared/shared-module';

@NgModule({
  declarations: [TransactionList, TransactionForm],
  imports: [CommonModule, ReactiveFormsModule, SharedModule],
})
export class TransactionsModule {}
