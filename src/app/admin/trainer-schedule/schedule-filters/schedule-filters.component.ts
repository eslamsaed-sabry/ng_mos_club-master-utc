import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { TrainerScheduleFilters } from 'src/app/models/common.model';
import { ScheduleType } from 'src/app/models/enums';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';

import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BidiModule } from '@angular/cdk/bidi';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-schedule-filters',
    templateUrl: './schedule-filters.component.html',
    styleUrls: ['./schedule-filters.component.scss'],
    imports: [FormsModule, BidiModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatSelectModule, MatOptionModule, MatCheckboxModule, MatButtonModule, TranslateModule]
})
export class ScheduleFiltersComponent implements OnInit {
  @Input() filters: TrainerScheduleFilters;
  @Output() onFilter: EventEmitter<any> = new EventEmitter();
  @Input() trainersOrDoctors: any[] = [];
  @Input() scheduleTypeName: string;

  currentLang: string;
  scheduleType = ScheduleType;

  private translate = inject(TranslateService);

  constructor() { }

  ngOnInit(): void {
    this.currentLang = this.translate.getDefaultLang();
  }
}
