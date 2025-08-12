import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OverAttendanceReport } from 'src/app/models/reports.model';
import { ReportsService } from 'src/app/services/reports.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-over-attendance-report-filters',
    templateUrl: './over-attendance-report-filters.component.html',
    styleUrls: ['./over-attendance-report-filters.component.scss'],
    imports: [FormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatRadioModule, TranslateModule]
})
export class OverAttendanceReportFiltersComponent implements OnInit {
  @Output() onChangeOption: EventEmitter<any> = new EventEmitter();
  @Input() filters: OverAttendanceReport;
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
