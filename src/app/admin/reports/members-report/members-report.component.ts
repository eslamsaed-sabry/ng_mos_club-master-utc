import { Component, inject, OnInit } from '@angular/core';
import { MembersFilters, MembersReport } from 'src/app/models/reports.model';
import { ReportsService } from 'src/app/services/reports.service';
import { TranslateModule } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { MembersFiltersComponent } from './members-filters/members-filters.component';
import { ReportsPageHeaderComponent } from '../reports-page-header/reports-page-header.component';

@Component({
  selector: 'app-members-report',
  templateUrl: './members-report.component.html',
  styleUrls: ['./members-report.component.scss'],
  imports: [ReportsPageHeaderComponent, MembersFiltersComponent, DatePipe, TranslateModule]
})
export class MembersReportComponent implements OnInit {

  filters: MembersFilters = new MembersFilters();
  reports: MembersReport[];
  isResult: boolean;
  private reportsService = inject(ReportsService);

  ngOnInit(): void {
  }

  generate() {
    this.isResult = false;

    this.reportsService.getMembersReport(this.filters).subscribe({
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
        this.filters = new MembersFilters();
        break;
      default:
        window.print();
        break;
    }
  }

}

