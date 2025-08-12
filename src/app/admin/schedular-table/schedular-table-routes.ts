import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DayService, WeekService, WorkWeekService, MonthService, AgendaService } from '@syncfusion/ej2-angular-schedule';
import { ScheduleService } from 'src/app/services/schedule.service';

const routes: Routes = [
  { path: '', loadComponent: () => import('./schedular-table-container/schedular-table-container.component').then(c => c.SchedularTableContainerComponent) },
  {
    path: 'booking-list',
    loadChildren: () => import('./booking-list/booking-list-routes').then(m => m.BookingListRoutingModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [DayService, WeekService, WorkWeekService, MonthService, AgendaService, ScheduleService]
})
export class SchedularTableRoutingModule { }
