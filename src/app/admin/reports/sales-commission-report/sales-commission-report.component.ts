import { Component, OnInit, inject } from '@angular/core';
import { SalesCommissionReport } from 'src/app/models/reports.model';
import { ReportsService } from 'src/app/services/reports.service';
import moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { DateType, StandardDatePipe } from 'src/app/pipes/standard-date.pipe';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { GenderPipe } from '../../../pipes/gender.pipe';
import { ReportTabsComponent } from '../report-tabs/report-tabs.component';
import { DecimalPipe, DatePipe, KeyValuePipe } from '@angular/common';
import { SalesCommissionReportFiltersComponent } from './sales-commission-report-filters/sales-commission-report-filters.component';
import { ReportsPageHeaderComponent } from '../reports-page-header/reports-page-header.component';
@Component({
    selector: 'app-sales-commission-report',
    templateUrl: './sales-commission-report.component.html',
    styleUrls: ['./sales-commission-report.component.scss'],
    imports: [ReportsPageHeaderComponent, SalesCommissionReportFiltersComponent, ReportTabsComponent, DecimalPipe, DatePipe, KeyValuePipe, TranslateModule, GenderPipe]
})
export class SalesCommissionReportComponent implements OnInit {
  filters: SalesCommissionReport = new SalesCommissionReport();
  translate = inject(TranslateService)
  commissions: any;
  tabs: string[] = [];
  isResult: boolean;
  hideSalesSummary: boolean;
  reportName = this.translate.instant('reports.salesCommissionRep');
  constructor(private reportsService: ReportsService, private route: ActivatedRoute, private standardDate:StandardDatePipe) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['salesId']) {
        let date = moment(new Date(params['date']));
        this.filters.salesIds.push(+params['salesId']);
        this.filters.fromDate = this.standardDate.transform(date.startOf('day'), DateType.TO_UTC);
        this.filters.toDate = this.standardDate.transform(date.endOf('day'), DateType.TO_UTC);
        this.filters.finalApprovedOnly = params['finalOnly'];
        this.hideSalesSummary = true;
        this.reportName = this.translate.instant('reports.salesCommissionRep') + ' (' + date.format('yyyy-MM-DD') + ')';
        this.generate();
      }
    })
  }

  generate() {
    this.tabs = [];
    this.isResult = false;
    let newFilters = { ...this.filters }
    this.reportsService.generateSalesCommissionReport(newFilters).subscribe({
      next: (res) => {
        this.commissions = res.data;
        Object.keys(this.commissions).forEach(k => {
          this.tabs.push(k);
        });
        this.tabs = this.tabs.filter(item => item !== "salesSummary");
        if (!this.hideSalesSummary)
          this.tabs.unshift("salesSummary");
        this.isResult = true;
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
        this.filters = new SalesCommissionReport();
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
