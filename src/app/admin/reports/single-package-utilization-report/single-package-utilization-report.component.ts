import { Component, inject } from '@angular/core';
import { ProfitReport, SinglePackageUtilReport } from 'src/app/models/reports.model';
import { ReportsService } from 'src/app/services/reports.service';
import { GenderPipe } from '../../../pipes/gender.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ReportTabsComponent } from '../report-tabs/report-tabs.component';
import { AsyncPipe, DatePipe } from '@angular/common';
import { ReportsPageHeaderComponent } from '../reports-page-header/reports-page-header.component';
import { ActivatedRoute } from '@angular/router';
import { SinglePackageUtilizationReportFiltersComponent } from './single-package-utilization-report-filters/single-package-utilization-report-filters.component';
import { tap } from 'rxjs';

@Component({
  selector: 'app-single-package-utilization-report',
  templateUrl: './single-package-utilization-report.component.html',
  styleUrls: ['./single-package-utilization-report.component.scss'],
  imports: [ReportsPageHeaderComponent, SinglePackageUtilizationReportFiltersComponent, ReportTabsComponent, MatTooltipModule, 
    DatePipe, TranslateModule, GenderPipe, AsyncPipe]
})
export class SinglePackageUtilizationReportComponent {
  private route = inject(ActivatedRoute);
  filters: SinglePackageUtilReport = new SinglePackageUtilReport();
  reports: ProfitReport;
  tabs: string[] = ['memberships', 'debts', 'upgrade','downgrade','freeze','refund'];
  isResult: boolean;
  private reportsService = inject(ReportsService);
  init$ = this.route.queryParams.pipe(tap(params => {
    this.filters.fromDate = params['fromDate'];
    this.filters.toDate = params['toDate'];
    this.filters.gender = +params['gender'];
    this.filters.packageCategory = +params['category'];
    this.filters.packageName = params['packageName'];
    this.filters.packageId = +this.route.snapshot.params['id'];
    this.generate();
  }))


  generate() {
    this.isResult = false;
    this.reportsService.generateSinglePackageUntilReport(this.filters).subscribe({
      next: (res) => {
        this.isResult = true;
        this.reports = res.data;
      }
    })

  }

  calcTotal(array: any[], col: string): number {
    let result: number = 0;
    array!.forEach((el) => {
      result += el[col]
    });
    return result;
  }


  getAction(actionName: string) {
    switch (actionName) {
      case 'generate':
        this.generate();
        break;
      case 'clear':
        this.isResult = false;
        this.filters = new SinglePackageUtilReport();
        break;
      default:
        window.print();
        break;
    }
  }
}
