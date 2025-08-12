import { Component, inject, OnInit } from '@angular/core';
import { PackageUtilizationPerSalesPersonalReportFilter, PackageUtilizationPerSalesPersonalReport } from 'src/app/models/reports.model';
import { ReportsService } from 'src/app/services/reports.service';
import { TranslateModule } from '@ngx-translate/core';

import { PackageUtilizationPerSalesPersonalReportFiltersComponent } from './package-utilization-per-sales-personal-report-filters/package-utilization-per-sales-personal-report-filters.component';
import { ReportsPageHeaderComponent } from '../reports-page-header/reports-page-header.component';

@Component({
    selector: 'app-package-utilization-per-sales-personal-report',
    templateUrl: './package-utilization-per-sales-personal-report.component.html',
    styleUrl: './package-utilization-per-sales-personal-report.component.scss',
    imports: [ReportsPageHeaderComponent, PackageUtilizationPerSalesPersonalReportFiltersComponent, TranslateModule]
})
export class PackageUtilizationPerSalesPersonalReportComponent implements OnInit {

  filters: PackageUtilizationPerSalesPersonalReportFilter = new PackageUtilizationPerSalesPersonalReportFilter();
  reports: PackageUtilizationPerSalesPersonalReport[];
  isResult: boolean;
  hiddenIDs: string[] = [];
  private reportsService = inject(ReportsService);

  ngOnInit(): void {
  }

  generate() {
    this.isResult = false;
    this.hiddenIDs = [];

    this.reportsService.getPackageUtilizationPerSalesPersonalReport(this.filters).subscribe({
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
        this.filters = new PackageUtilizationPerSalesPersonalReportFilter();
        break;
      default:
        window.print();
        break;
    }
  }

}

