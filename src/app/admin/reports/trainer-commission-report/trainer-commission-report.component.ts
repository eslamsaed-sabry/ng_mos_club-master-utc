import { Component, inject } from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { TrainerCommissionReport } from 'src/app/models/reports.model';
import { ReportsService } from 'src/app/services/reports.service';
import { DecimalPipe, DatePipe } from '@angular/common';
import { TrainerCommissionReportFiltersComponent } from './trainer-commission-report-filters/trainer-commission-report-filters.component';
import { ReportsPageHeaderComponent } from '../reports-page-header/reports-page-header.component';

@Component({
  selector: 'app-trainer-commission-report',
  templateUrl: './trainer-commission-report.component.html',
  styleUrls: ['./trainer-commission-report.component.scss'],
  imports: [ReportsPageHeaderComponent, TrainerCommissionReportFiltersComponent, DecimalPipe, DatePipe, TranslateModule]
})
export class TrainerCommissionReportComponent {
  isResult: boolean;
  filters: TrainerCommissionReport = new TrainerCommissionReport();
  commission: any;
  private reportsService = inject(ReportsService);
  private toastr = inject(ToastrService);
  private translate = inject(TranslateService);

  clear() {
    this.isResult = false;
    this.filters = new TrainerCommissionReport();
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

  calcTotal(array: any[], col: string): number {
    let result: number = 0;
    array!.forEach((el) => {
      result += el[col]
    });
    return result;
  }

  generate() {
    this.isResult = false;
    if (!this.filters.coachId) {
      this.toastr.error(this.translate.instant('members.msgToSelectCoach'))
      return
    }
    if (this.filters.type === 'session') {
      this.reportsService.generateTrainerCommissionReport('session', this.filters)
        .subscribe({
          next: (res) => {
            this.isResult = true;
            this.commission = res.data;
          },
        });
    }
    else {
      this.reportsService.generateTrainerCommissionReport('membership', this.filters)
        .subscribe({
          next: (res) => {
            this.isResult = true;
            this.commission = res.data;
          },
        });
    }
  }

  onFilterChange() {
    this.isResult = false;
  }
}
