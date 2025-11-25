import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummaryCard } from './components/summary-card/summary-card';
import { CurrencyPipePipe } from './pipes/currency-pipe-pipe';



@NgModule({
  declarations: [
    SummaryCard,
    CurrencyPipePipe
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
