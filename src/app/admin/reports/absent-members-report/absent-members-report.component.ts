import { Component, inject, OnInit } from '@angular/core';
import { AbsentMembersReport } from 'src/app/models/reports.model';
import { ReportsService } from 'src/app/services/reports.service';
import { TranslateModule } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { AbsentMembersReportFiltersComponent } from './absent-members-report-filters/absent-members-report-filters.component';
import { ReportsPageHeaderComponent } from '../reports-page-header/reports-page-header.component';

@Component({
  selector: 'app-absent-members-report',
  templateUrl: './absent-members-report.component.html',
  styleUrls: ['./absent-members-report.component.scss'],
  imports: [ReportsPageHeaderComponent, AbsentMembersReportFiltersComponent, DatePipe, TranslateModule]
})
export class AbsentMembersReportComponent implements OnInit {
  isResult: boolean;
  filters: AbsentMembersReport = new AbsentMembersReport();
  logs: any[] = [];
  private reportsService = inject(ReportsService);

  ngOnInit(): void {
  }

  clear() {
    this.isResult = false;
    this.filters = new AbsentMembersReport();
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
    this.reportsService.generateAbsentMembersReport(this.filters)
      .subscribe({
        next: (res) => {
          this.isResult = true;
          this.logs = res.data;
        },
      });
  }

}
