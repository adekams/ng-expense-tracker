import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummaryCard } from './components/summary-card/summary-card';

@NgModule({
  declarations: [SummaryCard],
  imports: [CommonModule],
  exports: [SummaryCard],
})
export class SharedModule {}
