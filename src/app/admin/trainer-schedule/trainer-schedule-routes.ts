import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DayService, WeekService, WorkWeekService, MonthService, AgendaService } from '@syncfusion/ej2-angular-schedule';
import { TimelineMonthService, TimelineViewsService } from '@syncfusion/ej2-angular-schedule';
import { ScheduleType } from 'src/app/models/enums';

const routes: Routes = [
  {
    path: '', loadComponent: () => import('./trainer-schedule.component').then(c => c.TrainerScheduleComponent), data:
      { scheduleTypeName: ScheduleType.trainerSchedule }
  },
  {
    path: 'doctors-schedule', loadComponent: () => import('./trainer-schedule.component').then(c => c.TrainerScheduleComponent), data:
      { scheduleTypeName: ScheduleType.DoctorsSchedule }
  },
  { path: 'trainers-time-table', loadComponent: () => import('./trainers-time-table/trainers-time-table.component').then(c => c.TrainersTimeTableComponent) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [DayService, WeekService, WorkWeekService, MonthService, AgendaService, TimelineViewsService, TimelineMonthService]

})
export class TrainerScheduleRoutingModule { }
