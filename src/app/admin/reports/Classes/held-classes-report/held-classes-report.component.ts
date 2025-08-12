import { Component, inject, OnInit } from '@angular/core';
import { ClassesReports } from 'src/app/models/enums';
import { ClassesReportFilters, HeldClassesReport } from 'src/app/models/reports.model';
import { ReportsService } from 'src/app/services/reports.service';
import { TranslateModule } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { ClassesReportFilterComponent } from '../classes-report-filter/classes-report-filter.component';
import { ReportsPageHeaderComponent } from '../../reports-page-header/reports-page-header.component';

@Component({
  selector: 'app-held-classes-report',
  templateUrl: './held-classes-report.component.html',
  styleUrls: ['./held-classes-report.component.scss'],
  imports: [ReportsPageHeaderComponent, ClassesReportFilterComponent, DatePipe, TranslateModule]
})
export class HeldClassesReportComponent implements OnInit {

  filters: ClassesReportFilters = new ClassesReportFilters();
  reports: HeldClassesReport[];
  isResult: boolean;
  hiddenIDs: string[] = [];
  classesReportsName = ClassesReports;
  private reportsService = inject(ReportsService);

  ngOnInit(): void {
  }

  generate() {
    this.isResult = false;
    this.hiddenIDs = [];
    this.reportsService.getHeldClasses(this.filters).subscribe({
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
