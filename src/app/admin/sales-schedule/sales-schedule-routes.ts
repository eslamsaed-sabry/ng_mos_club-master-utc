import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DayService, WeekService, WorkWeekService, MonthService, AgendaService } from '@syncfusion/ej2-angular-schedule';

const routes: Routes = [
  { path: '', loadComponent: () => import('./sales-schedule.component').then(c => c.SalesScheduleComponent) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [DayService, WeekService, WorkWeekService, MonthService, AgendaService]

})
export class SalesScheduleRoutingModule { }
