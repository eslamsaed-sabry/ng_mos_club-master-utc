import { Component, inject, OnInit } from '@angular/core';
import { MemberAttendanceFilters, MemberAttendanceReport } from 'src/app/models/reports.model';
import { ReportsService } from 'src/app/services/reports.service';
import { TranslateModule } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { MemberAttendanceFiltersComponent } from './member-attendance-filters/member-attendance-filters.component';
import { ReportsPageHeaderComponent } from '../reports-page-header/reports-page-header.component';

@Component({
  selector: 'app-member-attendance-report',
  templateUrl: './member-attendance-report.component.html',
  styleUrls: ['./member-attendance-report.component.scss'],
  imports: [ReportsPageHeaderComponent, MemberAttendanceFiltersComponent, DatePipe, TranslateModule]
})
export class MemberAttendanceReportComponent implements OnInit {

  filters: MemberAttendanceFilters = new MemberAttendanceFilters();
  reports: MemberAttendanceReport[];
  isResult: boolean;
  private reportsService = inject(ReportsService);

  ngOnInit(): void {
  }

  generate() {
    this.isResult = false;
    this.reportsService.getMemberAttendanceReport(this.filters).subscribe({
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
        this.filters = new MemberAttendanceFilters();
        break;
      default:
        window.print();
        break;
    }
  }

}

