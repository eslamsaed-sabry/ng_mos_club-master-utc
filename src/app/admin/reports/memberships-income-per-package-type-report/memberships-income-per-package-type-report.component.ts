import { Component, OnInit, inject, viewChild } from '@angular/core';
import { ReportsPageHeaderComponent } from '../reports-page-header/reports-page-header.component';
import { MembershipsIncomePerPackageTypeReportFiltersComponent } from './memberships-income-per-package-type-report-filters/memberships-income-per-package-type-report-filters.component';
import { DatePipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { GenderPipe } from 'src/app/pipes/gender.pipe';
import { MembershipGroupedPackage, MembershipsIncomePerPackageTypeReportFilters, MembershipsIncomePerPackageTypeReportReport, MonitoringMembershipGroupedPackage } from 'src/app/models/reports.model';
import { ReportsService } from 'src/app/services/reports.service';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { tap } from 'rxjs';

@Component({
    selector: 'app-memberships-income-per-package-type-report',
    templateUrl: './memberships-income-per-package-type-report.component.html',
    styleUrl: './memberships-income-per-package-type-report.component.scss',
    imports: [ReportsPageHeaderComponent, MembershipsIncomePerPackageTypeReportFiltersComponent, MatTooltipModule, DatePipe, TranslateModule, GenderPipe, MatExpansionModule]
})

export class MembershipsIncomePerPackageTypeReportComponent implements OnInit {
  accordion = viewChild.required(MatAccordion);
  private reportsService = inject(ReportsService);
  isResult: boolean;
  filters: MembershipsIncomePerPackageTypeReportFilters = new MembershipsIncomePerPackageTypeReportFilters();
  reports: MembershipsIncomePerPackageTypeReportReport;
  groupedMembership: MembershipGroupedPackage[];
  groupedMonitoringMembership: MonitoringMembershipGroupedPackage[];
  // tabs: string[] = [];
  onPrint = false;
  hiddenIDs: string[] = [];

  ngOnInit(): void {

  }

  generate() {
    // this.tabs = [];
    this.isResult = false;
    this.hiddenIDs = [];

    this.reportsService.generateMembershipsIncomePerPackageTypeReportReport(this.filters).pipe(
      tap((res) => {
        this.isResult = true;
        this.reports = res.data;
        // Object.entries(this.reports).forEach(([k, v]) => {
        //   if (v?.length > 0) {
        //     this.tabs.push(k);
        //   } else if (v?.length === 0) {
        //     this.hiddenIDs.push(k);
        //   }
        // });
      })
    ).subscribe({
      next: (res) => {
        this.isResult = true;

        this.groupedMembership = this.reports.memberships.reduce((acc: MembershipGroupedPackage[], membership) => {
          const existingGroup = acc.find(
            packages => packages.packageTypeId === membership.packageTypeId
          );

          if (existingGroup) {
            existingGroup.memberships.push(membership);
          } else {
            acc.push({
              packageTypeId: membership.packageTypeId,
              packageTypeName: membership.packageTypeName,
              memberships: [membership]
            });
          }

          return acc;
        }, []);

        this.groupedMonitoringMembership = this.reports.monitoringMemberships.reduce((acc: MonitoringMembershipGroupedPackage[], membership) => {
          const existingGroup = acc.find(
            packages => packages.packageTypeId === membership.packageTypeId
          );

          if (existingGroup) {
            existingGroup.monitoringMemberships.push(membership);
          } else {
            acc.push({
              packageTypeId: membership.packageTypeId,
              packageTypeName: membership.packageTypeName,
              monitoringMemberships: [membership]
            });
          }

          return acc;
        }, []);
      },
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
        this.filters = new MembershipsIncomePerPackageTypeReportFilters();
        break;
      default:
        window.print();
        break;
    }
  }

  clear() {
    this.isResult = false;
    this.filters = new MembershipsIncomePerPackageTypeReportFilters();
  }
}
