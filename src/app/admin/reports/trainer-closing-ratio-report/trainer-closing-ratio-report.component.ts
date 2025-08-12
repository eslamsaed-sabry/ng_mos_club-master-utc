import { Component, DestroyRef, inject } from '@angular/core';
import { TrainerClosingRatioReportFiltersComponent } from './trainer-closing-ratio-report-filters/trainer-closing-ratio-report-filters.component';
import { TrainerClosingRatioReport, TrainerClosingRatioReportFilter } from 'src/app/models/reports.model';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';
import { ReportsService } from 'src/app/services/reports.service';
import { ReportsPageHeaderComponent } from '../reports-page-header/reports-page-header.component';

@Component({
    selector: 'app-trainer-closing-ratio-report',
    templateUrl: './trainer-closing-ratio-report.component.html',
    styleUrl: './trainer-closing-ratio-report.component.scss',
    imports: [ReportsPageHeaderComponent, TrainerClosingRatioReportFiltersComponent, TranslateModule]
})
export class TrainerClosingRatioReportComponent {

  filters: TrainerClosingRatioReportFilter = new TrainerClosingRatioReportFilter();
  reports: TrainerClosingRatioReport[];
  isResult: boolean;
  private reportsService = inject(ReportsService);
  private destroyRef = inject(DestroyRef);


  generate() {
    this.isResult = false;
    this.reportsService.getTrainerClosingRatio(this.filters).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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
        this.filters = new TrainerClosingRatioReportFilter();
        break;
      default:
        window.print();
        break;
    }
  }

}
