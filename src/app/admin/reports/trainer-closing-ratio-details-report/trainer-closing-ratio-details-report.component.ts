import { DatePipe } from '@angular/common';
import { TrainerClosingRatioDetailsReportFiltersComponent } from './trainer-closing-ratio-details-report-filters/trainer-closing-ratio-details-report-filters.component';
import { Component, DestroyRef, inject } from '@angular/core';
import { TrainerClosingRatioDetailsReport, TrainerClosingRatioDetailsReportFilter } from 'src/app/models/reports.model';
import { ReportsService } from 'src/app/services/reports.service';
import { ReportsPageHeaderComponent } from '../reports-page-header/reports-page-header.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastrService } from 'ngx-toastr';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-trainer-closing-ratio-details-report',
    templateUrl: './trainer-closing-ratio-details-report.component.html',
    styleUrl: './trainer-closing-ratio-details-report.component.scss',
    imports: [ReportsPageHeaderComponent, TrainerClosingRatioDetailsReportFiltersComponent, TranslateModule, DatePipe]
})
export class TrainerClosingRatioDetailsReportComponent {

  filters: TrainerClosingRatioDetailsReportFilter = new TrainerClosingRatioDetailsReportFilter();
  reports: TrainerClosingRatioDetailsReport;
  isResult: boolean;
  private reportsService = inject(ReportsService);
  private toaster = inject(ToastrService);
  private translate = inject(TranslateService);
  private destroyRef = inject(DestroyRef);


  generate() {
    this.isResult = false;
    if (!this.filters.trainerId) {
      this.toaster.error(this.translate.instant('members.msgToSelectCoach'))
      return
    }
    else {
      this.reportsService.getTrainerClosingRatioDetails(this.filters).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (res) => {
          this.isResult = true;
          this.reports = res.data;
        }
      })
    }

  }

  getAction(actionName: string) {
    switch (actionName) {
      case 'generate':
        this.generate();
        break;
      case 'clear':
        this.isResult = false;
        this.filters = new TrainerClosingRatioDetailsReportFilter();
        break;
      default:
        window.print();
        break;
    }
  }

}
