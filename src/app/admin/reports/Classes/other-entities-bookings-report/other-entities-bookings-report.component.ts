import { Component, inject } from '@angular/core';
import { ClassesReports } from 'src/app/models/enums';
import { InstructorDueAmountReport, OtherEntitiesBookings } from 'src/app/models/reports.model';
import { ReportsService } from 'src/app/services/reports.service';
import { TranslateModule } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { ClassesReportFilterComponent } from '../classes-report-filter/classes-report-filter.component';
import { ReportsPageHeaderComponent } from '../../reports-page-header/reports-page-header.component';

@Component({
  selector: 'app-other-entities-bookings-report',
  templateUrl: './other-entities-bookings-report.component.html',
    styleUrls: ['./other-entities-bookings-report.component.scss'],
    imports: [ReportsPageHeaderComponent, ClassesReportFilterComponent, DatePipe, TranslateModule]
})
export class OtherEntitiesBookingsReportComponent {

  filters: OtherEntitiesBookings = new OtherEntitiesBookings();
  reports: InstructorDueAmountReport[];
  isResult: boolean;
  hiddenIDs: string[] = [];
  classesReportsName = ClassesReports;
  private reportsService = inject(ReportsService);

  generate() {
    this.isResult = false;
    this.hiddenIDs = [];
    delete this.filters.branchId;
    this.reportsService.getOtherEntitiesBookings(this.filters).subscribe({
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
        this.filters = new OtherEntitiesBookings();
        break;
      default:
        window.print();
        break;
    }
  }

}
