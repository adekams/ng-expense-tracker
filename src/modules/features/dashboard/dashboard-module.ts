import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from '@features/dashboard/dashboard';
import { RouterModule, Routes } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { TransactionsModule } from '@features/transactions/transactions-module';
import { FormsModule } from '@angular/forms';
import { ConfirmModalComponent } from '@shared/modals/confirm-modal/confirm-modal';

const routes: Routes = [{ path: '', component: DashboardComponent }];

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CurrencyPipe,
    FormsModule,
    TransactionsModule,
    ConfirmModalComponent,
  ],
})
export class DashboardModule {}
