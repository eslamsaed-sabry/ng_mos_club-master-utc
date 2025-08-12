import { ConsumedPTSessionsReportFiltersComponent } from './consumed-pt-sessions-report-filters/consumed-pt-sessions-report-filters.component';
import { Component, inject } from '@angular/core';
import { ReportsPageHeaderComponent } from '../reports-page-header/reports-page-header.component';
import { DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ConsumedPTSessionsReport, ConsumedPTSessionsReportFilter } from 'src/app/models/reports.model';
import { ReportsService } from 'src/app/services/reports.service';

@Component({
    selector: 'app-consumed-pt-sessions-report',
    templateUrl: './consumed-pt-sessions-report.component.html',
    styleUrl: './consumed-pt-sessions-report.component.scss',
    imports: [ReportsPageHeaderComponent, ConsumedPTSessionsReportFiltersComponent, TranslateModule, DatePipe]
})
export class ConsumedPTSessionsReportComponent {

  filters: ConsumedPTSessionsReportFilter = new ConsumedPTSessionsReportFilter();
  reports: ConsumedPTSessionsReport[];
  isResult: boolean;
  hiddenIDs: string[] = [];
  private reportsService = inject(ReportsService);


  generate() {
    this.isResult = false;
    this.hiddenIDs = [];

    this.reportsService.getConsumedPTSessionsReport(this.filters).subscribe({
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
        this.filters = new ConsumedPTSessionsReportFilter();
        break;
      default:
        window.print();
        break;
    }
  }

}

