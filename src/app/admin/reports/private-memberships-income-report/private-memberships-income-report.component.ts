import { DecimalPipe, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { tap } from 'rxjs';
import { PrivateMembershipsIncomeFilters, ProfitReport } from 'src/app/models/reports.model';
import { GenderPipe } from 'src/app/pipes/gender.pipe';
import { ReportsService } from 'src/app/services/reports.service';
import { ReportTabsComponent } from '../report-tabs/report-tabs.component';
import { ReportsPageHeaderComponent } from '../reports-page-header/reports-page-header.component';
import { PrivateMembershipsIncomeReportFiltersComponent } from './private-memberships-income-report-filters/private-memberships-income-report-filters.component';

@Component({
    selector: 'app-private-memberships-income-report',
    templateUrl: './private-memberships-income-report.component.html',
    styleUrl: './private-memberships-income-report.component.scss',
    imports: [ReportsPageHeaderComponent, PrivateMembershipsIncomeReportFiltersComponent, ReportTabsComponent, MatTooltipModule, DecimalPipe, DatePipe, TranslateModule, GenderPipe]
})
export class PrivateMembershipsIncomeReportComponent implements OnInit {
  filters: PrivateMembershipsIncomeFilters = new PrivateMembershipsIncomeFilters();
  reports: ProfitReport;
  tabs: string[] = [];
  isResult: boolean;
  hiddenIDs: string[] = [];
  private reportsService = inject(ReportsService);

  ngOnInit(): void {
  }

  generate() {
    this.tabs = [];
    this.isResult = false;
    this.hiddenIDs = [];

    this.reportsService.generatePrivateMembershipsIncomeReport(this.filters).pipe(
      tap((res) => {
        this.isResult = true;
        this.reports = res.data;
        Object.entries(this.reports).forEach(([k, v]) => {
          if (k !== 'reservations' && k !== 'otherRevenue' && v.length > 0) {
            this.tabs.push(k);
          } else if (v.length === 0) {
            this.hiddenIDs.push(k);
          }
        });
      })
    ).subscribe({
      complete: () => {
        setTimeout(() => {
          this.hiddenIDs.forEach((el: string) => {
            if (document.getElementById(el))
              document.getElementById(el)!.style.display = 'none';
          });
        }, 500);
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
        this.filters = new PrivateMembershipsIncomeFilters();
        break;
      default:
        window.print();
        break;
    }
  }
}
