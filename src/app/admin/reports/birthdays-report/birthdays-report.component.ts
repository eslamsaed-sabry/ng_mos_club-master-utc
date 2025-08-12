import { Component, inject, OnInit } from '@angular/core';
import { BirthdaysReport } from 'src/app/models/reports.model';
import { ReportsService } from 'src/app/services/reports.service';
import { GenderPipe } from '../../../pipes/gender.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { BirthdaysReportFiltersComponent } from './birthdays-report-filters/birthdays-report-filters.component';
import { ReportsPageHeaderComponent } from '../reports-page-header/reports-page-header.component';

@Component({
  selector: 'app-birthdays-report',
  templateUrl: './birthdays-report.component.html',
  styleUrls: ['./birthdays-report.component.scss'],
  imports: [ReportsPageHeaderComponent, BirthdaysReportFiltersComponent, DatePipe, TranslateModule, GenderPipe]
})
export class BirthdaysReportComponent implements OnInit {
  isResult: boolean;
  filters: BirthdaysReport = new BirthdaysReport();
  packages: any[] = [];
  birthdays: any[] = [];
  private reportsService = inject(ReportsService);

  ngOnInit(): void { }


  clear() {
    this.isResult = false;
    this.filters = new BirthdaysReport();
  }

  getAction(actionName: string) {
    switch (actionName) {
      case 'generate':
        this.generate();
        break;
      case 'clear':
        this.isResult = false;
        this.clear();
        break;
      default:
        window.print();
        break;
    }
  }

  generate() {
    this.isResult = false;
    this.filters.excludeBlocked = true;
    this.reportsService.generateBirthdaysReport(this.filters)
      .subscribe({
        next: (res) => {
          this.isResult = true;
          this.birthdays = res.data;
        },
      });
  }


}
