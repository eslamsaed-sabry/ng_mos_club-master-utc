import { Component, DestroyRef, inject } from '@angular/core';
import { MembershipUpgradeFiltersComponent } from './membership-upgrade-filters/membership-upgrade-filters.component';
import { DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReportsPageHeaderComponent } from '../reports-page-header/reports-page-header.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MembershipUpgradeReportFilter, MembershipUpgradeReport } from 'src/app/models/reports.model';
import { ReportsService } from 'src/app/services/reports.service';

@Component({
    selector: 'app-membership-upgrade-report',
    templateUrl: './membership-upgrade-report.component.html',
    styleUrl: './membership-upgrade-report.component.scss',
    imports: [ReportsPageHeaderComponent, MembershipUpgradeFiltersComponent, DatePipe, TranslateModule]
})
export class MembershipUpgradeReportComponent {
  filters: MembershipUpgradeReportFilter = new MembershipUpgradeReportFilter();
  reports: MembershipUpgradeReport[];
  isResult: boolean;

  private reportService = inject(ReportsService);
  destroyRef = inject(DestroyRef);

  ngOnInit(): void {
  }

  generate() {
    this.isResult = false;
    this.reportService.getMembershipUpgradeReport(this.filters).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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
        this.filters = new MembershipUpgradeReportFilter();
        break;
      default:
        window.print();
        break;
    }
  }

}

