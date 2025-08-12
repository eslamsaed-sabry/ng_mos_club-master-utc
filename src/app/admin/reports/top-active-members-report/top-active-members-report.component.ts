import { Component, inject, OnInit } from '@angular/core';
import { TopActiveMembersReport, TopActiveMembersReportFilter } from 'src/app/models/reports.model';
import { ReportsService } from 'src/app/services/reports.service';
import { TranslateModule } from '@ngx-translate/core';

import { TopActiveMembersReportFiltersComponent } from './top-active-members-report-filters/top-active-members-report-filters.component';
import { ReportsPageHeaderComponent } from '../reports-page-header/reports-page-header.component';

@Component({
    selector: 'app-top-active-members-report',
    templateUrl: './top-active-members-report.component.html',
    styleUrls: ['./top-active-members-report.component.scss'],
    imports: [ReportsPageHeaderComponent, TopActiveMembersReportFiltersComponent, TranslateModule]
})
export class TopActiveMembersReportComponent implements OnInit {

  filters: TopActiveMembersReportFilter = new TopActiveMembersReportFilter();
  reports: TopActiveMembersReport[];
  isResult: boolean;
  private reportsService = inject(ReportsService);

  ngOnInit(): void {
  }

  generate() {
    this.isResult = false;
    this.reportsService.getTopActiveMembersReport(this.filters).subscribe({
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
        this.filters = new TopActiveMembersReportFilter();
        break;
      default:
        window.print();
        break;
    }
  }

}

