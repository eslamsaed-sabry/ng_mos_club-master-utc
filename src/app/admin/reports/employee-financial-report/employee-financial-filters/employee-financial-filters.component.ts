
import { Component, DestroyRef, Input, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import moment from 'moment';
import { LookupType } from 'src/app/models/enums';
import { EmployeeFinancialReportFilter } from 'src/app/models/reports.model';
import { CommonService } from 'src/app/services/common.service';

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
    selector: 'app-employee-financial-filters',
    templateUrl: './employee-financial-filters.component.html',
    styleUrl: './employee-financial-filters.component.scss',
    providers: [{
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        }, { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }],
    imports: [FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, TranslateModule, MatDatepickerModule]
})
export class EmployeeFinancialFiltersComponent {
  @Input() filters: EmployeeFinancialReportFilter;
  sales: any[] = [];
  date: Date = new Date();
  private commonService = inject(CommonService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.getSales();
  }

  getSales() {
    this.commonService.getLookup(LookupType.Staff).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res: any) => {
        this.sales = res;
      }
    })
  }

  onSelectDate() {
    this.filters.fromDate = moment(this.filters.fromDate).startOf('month');
    this.filters.toDate = moment(this.filters.fromDate).endOf('month');
  }
}
