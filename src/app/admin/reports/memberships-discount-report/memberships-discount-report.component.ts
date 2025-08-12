import { Component, inject, OnInit } from '@angular/core';
import { Membership } from 'src/app/models/member.model';
import { MembershipsDiscountReportFilter } from 'src/app/models/reports.model';
import { ReportsService } from 'src/app/services/reports.service';
import { TranslateModule } from '@ngx-translate/core';
import { DecimalPipe, DatePipe } from '@angular/common';
import { MembershipsDiscountReportFiltersComponent } from './memberships-discount-report-filters/memberships-discount-report-filters.component';
import { ReportsPageHeaderComponent } from '../reports-page-header/reports-page-header.component';

@Component({
  selector: 'app-memberships-discount-report',
  templateUrl: './memberships-discount-report.component.html',
  styleUrls: ['./memberships-discount-report.component.scss'],
  imports: [ReportsPageHeaderComponent, MembershipsDiscountReportFiltersComponent, DecimalPipe, DatePipe, TranslateModule]
})
export class MembershipsDiscountReportComponent implements OnInit {

  filters: MembershipsDiscountReportFilter = new MembershipsDiscountReportFilter();
  reports: Membership[];
  isResult: boolean;
  private reportsService = inject(ReportsService);

  ngOnInit(): void {
  }

  generate() {
    this.isResult = false;
    this.reportsService.GetMembershipsHavingDiscount(this.filters).subscribe({
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
        this.filters = new MembershipsDiscountReportFilter();
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

