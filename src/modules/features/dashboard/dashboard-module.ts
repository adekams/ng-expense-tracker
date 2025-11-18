import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from '@features/dashboard/dashboard';
import { RouterModule, Routes } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { TransactionsModule } from '@features/transactions/transactions-module';

const routes: Routes = [
  { path: '', component: DashboardComponent }, // this is what loads at '/'
];

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CurrencyPipe,
    TransactionsModule,
  ],
})
export class DashboardModule {}
