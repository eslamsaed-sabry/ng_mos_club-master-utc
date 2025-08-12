import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardChartService } from './dashboard-chart.service';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';


const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MMM',
  },
  display: {
    dateInput: 'MMMM',
    monthYearLabel: 'MMM',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

const routes: Routes = [
  { path: '', loadComponent: () => import('./dashboard.component').then(c => c.DashboardComponent) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [
    DashboardChartService,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class DashboardRoutingModule { }
