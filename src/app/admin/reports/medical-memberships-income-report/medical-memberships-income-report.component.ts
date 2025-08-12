import { Component, inject, OnInit } from '@angular/core';
import { ReportsPageHeaderComponent } from '../reports-page-header/reports-page-header.component';
import { MedicalMembershipsIncomeReportFiltersComponent } from './medical-memberships-income-report-filters/medical-memberships-income-report-filters.component';
import { ReportTabsComponent } from '../report-tabs/report-tabs.component';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { GenderPipe } from 'src/app/pipes/gender.pipe';
import { MedicalMembershipsIncomeFilters, ProfitReport } from 'src/app/models/reports.model';
import { ReportsService } from 'src/app/services/reports.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-medical-memberships-income-report',
  templateUrl: './medical-memberships-income-report.component.html',
  styleUrl: './medical-memberships-income-report.component.scss',
  imports: [ReportsPageHeaderComponent, MedicalMembershipsIncomeReportFiltersComponent, ReportTabsComponent, MatTooltipModule, DecimalPipe, DatePipe, TranslateModule, GenderPipe]
})
export class MedicalMembershipsIncomeReportComponent implements OnInit {
  filters: MedicalMembershipsIncomeFilters = new MedicalMembershipsIncomeFilters();
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

    this.reportsService.getMedicalMembershipsIncomeReport(this.filters).pipe(
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
        this.filters = new MedicalMembershipsIncomeFilters();
        break;
      default:
        window.print();
        break;
    }
  }
}
