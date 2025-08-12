import { Component, OnInit, Input } from '@angular/core';
import { DayByDayProfitReport } from 'src/app/models/reports.model';
import { TranslateModule } from '@ngx-translate/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-daybyday-profit-report-filters',
    templateUrl: './daybyday-profit-report-filters.component.html',
    styleUrls: ['./daybyday-profit-report-filters.component.scss'],
    imports: [FormsModule, MatFormFieldModule, MatInputModule, MatRadioModule, MatCheckboxModule, TranslateModule]
})
export class DaybydayProfitReportFiltersComponent implements OnInit {
  @Input() filters: DayByDayProfitReport;
  users: any[] = [];

  constructor() { }

  ngOnInit(): void {
  }



}
