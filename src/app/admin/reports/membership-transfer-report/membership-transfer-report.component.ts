import { Component, inject, OnInit } from '@angular/core';
import { MembershipTransferReportFilter, MembershipTransferReport } from 'src/app/models/reports.model';
import { ReportsService } from 'src/app/services/reports.service';
import { TranslateModule } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { MembershipTransferFiltersComponent } from './membership-transfer-filters/membership-transfer-filters.component';
import { ReportsPageHeaderComponent } from '../reports-page-header/reports-page-header.component';

@Component({
  selector: 'app-membership-transfer-report',
  templateUrl: './membership-transfer-report.component.html',
  styleUrls: ['./membership-transfer-report.component.scss'],
  imports: [ReportsPageHeaderComponent, MembershipTransferFiltersComponent, DatePipe, TranslateModule]
})
export class MembershipTransferReportComponent implements OnInit {

  filters: MembershipTransferReportFilter = new MembershipTransferReportFilter();
  reports: MembershipTransferReport[];
  isResult: boolean;
  private reportsService = inject(ReportsService);

  ngOnInit(): void {
  }

  generate() {
    this.isResult = false;
    this.reportsService.getMembershipTransferReport(this.filters).subscribe({
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
        this.filters = new MembershipTransferReportFilter();
        break;
      default:
        window.print();
        break;
    }
  }

}

