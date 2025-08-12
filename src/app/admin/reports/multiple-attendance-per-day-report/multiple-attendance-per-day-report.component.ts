import { Component, DestroyRef, inject } from '@angular/core';
import { MultipleAttendancePerDayReport, MultipleAttendancePerDayReportFilter } from 'src/app/models/reports.model';
import { ReportsPageHeaderComponent } from '../reports-page-header/reports-page-header.component';
import { MultipleAttendancePerDayReportFiltersComponent } from './multiple-attendance-per-day-report-filters/multiple-attendance-per-day-report-filters.component';
import { DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReportsService } from 'src/app/services/reports.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-multiple-attendance-per-day-report',
    templateUrl: './multiple-attendance-per-day-report.component.html',
    styleUrl: './multiple-attendance-per-day-report.component.scss',
    imports: [ReportsPageHeaderComponent, MultipleAttendancePerDayReportFiltersComponent, TranslateModule, DatePipe]
})
export class MultipleAttendancePerDayReportComponent {
  filters: MultipleAttendancePerDayReportFilter = new MultipleAttendancePerDayReportFilter();
  reports: MultipleAttendancePerDayReport[];
  isResult: boolean;
  private reportsService = inject(ReportsService);
  private destroyRef = inject(DestroyRef);


  generate() {
    this.isResult = false;
    this.reportsService.getMultipleAttendancePerDayReport(this.filters).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.isResult = true;
        this.reports = res.data;
      }
    })
  }

  getAction(actionName: string) {
    switch (actionName) {
      case 'generate':
        this.generate();
        break;
      case 'clear':
        this.isResult = false;
        this.filters = new MultipleAttendancePerDayReportFilter();
        break;
      default:
        window.print();
        break;
    }
  }

}
