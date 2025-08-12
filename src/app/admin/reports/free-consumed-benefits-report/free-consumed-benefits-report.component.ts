import { Component, inject, OnInit } from '@angular/core';
import { FreeConsumedBenefitsReport, FreeConsumedBenefitsReportFilter } from 'src/app/models/reports.model';
import { ReportsService } from 'src/app/services/reports.service';
import { TranslateModule } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { FreeConsumedBenefitsFiltersComponent } from './free-consumed-benefits-filters/free-consumed-benefits-filters.component';
import { ReportsPageHeaderComponent } from '../reports-page-header/reports-page-header.component';

@Component({
  selector: 'app-free-consumed-benefits-report',
  templateUrl: './free-consumed-benefits-report.component.html',
  styleUrls: ['./free-consumed-benefits-report.component.scss'],
  imports: [ReportsPageHeaderComponent, FreeConsumedBenefitsFiltersComponent, DatePipe, TranslateModule]
})
export class FreeConsumedBenefitsReportComponent implements OnInit {

  filters: FreeConsumedBenefitsReportFilter = new FreeConsumedBenefitsReportFilter();
  reports: FreeConsumedBenefitsReport[];
  isResult: boolean;
  hiddenIDs: string[] = [];
  private reportsService = inject(ReportsService);

  ngOnInit(): void {
  }

  generate() {
    this.isResult = false;
    this.hiddenIDs = [];

    this.reportsService.getFreeConsumedBenefitsReport(this.filters).subscribe({
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
        this.filters = new FreeConsumedBenefitsReportFilter();
        break;
      default:
        window.print();
        break;
    }
  }

}

