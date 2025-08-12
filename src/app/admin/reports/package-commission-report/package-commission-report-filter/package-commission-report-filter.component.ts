import { Component, Input, OnInit } from '@angular/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatOptionModule } from '@angular/material/core';
import { LookupType } from 'src/app/models/enums';
import { PackageCommissionReport } from 'src/app/models/reports.model';
import { CommonService } from 'src/app/services/common.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { MatSelectModule } from '@angular/material/select';
import { RoleDirective } from '../../../../directives/role.directive';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MMM',
  },
  display: {
    dateInput: 'MMMM',
    monthYearLabel: 'MMM',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
    selector: 'app-package-commission-report-filter',
    templateUrl: './package-commission-report-filter.component.html',
    styleUrls: ['./package-commission-report-filter.component.scss'],
    providers: [{
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        }, { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }],
    imports: [FormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, RoleDirective, MatSelectModule, MatOptionModule, MatCheckboxModule, TranslateModule]
})
export class PackageCommissionReportFilterComponent implements OnInit {
  @Input() filters: PackageCommissionReport;
  employees: any[] = [];
  allIds: number[];
  selection: string = 'Select All';
  date: Date = new Date();

  constructor(private commonService: CommonService) { }

  ngOnInit(): void {
    this.getEmployees();
    this.onSelectDate();
  }

  onSelectDate() {
    this.filters.month = new Date(this.date).getMonth() + 1;
    this.filters.year = new Date(this.date).getFullYear();
  }

  getEmployees() {
    this.commonService.getLookup(LookupType.Staff).subscribe({
      next: (res: any) => {
        this.employees = res;
        this.allIds = this.employees.map(el => el.id);
      }
    })
  }

  onSelect() {
    setTimeout(() => {
      if (this.filters.employeesIds.includes(0)) {
        this.filters.employeesIds = [0, ...this.employees.map(el => el.id)];
      } else {
        this.filters.employeesIds = [];
      }
    }, 100);
  }
}
