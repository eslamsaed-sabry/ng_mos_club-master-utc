import { Component, OnInit, Input } from '@angular/core';
import { LogsReport } from 'src/app/models/reports.model';
import { ReportsService } from 'src/app/services/reports.service';
import { TranslateModule } from '@ngx-translate/core';

import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-logs-report-filters',
    templateUrl: './logs-report-filters.component.html',
    styleUrls: ['./logs-report-filters.component.scss'],
    imports: [FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, TranslateModule]
})
export class LogsReportFiltersComponent implements OnInit {
  @Input() filters: LogsReport;
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
