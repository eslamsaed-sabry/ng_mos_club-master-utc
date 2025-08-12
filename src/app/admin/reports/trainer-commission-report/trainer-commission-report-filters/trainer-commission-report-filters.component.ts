import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LookupType } from 'src/app/models/enums';
import { TrainerCommissionReport } from 'src/app/models/reports.model';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatOptionModule } from '@angular/material/core';
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
  selector: 'app-trainer-commission-report-filters',
  templateUrl: './trainer-commission-report-filters.component.html',
  styleUrls: ['./trainer-commission-report-filters.component.scss'],
  providers: [{
    provide: DateAdapter,
    useClass: MomentDateAdapter,
    deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
  }, { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }],
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatSelectModule, MatOptionModule, MatRadioModule, TranslateModule]
})
export class TrainerCommissionReportFiltersComponent implements OnInit {

  @Input() filters: TrainerCommissionReport;
  @Output() onFilterChange: EventEmitter<any> = new EventEmitter();

  trainers: any[] = [];
  date: Date = new Date();
  constructor(private commonService: CommonService) { }

  ngOnInit(): void {
    this.gettrainers();
    this.onSelectDate();
  }

  onSelectDate() {
    this.filters.month = new Date(this.date).getMonth() + 1;
    this.filters.year = new Date(this.date).getFullYear();
  }

  gettrainers() {
    this.commonService.getLookup(LookupType.Trainers).subscribe({
      next: (res: any) => {
        this.trainers = res;
      }
    })
  }

  applyFilter() {
    this.onFilterChange.emit();
  }
}
