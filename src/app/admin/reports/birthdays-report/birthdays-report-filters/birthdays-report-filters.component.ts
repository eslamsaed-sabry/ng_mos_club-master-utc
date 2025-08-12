import { Component, OnInit, Input, inject, DestroyRef } from '@angular/core';
import { LookupType } from 'src/app/models/enums';
import { BirthdaysReport } from 'src/app/models/reports.model';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatOptionModule } from '@angular/material/core';
import { CommonService } from 'src/app/services/common.service';
import { TranslateModule } from '@ngx-translate/core';

import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MMM',
  },
  display: {
    dateInput: 'DD/MMM',
    monthYearLabel: 'MMM',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
    selector: 'app-birthdays-report-filters',
    templateUrl: './birthdays-report-filters.component.html',
    styleUrls: ['./birthdays-report-filters.component.scss'],
    providers: [{
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        }, { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }],
    imports: [MatCheckboxModule, FormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatSelectModule, MatOptionModule, TranslateModule]
})
export class BirthdaysReportFiltersComponent implements OnInit {
  @Input() filters: BirthdaysReport;
  sales: any[] = [];
  destroyRef = inject(DestroyRef);
  isActive: boolean = true;

  public commonService = inject(CommonService);

  ngOnInit(): void {
    this.getSales();
  }

  getSales() {
    this.commonService.getLookup(LookupType.Sales, this.isActive).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res: any) => {
        this.sales = res;
      }
    })
  }


}
