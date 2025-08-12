import { Component, inject, OnInit } from '@angular/core';
import { ClassesReports } from 'src/app/models/enums';
import { ClassesPerInstructorAndTypeReport, ClassesReportFilters } from 'src/app/models/reports.model';
import { ReportsService } from 'src/app/services/reports.service';
import { TranslateModule } from '@ngx-translate/core';

import { ClassesReportFilterComponent } from '../classes-report-filter/classes-report-filter.component';
import { ReportsPageHeaderComponent } from '../../reports-page-header/reports-page-header.component';

@Component({
  selector: 'app-classes-per-instructor-type-report',
  templateUrl: './classes-per-instructor-type-report.component.html',
  styleUrls: ['./classes-per-instructor-type-report.component.scss'],
  imports: [ReportsPageHeaderComponent, ClassesReportFilterComponent, TranslateModule]
})
export class ClassesPerInstructorTypeReportComponent implements OnInit {

  filters: ClassesReportFilters = new ClassesReportFilters();
  reports: ClassesPerInstructorAndTypeReport[];
  isResult: boolean;
  hiddenIDs: string[] = [];
  classesReportsName = ClassesReports;
  private reportsService = inject(ReportsService);

  ngOnInit(): void {
  }

  generate() {
    this.isResult = false;
    this.hiddenIDs = [];
    this.reportsService.getClassesPerInstructorAndTypeReport(this.filters).subscribe({
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
