import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { ProfitSummaryReportFilter } from 'src/app/models/reports.model';

@Component({
  selector: 'app-profit-summary-report-filters',
  templateUrl: './profit-summary-report-filters.component.html',
  styleUrl: './profit-summary-report-filters.component.scss',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, TranslateModule]
})
export class ProfitSummaryReportFiltersComponent implements OnInit {
  @Input() filters: ProfitSummaryReportFilter;

  ngOnInit(): void {
  }


}
