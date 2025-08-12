import { Component, DestroyRef, inject } from '@angular/core';
import { FixedTrainerCommissionReportFilterComponent } from './fixed-trainer-commission-report-filter/fixed-trainer-commission-report-filter.component';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ReportsPageHeaderComponent } from '../reports-page-header/reports-page-header.component';
import { FixedTrainerCommissionReportFilter } from 'src/app/models/reports.model';
import { ReportsService } from 'src/app/services/reports.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Membership } from 'src/app/models/member.model';
import { GenderPipe } from 'src/app/pipes/gender.pipe';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-fixed-trainer-commission-report',
    templateUrl: './fixed-trainer-commission-report.component.html',
    styleUrl: './fixed-trainer-commission-report.component.scss',
    imports: [ReportsPageHeaderComponent, FixedTrainerCommissionReportFilterComponent, MatButtonModule, MatIconModule, DecimalPipe, DatePipe, TranslateModule, GenderPipe]
})
export class FixedTrainerCommissionReportComponent {
  isResult: boolean;
  filters: FixedTrainerCommissionReportFilter = new FixedTrainerCommissionReportFilter;
  reports: Membership[];

  private reportsService = inject(ReportsService);
  private toastr = inject(ToastrService);
  private translate = inject(TranslateService);
  private destroyRef = inject(DestroyRef);


  generate() {
    this.isResult = false;

    if (!this.filters.trainerId) {
      this.toastr.error(this.translate.instant('members.msgToSelectCoach'))
      return
    }

    if (!this.filters.fixedPercentage) {
      this.toastr.error(this.translate.instant('members.msgToPercentageMandatory'))
      return
    }

    this.reportsService.getFixedTrainerCommissionReport(this.filters).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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
        this.filters = new FixedTrainerCommissionReportFilter();
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
}
