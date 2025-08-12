import { Component, Input, OnInit, OnChanges, SimpleChanges, inject, DestroyRef } from '@angular/core';
import { forkJoin } from 'rxjs';
import { IPackage } from 'src/app/models/member.model';
import { MembershipsReportFilter, NewNotRenewedMembershipsReportFilter, MembershipsLogReportFilter, MembershipLogTypes } from 'src/app/models/reports.model';
import { MemberService } from 'src/app/services/member.service';
import { ReportsService } from 'src/app/services/reports.service';
import { Gender, LookupType, PackageTypes } from 'src/app/models/enums';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import moment from 'moment';
import { TranslateModule } from '@ngx-translate/core';
import { RoleDirective } from '../../../../directives/role.directive';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatRadioModule } from '@angular/material/radio';
@Component({
    selector: 'app-memberships-report-filters',
    templateUrl: './memberships-report-filters.component.html',
    styleUrls: ['./memberships-report-filters.component.scss'],
    imports: [FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatCheckboxModule, MatDatepickerModule, RoleDirective, TranslateModule, MatRadioModule]
})
export class MembershipsReportFiltersComponent implements OnInit, OnChanges {
  @Input() filters: MembershipsReportFilter | NewNotRenewedMembershipsReportFilter | MembershipsLogReportFilter | any = {} as any;
  @Input() dataType: string;
  destroyRef = inject(DestroyRef);

  sales: any[] = [];
  packageType: any[] = [];
  packages: IPackage[] = [];
  coaches: any[] = [];
  statuses: any[] = [];
  sources: any[] = [];
  users: any[] = [];
  gender = Gender;
  logTypes = MembershipLogTypes;
  isActive: boolean = true;

  public memberService = inject(MemberService);
  public reportService = inject(ReportsService);

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataType'].currentValue === 'privateMemberships')
      this.filters.packageType = PackageTypes.PRIVATE;

    if (changes['dataType'].currentValue === 'all' || changes['dataType'].currentValue === 'privateMemberships') {
      const format1 = "YYYY-MM-DD";
      const today = new Date();
      const firstDayInMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      this.filters.paymentDateFrom = moment(firstDayInMonth).format(format1) + 'T00:00';
      this.filters.paymentDateTo = moment(today).format(format1) + 'T23:59';
      this.callLookups();
    }
    else if (changes['dataType'].currentValue === 'notRenewed' || changes['dataType'].currentValue === 'newRenewed') {
      forkJoin({
        sales: this.getLookups('sales'),
        packages: this.getLookups('packages'),
      }).pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((res: any) => {
          this.sales = res.sales;
          this.packages = res.packages.data;
        });
    } else if (changes['dataType'].currentValue === 'log') {
      this.getUsers();
    }
  }

  getUsers() {
    this.reportService.getUsers().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.users = res.data;
      }
    })
  }

  getSales() {
    this.getLookups('sales').pipe(takeUntilDestroyed(this.destroyRef)).subscribe((res: any) => {
      this.sales = res;
    })
  }

  callLookups() {
    return forkJoin({
      sales: this.getLookups('sales'),
      sources: this.getLookups('sources'),
      coaches: this.getLookups('coaches'),
      packageType: this.getLookups('packageType'),
      packages: this.getLookups('packages'),
      status: this.getLookups('status'),
    })
      .subscribe((res: any) => {
        this.sales = res.sales;
        this.sources = res.sources;
        this.coaches = res.coaches;
        this.packageType = res.packageType;
        this.packages = res.packages.data;
        this.statuses = res.status;
      });
  }

  getLookups(lookupName: string): any {
    switch (lookupName) {
      case 'sales':
        return this.memberService.getLookup(LookupType.Sales, this.isActive);
      case 'sources':
        return this.memberService.getLookup(LookupType.SourceOfKnowledge);
      case 'coaches':
        return this.memberService.getLookup(LookupType.Trainers);
      case 'packageType':
        return this.memberService.getLookup(LookupType.PackageType, this.isActive);
      case 'packages':
        return this.memberService.getPackages(this.filters);
      case 'status':
        return this.memberService.getLookup(LookupType.MembershipStatus);
    }
  }

  changePackageType() {
    this.memberService.getPackagesByTypeAndCategory(this.filters).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.packages = res.data;
      }
    })
  }

  onChange(fieldName: string, value: MatCheckboxChange) {

    if (!value.checked) {
      this.filters[fieldName] = null;
    } else {
      switch (fieldName) {
        case "paymentDateFrom":
        case "paymentDateTo":
        case "fromDate":
        case "toDate":
          this.filters[fieldName] = moment(new Date()).format("YYYY-MM-DD") + 'T' + moment(new Date()).format('HH:mm');
          break;
        default:
          this.filters[fieldName] = new Date();
          break;
      }
    }
  }

  onSelect() {
    if (this.filters.packagesIds.includes(0)) {
      this.filters.packagesIds = [0, ...this.packages.map(el => el.id)];
    } else {
      this.filters.packagesIds = [];
    }
  }

}
