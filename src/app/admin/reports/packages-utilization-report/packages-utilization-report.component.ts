import { Component, inject } from '@angular/core';
import { IPackageUtilizationReport, PackagesUtilReport } from 'src/app/models/reports.model';
import { ReportsService } from 'src/app/services/reports.service';
import { TranslateModule } from '@ngx-translate/core';
import { DecimalPipe } from '@angular/common';
import { PackagesUtilReportFiltersComponent } from './packages-util-report-filters/packages-util-report-filters.component';
import { ReportsPageHeaderComponent } from '../reports-page-header/reports-page-header.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-packages-utilization-report',
  templateUrl: './packages-utilization-report.component.html',
  styleUrls: ['./packages-utilization-report.component.scss'],
  imports: [ReportsPageHeaderComponent, PackagesUtilReportFiltersComponent, DecimalPipe, TranslateModule]
})
export class PackagesUtilizationReportComponent {
  private reportsService = inject(ReportsService);
  private router = inject(Router)
  isResult: boolean;
  filters: PackagesUtilReport = new PackagesUtilReport();
  packages: IPackageUtilizationReport[] = [];

  clear() {
    this.isResult = false;
    this.filters = new PackagesUtilReport();
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

  calcTotal(array: any[], col: string): number {
    let result: number = 0;
    array!.forEach((el) => {
      result += el[col]
    });
    return result;
  }

  generate() {
    this.isResult = false;
    this.reportsService.generatePackagesUntilReport(this.filters)
      .subscribe({
        next: (res) => {
          this.isResult = true;
          this.packages = res.data;
        },
      });
  }

  onRowClick(pkg: IPackageUtilizationReport) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/admin/reports/packagesUntil', pkg.packageId], {
        queryParams: {
          fromDate: this.filters.fromDate,
          toDate: this.filters.toDate,
          gender: this.filters.gender,
          category: this.filters.packageCategory,
          packageName: pkg.periodEnglishName
        }
      })
    );
    window.open(url, '_blank');
  }

}
