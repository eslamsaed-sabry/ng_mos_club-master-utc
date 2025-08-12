import { Component, inject, OnInit } from '@angular/core';
import { NotActiveMembersReport } from 'src/app/models/reports.model';
import { ReportsService } from 'src/app/services/reports.service';
import { TranslateModule } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { NotActiveMembersReportFiltersComponent } from './not-active-members-report-filters/not-active-members-report-filters.component';
import { ReportsPageHeaderComponent } from '../reports-page-header/reports-page-header.component';

@Component({
    selector: 'app-not-active-members',
    templateUrl: './not-active-members.component.html',
    styleUrls: ['./not-active-members.component.scss'],
    imports: [ReportsPageHeaderComponent, NotActiveMembersReportFiltersComponent, DatePipe, TranslateModule]
})
export class NotActiveMembersComponent implements OnInit {
  isResult: boolean;
  filters: NotActiveMembersReport = new NotActiveMembersReport();
  packages: any[] = [];
  inactiveMembers: any[] = [];
  private reportsService = inject(ReportsService);

  ngOnInit(): void {
  }

  clear() {
    this.isResult = false;
    this.filters = new NotActiveMembersReport();
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
    this.reportsService.generateNotActiveMembersReport(this.filters)
      .subscribe({
        next: (res) => {
          this.isResult = true;
          this.inactiveMembers = res.data;
        },
      });
  }
}
