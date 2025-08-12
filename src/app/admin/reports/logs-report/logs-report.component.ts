import { Component, inject, OnInit } from '@angular/core';
import { LogsReport } from 'src/app/models/reports.model';
import { ReportsService } from 'src/app/services/reports.service';
import { TranslateModule } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { LogsReportFiltersComponent } from './logs-report-filters/logs-report-filters.component';
import { ReportsPageHeaderComponent } from '../reports-page-header/reports-page-header.component';

@Component({
  selector: 'app-logs-report',
  templateUrl: './logs-report.component.html',
  styleUrls: ['./logs-report.component.scss'],
  imports: [ReportsPageHeaderComponent, LogsReportFiltersComponent, DatePipe, TranslateModule]
})
export class LogsReportComponent implements OnInit {
  isResult: boolean;
  filters: LogsReport = new LogsReport();
  logs: any[] = [];
  private reportsService = inject(ReportsService);

  ngOnInit(): void {
  }

  clear() {
    this.isResult = false;
    this.filters = new LogsReport();
  }

  getAction(actionName: string) {
    switch (actionName) {
      case 'generate':
        this.generate();
        break;
      case 'clear':
        this.isResult = false;
        this.clear();
        break;
      default:
        window.print();
        break;
    }
  }

  generate() {
    this.isResult = false;
    this.reportsService.generateLogsReport(this.filters)
      .subscribe({
        next: (res) => {
          this.isResult = true;
          this.logs = res.data;
        },
      });
  }

}
