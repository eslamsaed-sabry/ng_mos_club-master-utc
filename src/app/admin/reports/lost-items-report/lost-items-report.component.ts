import { Component, inject, OnInit } from '@angular/core';
import { lostItemsReportFilter, lostItemsReport } from 'src/app/models/reports.model';
import { ReportsService } from 'src/app/services/reports.service';
import { TranslateModule } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { LostItemsFiltersComponent } from './lost-items-filters/lost-items-filters.component';
import { ReportsPageHeaderComponent } from '../reports-page-header/reports-page-header.component';

@Component({
  selector: 'app-lost-items-report',
  templateUrl: './lost-items-report.component.html',
  styleUrls: ['./lost-items-report.component.scss'],
  imports: [ReportsPageHeaderComponent, LostItemsFiltersComponent, DatePipe, TranslateModule]
})
export class LostItemsReportComponent implements OnInit {

  filters: lostItemsReportFilter = new lostItemsReportFilter();
  reports: lostItemsReport[];
  isResult: boolean;
  hiddenIDs: string[] = [];
  private reportsService = inject(ReportsService);

  ngOnInit(): void {
  }

  generate() {
    this.isResult = false;
    this.hiddenIDs = [];

    this.reportsService.getLostItemsReport(this.filters).subscribe({
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
        this.filters = new lostItemsReportFilter();
        break;
      default:
        window.print();
        break;
    }
  }

}

