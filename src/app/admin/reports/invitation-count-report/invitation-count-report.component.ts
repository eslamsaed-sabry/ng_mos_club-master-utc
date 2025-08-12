import { Component, inject, OnInit } from '@angular/core';
import { InvitationCountReportFilter, InvitationCountReport } from 'src/app/models/reports.model';
import { ReportsService } from 'src/app/services/reports.service';
import { TranslateModule } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { InvitationCountFiltersComponent } from './invitation-count-filters/invitation-count-filters.component';
import { ReportsPageHeaderComponent } from '../reports-page-header/reports-page-header.component';

@Component({
  selector: 'app-invitation-count-report',
  templateUrl: './invitation-count-report.component.html',
  styleUrls: ['./invitation-count-report.component.scss'],
  imports: [ReportsPageHeaderComponent, InvitationCountFiltersComponent, DatePipe, TranslateModule]
})
export class InvitationCountReportComponent implements OnInit {

  filters: InvitationCountReportFilter = new InvitationCountReportFilter();
  reports: InvitationCountReport[];
  isResult: boolean;
  hiddenIDs: string[] = [];
  private reportsService = inject(ReportsService);

  ngOnInit(): void {
  }

  generate() {
    this.isResult = false;
    this.hiddenIDs = [];

    this.reportsService.getInvitationCountReport(this.filters).subscribe({
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
        this.filters = new InvitationCountReportFilter();
        break;
      default:
        window.print();
        break;
    }
  }

}

