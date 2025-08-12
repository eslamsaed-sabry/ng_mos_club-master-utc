import { Component, DestroyRef, inject } from '@angular/core';
import { ReportsPageHeaderComponent } from '../reports-page-header/reports-page-header.component';
import { DatePipe, DecimalPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ConsumedPTSessionsPerMembershipReport, ConsumedPTSessionsPerMembershipReportFilter } from 'src/app/models/reports.model';
import { ConsumedPTSessionsPerMembershipReportFiltersComponent } from './consumed-pt-sessions-per-membership-report-filters/consumed-pt-sessions-per-membership-report-filters.component';
import { ReportsService } from 'src/app/services/reports.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-consumed-pt-sessions-per-membership-report',
    templateUrl: './consumed-pt-sessions-per-membership-report.component.html',
    styleUrl: './consumed-pt-sessions-per-membership-report.component.scss',
    imports: [ReportsPageHeaderComponent, ConsumedPTSessionsPerMembershipReportFiltersComponent, DecimalPipe, TranslateModule, DatePipe]
})
export class ConsumedPTSessionsPerMembershipReportComponent {

  filters: ConsumedPTSessionsPerMembershipReportFilter = new ConsumedPTSessionsPerMembershipReportFilter();
  reports: ConsumedPTSessionsPerMembershipReport[];
  isResult: boolean;
  hiddenIDs: string[] = [];
  private reportsService = inject(ReportsService);
  private destroyRef = inject(DestroyRef);


  generate() {
    this.isResult = false;
    this.hiddenIDs = [];

    this.reportsService.getConsumedPTSessionsPerMembershipReport(this.filters).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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
        this.filters = new ConsumedPTSessionsPerMembershipReportFilter();
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
