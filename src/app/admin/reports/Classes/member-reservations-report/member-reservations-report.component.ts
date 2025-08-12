import { Component, inject, OnInit } from '@angular/core';
import { ClassesReports } from 'src/app/models/enums';
import { ClassesReportFilters, MemberReservationsOnClassesReport } from 'src/app/models/reports.model';
import { ReportsService } from 'src/app/services/reports.service';
import { TranslateModule } from '@ngx-translate/core';

import { ClassesReportFilterComponent } from '../classes-report-filter/classes-report-filter.component';
import { ReportsPageHeaderComponent } from '../../reports-page-header/reports-page-header.component';

@Component({
  selector: 'app-member-reservations-report',
  templateUrl: './member-reservations-report.component.html',
  styleUrls: ['./member-reservations-report.component.scss'],
  imports: [ReportsPageHeaderComponent, ClassesReportFilterComponent, TranslateModule]
})
export class MemberReservationsOnClassesReportComponent implements OnInit {

  filters: ClassesReportFilters = new ClassesReportFilters();
  reports: MemberReservationsOnClassesReport[];
  isResult: boolean;
  classesReportsName = ClassesReports;

  private reportsService = inject(ReportsService);

  ngOnInit(): void {
  }

  generate() {
    this.isResult = false;

    this.reportsService.getMemberReservationsOnClassesReport(this.filters).subscribe({
      next: (res) => {
        this.isResult = true;
        this.reports = res.data;
      }
    })
  }

  getAction(actionName: string) {
    switch (actionName) {
      case 'generate':
        this.generate();
        break;
      case 'clear':
        this.isResult = false;
        this.filters = new ClassesReportFilters();
        break;
      default:
        window.print();
        break;
    }
  }

}

