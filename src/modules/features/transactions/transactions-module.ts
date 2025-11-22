import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { TransactionListComponent } from './components/transaction-list/transaction-list';
import { TransactionFormComponent } from './modals/transaction-form/transaction-form';
import { SharedModule } from '@shared/shared-module';
import { ConfirmModalComponent } from '@shared/modals/confirm-modal/confirm-modal';

@NgModule({
  declarations: [TransactionListComponent, TransactionFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    ConfirmModalComponent,
  ],
  exports: [TransactionListComponent, TransactionFormComponent],
})
export class TransactionsModule {}
