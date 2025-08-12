import { Component, inject, OnInit } from '@angular/core';
import { BenefitsConsumptionReportFilter, BenefitsConsumptionReport } from 'src/app/models/reports.model';
import { ReportsService } from 'src/app/services/reports.service';
import { TranslateModule } from '@ngx-translate/core';

import { BenefitsConsumptionFiltersComponent } from './benefits-consumption-filters/benefits-consumption-filters.component';
import { ReportsPageHeaderComponent } from '../reports-page-header/reports-page-header.component';

@Component({
  selector: 'app-benefits-consumption-report',
  templateUrl: './benefits-consumption-report.component.html',
  styleUrls: ['./benefits-consumption-report.component.scss'],
  imports: [ReportsPageHeaderComponent, BenefitsConsumptionFiltersComponent, TranslateModule]
})
export class BenefitsConsumptionReportComponent implements OnInit {

  filters: BenefitsConsumptionReportFilter = new BenefitsConsumptionReportFilter();
  reports: BenefitsConsumptionReport[];
  isResult: boolean;
  hiddenIDs: string[] = [];
  private reportsService = inject(ReportsService);

  ngOnInit(): void {
  }

  generate() {
    this.isResult = false;
    this.hiddenIDs = [];

    this.reportsService.getBenefitsConsumtionReport(this.filters).subscribe({
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
        this.filters = new BenefitsConsumptionReportFilter();
        break;
      default:
        window.print();
        break;
    }
  }

}

