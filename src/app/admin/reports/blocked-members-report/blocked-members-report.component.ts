import { Component, inject, OnInit } from '@angular/core';
import { BlockedMembersFilters, BlockedMembersReport } from 'src/app/models/reports.model';
import { ReportsService } from 'src/app/services/reports.service';
import { TranslateModule } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { BlockedMembersFiltersComponent } from './blocked-members-filters/blocked-members-filters.component';
import { ReportsPageHeaderComponent } from '../reports-page-header/reports-page-header.component';

@Component({
  selector: 'app-blocked-members-report',
  templateUrl: './blocked-members-report.component.html',
  styleUrls: ['./blocked-members-report.component.scss'],
  imports: [ReportsPageHeaderComponent, BlockedMembersFiltersComponent, DatePipe, TranslateModule]
})
export class BlockedMembersReportComponent implements OnInit {

  filters: BlockedMembersFilters = new BlockedMembersFilters();
  reports: BlockedMembersReport[];
  isResult: boolean;
  private reportsService = inject(ReportsService);

  ngOnInit(): void {
  }

  generate() {
    this.isResult = false;

    this.reportsService.getBlockedMembersReport(this.filters).subscribe({
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
        this.filters = new BlockedMembersFilters();
        break;
      default:
        window.print();
        break;
    }
  }

}
