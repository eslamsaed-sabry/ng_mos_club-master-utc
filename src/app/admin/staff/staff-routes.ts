import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Entities } from 'src/app/models/permissions.model';

const routes = [
  { path: 'staff-data', loadComponent: () => import('./staff-data/staff-data.component').then(c => c.StaffDataComponent) },
  { path: 'trainers-Data', loadComponent: () => import('./staff-data/staff-data.component').then(c => c.StaffDataComponent), data: [Entities.TRAINERS_DATA] },
  { path: 'instructors', loadComponent: () => import('./staff-data/staff-data.component').then(c => c.StaffDataComponent), data: [Entities.INSTRUCTORS_DATA] },
  { path: 'staffAttendance', loadComponent: () => import('./staff-attendance/staff-attendance.component').then(c => c.StaffAttendanceComponent) },
  { path: 'shifts', loadComponent: () => import('./shifts/shifts.component').then(c => c.ShiftsComponent) },
  { path: 'staff-statistics', loadComponent: () => import('./staff-statistics/staff-statistics.component').then(c => c.StaffStatisticsComponent) },
  { path: 'employees-requests', loadComponent: () => import('./employees-requests/employees-requests.component').then(c => c.EmployeesRequestsComponent) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)]
})
export class StaffRoutingModule { }
