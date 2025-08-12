import { Component, Input, OnInit } from '@angular/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatOptionModule } from '@angular/material/core';
import { LookupType } from 'src/app/models/enums';
import { EmployeePayrollReportFilter } from 'src/app/models/reports.model';
import { CommonService } from 'src/app/services/common.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatRadioModule } from '@angular/material/radio';

import { MatSelectModule } from '@angular/material/select';
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
    selector: 'app-employee-payroll-filters',
    templateUrl: './employee-payroll-filters.component.html',
    styleUrls: ['./employee-payroll-filters.component.scss'],
    providers: [{
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        }, { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }],
    imports: [FormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatSelectModule, MatOptionModule, MatRadioModule, TranslateModule]
})
export class EmployeePayrollFiltersComponent implements OnInit {

  @Input() filters: EmployeePayrollReportFilter;
  sales: any[] = [];
  date: Date = new Date();
  constructor(private commonService: CommonService) { }

  ngOnInit(): void {
    this.getSales();
    this.onSelectDate();
  }

  onSelectDate() {
    this.filters.month = new Date(this.date).getMonth() + 1;
    this.filters.year = new Date(this.date).getFullYear();
  }

  getSales() {
    this.commonService.getLookup(LookupType.Staff).subscribe({
      next: (res: any) => {
        this.sales = res;
      }
    })
  }
}
