import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { ReportsPageHeaderComponent } from '../reports-page-header/reports-page-header.component';
import { FreePrivateTrainingReportFilterComponent } from './free-private-training-report-filter/free-private-training-report-filter.component';
import { DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FreePrivateTrainingFilters } from 'src/app/models/extra.model';
import { FreePrivateTrainingReport } from 'src/app/models/reports.model';
import { ReportsService } from 'src/app/services/reports.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-free-private-training-report',
    templateUrl: './free-private-training-report.component.html',
    styleUrl: './free-private-training-report.component.scss',
    imports: [ReportsPageHeaderComponent, FreePrivateTrainingReportFilterComponent, DatePipe, TranslateModule]
})
export class FreePrivateTrainingReportComponent implements OnInit {

  filters: FreePrivateTrainingFilters = new FreePrivateTrainingFilters();
  reports: FreePrivateTrainingReport;
  isResult: boolean;

  private reportsService = inject(ReportsService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
  }

  generate() {
    this.isResult = false;
    this.reportsService.getFreePrivateTrainingReport(this.filters).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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
        this.filters = new FreePrivateTrainingFilters();
        break;
      default:
        window.print();
        break;
    }
  }
}
