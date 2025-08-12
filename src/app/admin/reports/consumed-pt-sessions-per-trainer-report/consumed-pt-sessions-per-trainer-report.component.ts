import { ConsumedPTSessionsPerTrainerReportFiltersComponent } from './consumed-pt-sessions-per-trainer-report-filters/consumed-pt-sessions-per-trainer-report-filters.component';
import { DecimalPipe } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';
import { ConsumedPTSessionsPerTrainerReportFilter, ConsumedPTSessionsPerTrainerReport } from 'src/app/models/reports.model';
import { ReportsService } from 'src/app/services/reports.service';
import { ReportsPageHeaderComponent } from '../reports-page-header/reports-page-header.component';

@Component({
    selector: 'app-consumed-pt-sessions-per-trainer-report',
    templateUrl: './consumed-pt-sessions-per-trainer-report.component.html',
    styleUrl: './consumed-pt-sessions-per-trainer-report.component.scss',
    imports: [ReportsPageHeaderComponent, ConsumedPTSessionsPerTrainerReportFiltersComponent, DecimalPipe, TranslateModule]
})
export class ConsumedPTSessionsPerTrainerReportComponent {

  filters: ConsumedPTSessionsPerTrainerReportFilter = new ConsumedPTSessionsPerTrainerReportFilter();
  reports: ConsumedPTSessionsPerTrainerReport[];
  isResult: boolean;
  hiddenIDs: string[] = [];
  private reportsService = inject(ReportsService);
  private destroyRef = inject(DestroyRef);


  generate() {
    this.isResult = false;
    this.hiddenIDs = [];

    this.reportsService.getConsumedPTSessionsPerTrainerReport(this.filters).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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
        this.filters = new ConsumedPTSessionsPerTrainerReportFilter();
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
