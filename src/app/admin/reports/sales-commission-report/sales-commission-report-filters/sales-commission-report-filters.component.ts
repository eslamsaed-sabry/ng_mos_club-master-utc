import { Component, OnInit, Input, inject, DestroyRef } from '@angular/core';
import { SalesCommissionReport } from 'src/app/models/reports.model';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatOptionModule } from '@angular/material/core';
import { LookupType } from 'src/app/models/enums';
import { CommonService } from 'src/app/services/common.service';
import moment from 'moment';
import { TranslateModule } from '@ngx-translate/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';

import { MatSelectModule } from '@angular/material/select';
import { RoleDirective } from '../../../../directives/role.directive';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
    selector: 'app-sales-commission-report-filters',
    templateUrl: './sales-commission-report-filters.component.html',
    styleUrls: ['./sales-commission-report-filters.component.scss'],
    providers: [{
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        }, { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }],
    imports: [FormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, RoleDirective, MatSelectModule, MatOptionModule, MatRadioModule, MatCheckboxModule, TranslateModule]
})
export class SalesCommissionReportFiltersComponent implements OnInit {
  @Input() filters: SalesCommissionReport;
  sales: any[] = [];
  allIds: number[];
  selection: string = 'Select All';
  destroyRef = inject(DestroyRef);
  isActive: boolean = true;

  public commonService = inject(CommonService);


  ngOnInit(): void {
    this.getSales();
    this.onSelectDate();
  }

  onSelectDate() {
    this.filters.fromDate = moment(this.filters.fromDate).startOf('month');
    this.filters.toDate = moment(this.filters.fromDate).endOf('month');
  }

  getSales() {
    this.commonService.getLookup(LookupType.Sales, this.isActive).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res: any) => {
        this.sales = res;
        this.allIds = this.sales.map(el => el.id);
      }
    })
  }

  onSelect() {
    setTimeout(() => {
      if (this.filters.salesIds.includes(0)) {
        this.filters.salesIds = [0, ...this.sales.map(el => el.id)];
      } else {
        this.filters.salesIds = [];
      }
    }, 100);
  }

}
