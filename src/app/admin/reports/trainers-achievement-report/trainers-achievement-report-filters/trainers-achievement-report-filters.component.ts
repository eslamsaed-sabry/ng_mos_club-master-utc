import { Component, Input, OnInit } from '@angular/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatOptionModule } from '@angular/material/core';
import moment from 'moment';
import { LookupType } from 'src/app/models/enums';
import { TrainersAchievementReport } from 'src/app/models/reports.model';
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
    selector: 'app-trainers-achievement-report-filters',
    templateUrl: './trainers-achievement-report-filters.component.html',
    styleUrl: './trainers-achievement-report-filters.component.scss', providers: [{
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        }, { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }],
    imports: [FormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, RoleDirective, MatSelectModule, MatOptionModule, MatCheckboxModule, TranslateModule]
})
export class TrainersAchievementReportFiltersComponent implements OnInit {
  @Input() filters: TrainersAchievementReport;
  trainers: any[] = [];
  allIds: number[];
  selection: string = 'Select All';

  constructor(private commonService: CommonService) { }

  ngOnInit(): void {
    this.getTrainer();
    this.onSelectDate();
  }

  onSelectDate() {
    this.filters.fromDate = moment(this.filters.fromDate).startOf('month');
    this.filters.toDate = moment(this.filters.fromDate).endOf('month');
  }

  getTrainer() {
    this.commonService.getLookup(LookupType.Trainers).subscribe({
      next: (res: any) => {
        this.trainers = res;
        this.allIds = this.trainers.map(el => el.id);
      }
    })
  }

  onSelect() {
    setTimeout(() => {
      if (this.filters.trainersIds.includes(0)) {
        this.filters.trainersIds = [0, ...this.trainers.map(el => el.id)];
      } else {
        this.filters.trainersIds = [];
      }
    }, 100);
  }

}
