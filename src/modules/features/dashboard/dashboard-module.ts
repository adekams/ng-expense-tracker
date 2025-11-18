import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dashboard } from './dashboard';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: Dashboard }, // this is what loads at '/'
];

@NgModule({
  declarations: [Dashboard],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [Dashboard],
})
export class DashboardModule {}
