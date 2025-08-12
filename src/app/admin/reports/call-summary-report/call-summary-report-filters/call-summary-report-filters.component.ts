import { Component, OnInit, Input } from '@angular/core';
import { CallsSummaryReport } from 'src/app/models/reports.model';
import { ReportsService } from 'src/app/services/reports.service';
import { TranslateModule } from '@ngx-translate/core';

import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-call-summary-report-filters',
    templateUrl: './call-summary-report-filters.component.html',
    styleUrls: ['./call-summary-report-filters.component.scss'],
    imports: [FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, TranslateModule]
})
export class CallSummaryReportFiltersComponent implements OnInit {

  @Input() filters: CallsSummaryReport;
  users: any[] = [];
  constructor(private reportService: ReportsService) { }

  ngOnInit(): void {
    this.getUsers();
  }


  getUsers() {
    this.reportService.getUsers().subscribe({
      next: (res) => {
        this.users = res.data;
      }
    })
  }
}
