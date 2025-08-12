import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import moment from 'moment';
import { TrainersAchievementReport } from 'src/app/models/reports.model';
import { DateType, StandardDatePipe } from 'src/app/pipes/standard-date.pipe';
import { ReportsService } from 'src/app/services/reports.service';
import { GenderPipe } from '../../../pipes/gender.pipe';
import { ReportTabsComponent } from '../report-tabs/report-tabs.component';
import { DecimalPipe, DatePipe, KeyValuePipe } from '@angular/common';
import { TrainersAchievementReportFiltersComponent } from './trainers-achievement-report-filters/trainers-achievement-report-filters.component';
import { ReportsPageHeaderComponent } from '../reports-page-header/reports-page-header.component';

@Component({
    selector: 'app-trainers-achievement-report',
    templateUrl: './trainers-achievement-report.component.html',
    styleUrl: './trainers-achievement-report.component.scss',
    imports: [ReportsPageHeaderComponent, TrainersAchievementReportFiltersComponent, ReportTabsComponent, DecimalPipe, DatePipe, KeyValuePipe, TranslateModule, GenderPipe]
})
export class TrainersAchievementReportComponent implements OnInit {
  filters: TrainersAchievementReport = new TrainersAchievementReport();
  translate = inject(TranslateService)
  commissions: any;
  tabs: string[] = [];
  isResult: boolean;
  hideTrainerSummary: boolean;
  reportName = this.translate.instant('reports.trainersAchievement');
  constructor(private reportsService: ReportsService, private route: ActivatedRoute, private standardDate: StandardDatePipe) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['trainersIds']) {
        let date = moment(new Date(params['date']));
        this.filters.trainersIds.push(+params['trainersIds']);
        this.filters.fromDate = this.standardDate.transform(date.startOf('day'), DateType.TO_UTC);
        this.filters.toDate = this.standardDate.transform(date.endOf('day'), DateType.TO_UTC);
        this.filters.finalApprovedOnly = params['finalOnly'];
        this.hideTrainerSummary = true;
        this.reportName = this.translate.instant('reports.trainersAchievement') + ' (' + date.format('yyyy-MM-DD') + ')';
        this.generate();
      }
    })
  }

  generate() {
    this.tabs = [];
    this.isResult = false;
    let newFilters = { ...this.filters }
    this.reportsService.generateTrainersAchievementReport(newFilters).subscribe({
      next: (res) => {
        this.commissions = res.data;
        Object.keys(this.commissions).forEach(k => {
          if (k === "studioMemberships")
            this.tabs.push("PrivateMemberships");
          else
            this.tabs.push(k);
        });
        this.tabs = this.tabs.filter(item => item !== "summary");
        if (!this.hideTrainerSummary)
          this.tabs.unshift("summary");
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
        this.filters = new TrainersAchievementReport();
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
