import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { SalesScheduleFilters } from 'src/app/models/common.model';
import { MatButtonModule } from '@angular/material/button';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BidiModule } from '@angular/cdk/bidi';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-schedule-filters',
    templateUrl: './schedule-filters.component.html',
    styleUrls: ['./schedule-filters.component.scss'],
    imports: [FormsModule, BidiModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatCheckboxModule, MatButtonModule, TranslateModule]
})
export class ScheduleFiltersComponent implements OnInit {
  @Input() filters: SalesScheduleFilters;
  @Output() onFilter: EventEmitter<any> = new EventEmitter();
  currentLang: string;

  constructor(private translate: TranslateService) { }

  ngOnInit(): void {
    this.currentLang = this.translate.getDefaultLang();
  }
}
