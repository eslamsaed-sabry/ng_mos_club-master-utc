import { Component, inject, OnInit } from '@angular/core';
import { PackageCommissionReport } from 'src/app/models/reports.model';
import { ReportsService } from 'src/app/services/reports.service';
import { GenderPipe } from '../../../pipes/gender.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { ReportTabsComponent } from '../report-tabs/report-tabs.component';
import { DecimalPipe, DatePipe } from '@angular/common';
import { PackageCommissionReportFilterComponent } from './package-commission-report-filter/package-commission-report-filter.component';
import { ReportsPageHeaderComponent } from '../reports-page-header/reports-page-header.component';

@Component({
    selector: 'app-package-commission-report',
    templateUrl: './package-commission-report.component.html',
    styleUrls: ['./package-commission-report.component.scss'],
    imports: [ReportsPageHeaderComponent, PackageCommissionReportFilterComponent, ReportTabsComponent, DecimalPipe, DatePipe, TranslateModule, GenderPipe]
})
export class PackageCommissionReportComponent implements OnInit {
  filters: PackageCommissionReport = new PackageCommissionReport();
  commissions: any;
  tabs: string[] = [];
  isResult: boolean;
  private reportsService = inject(ReportsService);

  ngOnInit(): void {
  }

  generate() {
    this.tabs = [];
    this.isResult = false;
    let newFilters = { ...this.filters }
    this.reportsService.generatePackageCommissionReport(newFilters).subscribe({
      next: (res) => {
        this.commissions = res.data;
        Object.keys(this.commissions).forEach(k => {
          this.tabs.push(k);
        });
        this.tabs = this.tabs.filter(item => item !== "summaryPerEmployee");
        this.tabs.unshift("summaryPerEmployee");
        this.isResult = true;
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
        this.filters = new PackageCommissionReport();
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
}
