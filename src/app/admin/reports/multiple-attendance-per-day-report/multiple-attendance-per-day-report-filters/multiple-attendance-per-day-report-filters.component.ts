import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { MultipleAttendancePerDayReportFilter } from 'src/app/models/reports.model';

@Component({
    selector: 'app-multiple-attendance-per-day-report-filters',
    templateUrl: './multiple-attendance-per-day-report-filters.component.html',
    styleUrl: './multiple-attendance-per-day-report-filters.component.scss',
    imports: [FormsModule, MatFormFieldModule, MatInputModule, TranslateModule]
})
export class MultipleAttendancePerDayReportFiltersComponent implements OnInit {
  @Input() filters: MultipleAttendancePerDayReportFilter;

  ngOnInit(): void {
  }


}
