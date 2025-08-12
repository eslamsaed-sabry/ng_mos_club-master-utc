import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountsService } from 'src/app/services/accounts.service';


const routes: Routes = [
  { path: 'other-revenue', loadComponent: () => import('./other-revenue/other-revenue.component').then(c => c.OtherRevenueComponent) },
  { path: 'expenses', loadComponent: () => import('./expenses/expenses.component').then(c => c.ExpensesComponent) },
  { path: 'deductions', loadComponent: () => import('./deductions/deductions.component').then(c => c.DeductionsComponent) },
  { path: 'advances', loadComponent: () => import('./advances/advances.component').then(c => c.AdvancesComponent) },
  { path: 'bonus', loadComponent: () => import('./bonus/bonus.component').then(c => c.BonusComponent) },
  { path: 'salaries', loadComponent: () => import('./salaries/salaries.component').then(c => c.SalariesComponent) },
  { path: 'employeesCommissions', loadComponent: () => import('./employees-commissions/employees-commissions.component').then(c => c.EmployeesCommissionsComponent) },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  providers: [AccountsService]
})
export class AccountsRoutingModule { }
