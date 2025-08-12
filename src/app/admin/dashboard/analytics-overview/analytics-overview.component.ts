import { Component, OnInit, inject } from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { forkJoin, map } from 'rxjs';
import { IAuthorizedUser } from 'src/app/models/user.model';
import { UserPermissionsService } from 'src/app/services/user-permissions.service';
import { MatIconModule } from '@angular/material/icon';

import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RoleDirective } from '../../../directives/role.directive';
import { DashboardChartService } from '../dashboard-chart.service';
import { BarChartComponent } from 'src/app/shared/bar-chart/bar-chart.component';
import { IChartConfig, IPieChartConfig } from 'src/app/models/chart.model';
import { LineChartComponent } from 'src/app/shared/line-chart/line-chart.component';
import { PieChartComponent } from 'src/app/shared/pie-chart/pie-chart.component';

@Component({
  selector: 'app-analytics-overview',
  templateUrl: './analytics-overview.component.html',
  styleUrls: ['./analytics-overview.component.scss'],
  imports: [
    RoleDirective,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatOptionModule,
    MatButtonModule,
    PieChartComponent,
    MatIconModule,
    TranslateModule,
    BarChartComponent,
    LineChartComponent
]
})
export class AnalyticsOverviewComponent implements OnInit {
  user: IAuthorizedUser;
  period: number = 30;
  attendanceChart: IChartConfig;
  z10Chart: IChartConfig;
  moneyChart: IChartConfig;
  genderChart: IPieChartConfig;
  debtsChart: IPieChartConfig;
  packagesChart: IChartConfig;
  ageChart: IPieChartConfig;
  knowledgeChart: IChartConfig;
  userStatistics: any = {};
  cancellationReason: IPieChartConfig;
  incomeSummary: IChartConfig;
  incomePerEachPackage: IChartConfig;
  suitSize: IChartConfig;
  memberLevels: IChartConfig;
  memberGoals: IChartConfig;
  attendancePerWeek: IChartConfig;
  attendanceDayByDay: IChartConfig;
  palette = ['#5d62b5', '#62b58f', '#ffc533', '#f2726f', '#9e56df', '#f2726f', '#0080ff'];
  moreCharts: boolean;
  isCalledBefore: boolean;
  public permissions = inject(UserPermissionsService);
  private translate = inject(TranslateService);
  private dashboardService = inject(DashboardChartService);

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('mosUser') || '');
    if (this.permissions.hasPermissions(['dashboard', 'MiddleBoard']))
      this.getDashboard();
  }

  initKnowledgeChart(data: any) {
    this.knowledgeChart = {
      title: this.translate.instant('members.sourceOfK'),
      subtitle: "Showing results in last " + this.period + " days",
      series: [{ name: '', data: [] }],
      isGrouped: false,
      yAxisTitle: '',
      categories: []
    };

    data.forEach((el: any) => {
      this.knowledgeChart.categories.push(el.key);
      this.knowledgeChart.series[0].data.push(el.count)
    });
  }

  initPackagesChart(data: any) {
    this.packagesChart = {
      title: this.translate.instant('navigation.packages'),
      subtitle: "Showing results in last " + this.period + " days",
      series: [{ name: '', data: [] }],
      isGrouped: false,
      yAxisTitle: '',
      isHorizontal: true,
      categories: []
    };

    data.forEach((el: any) => {
      this.packagesChart.categories.push(el.key);
      this.packagesChart.series[0].data.push(el.count)
    });
  }


  initDebtsChart(data: any) {
    this.debtsChart = {
      title: this.translate.instant('members.debts'),
      subtitle: "Showing results in last " + this.period + " days",
      labels: [],
      series: [],
      height: 365
    };

    data.forEach((el: any) => {
      this.debtsChart.labels.push(el.key);
      this.debtsChart.series.push(el.count);
    });
  }
  initMoneyChart(data: any) {
    this.moneyChart = {
      title: this.translate.instant('dashboard.money'),
      subtitle: "Showing results in last " + this.period + " days",
      yAxisTitle: '',
      categories: [],
      series: [{ name: '', data: [] }]
    };

    data.forEach((el: any) => {
      this.moneyChart.categories.push(el.key);
      this.moneyChart.series[0].data.push(el.count);
    });
  }
  initAttendanceCharts(data: any) {
    this.attendanceChart = {
      title: this.translate.instant('members.attendance'),
      subtitle: "Showing results in last " + this.period + " days",
      yAxisTitle: '',
      categories: [],
      series: [{ name: '', data: [] }]
    };

    data.forEach((el: any) => {
      this.attendanceChart.categories.push(el.key);
      this.attendanceChart.series[0].data.push(el.count);
    });
  }
  initZ10Charts(data: any) {
    this.z10Chart = {
      title: this.translate.instant('dashboard.membersProgress'),
      series: [
        {
          name: this.translate.instant('dashboard.oldMembers'),
          data: []
        },
        {
          name: this.translate.instant('dashboard.newMembers'),
          data: []
        },
        {
          name: this.translate.instant('dashboard.renewedMembers'),
          data: []
        },
        {
          name: this.translate.instant('dashboard.notRenewedMembers'),
          data: []
        }
      ],
      isGrouped: true,
      showLegend: true,
      yAxisTitle: this.translate.instant('staff.countOfMembers'),
      categories: []
    };


    data.forEach((el: any) => {
      let cat = `${el.monthName}  ${el.year}`;
      this.z10Chart.categories.push(cat);
      this.z10Chart.series[0].data.push(el.oldMembers);
      this.z10Chart.series[1].data.push(el.newMembers);
      this.z10Chart.series[2].data.push(el.renewedMembers);
      this.z10Chart.series[3].data.push(el.notRenewedMembers);
    });
  }

  initIncomeSummaryChart(data: any) {

    this.incomeSummary = {
      title: this.translate.instant('dashboard.incomeSummary'),
      subtitle: "Showing results in last " + this.period + " days",
      series: [{ name: '', data: [] }],
      isGrouped: false,
      yAxisTitle: '',
      categories: []
    };

    Object.entries(data).forEach(([k, v]: any) => {
      this.incomeSummary.categories.push(this.translate.instant('dashboard.' + k));
      this.incomeSummary.series[0].data.push(v)
    });
  }

  initIncomePerEachPackageChart(data: any) {

    this.incomePerEachPackage = {
      title: this.translate.instant('dashboard.incomePerEach'),
      subtitle: "Showing results in last " + this.period + " days",
      series: [{ name: '', data: [] }],
      isGrouped: false,
      yAxisTitle: '',
      categories: []
    };

    data.forEach((el: any) => {
      this.incomePerEachPackage.categories.push(el.packageTypeName);
      this.incomePerEachPackage.series[0].data.push(el.total)
    });
  }


  getDashboard() {
    this.isCalledBefore = false;
    this.moreCharts = false;
    let periodMS = this.period * 86400000;
    let now = new Date().getTime();
    let dateFrom = new Date(now - periodMS);
    let props = {
      fromDate: dateFrom.toISOString(),
      toDate: new Date().toISOString(),
      skipCount: 0,
      takeCount: 10,
      userId: this.user.id
    };
    this.getInitialDashboard(props.fromDate, props.toDate);

    this.dashboardService.getDashboard(props).subscribe({
      next: (res) => {
        this.userStatistics = res.data;
      }
    })
  }

  getInitialDashboard(from: string, to: string) {
    forkJoin(
      {
        Knowledge: this.dashboardService.getChart('Knowledge', from, to).pipe(map(data => data.data)),
        Packages: this.dashboardService.getChart('Packages', from, to).pipe(map(data => data.data)),
        Debts: this.dashboardService.getChart('Debts', from, to).pipe(map(data => data.data)),
        Money: this.dashboardService.getChart('Money', from, to).pipe(map(data => data.data)),
        Z10: this.dashboardService.getChart('Z10', from, to).pipe(map(data => data.data)),
        Attendance: this.dashboardService.getChart('Attendance', from, to).pipe(map(data => data.data)),
        IncomeSummary: this.dashboardService.getChart('IncomeSummary', from, to).pipe(map(data => data.data)),
        IncomePerEachPackage: this.dashboardService.getChart('IncomePerEachPackage', from, to).pipe(map(data => data.data)),
      }
    ).subscribe(res => {
      this.initKnowledgeChart(res.Knowledge);
      this.initAttendanceCharts(res.Attendance);
      this.initMoneyChart(res.Money);
      this.initPackagesChart(res.Packages);
      this.initDebtsChart(res.Debts);
      this.initZ10Charts(res.Z10);
      this.initIncomeSummaryChart(res.IncomeSummary);
      this.initIncomePerEachPackageChart(res.IncomePerEachPackage);
    })

  }

  initMoreCharts(from: string, to: string) {
    forkJoin({
      Age: this.dashboardService.getChart('Age', from, to).pipe(map(data => data.data)),
      Gender: this.dashboardService.getChart('Gender', from, to).pipe(map(data => data.data)),
      CancellationReason: this.dashboardService.getChart('CancellationReason', from, to).pipe(map(data => data.data)),
      suitSize: this.dashboardService.getChart('suitSize', from, to).pipe(map(data => data.data)),
      memberLevels: this.dashboardService.getChart('memberLevels', from, to).pipe(map(data => data.data)),
      memberGoals: this.dashboardService.getChart('memberGoals', from, to).pipe(map(data => data.data)),
      attendanceByDay: this.dashboardService.getChart('attendanceByDay', from, to).pipe(map(data => data.data)),
      attendanceDayByDay: this.dashboardService.getChart('attendanceDayByDay', from, to).pipe(map(data => data.data)),
    }).subscribe(res => {
      this.initAgeChart(res.Age);
      this.initGenderChart(res.Gender);
      this.initCancelReasonChart(res.CancellationReason);
      this.initSuitSizeChart(res.suitSize);
      this.initMemberLevelsChart(res.memberLevels);
      this.initMemberGoalsChart(res.memberGoals);
      this.initAttendanceByDayChart(res.attendanceByDay);
      this.initAttendanceDayByDayChart(res.attendanceDayByDay);
    })
  }

  getMoreCharts() {
    this.moreCharts = !this.moreCharts
    if (this.moreCharts && !this.isCalledBefore) {
      let periodMS = this.period * 86400000;
      let now = new Date().getTime();
      let dateFrom = new Date(now - periodMS);
      let props = {
        fromDate: dateFrom.toISOString(),
        toDate: new Date().toISOString(),
        skipCount: 0,
        takeCount: 10,
        userId: this.user.id
      };
      this.isCalledBefore = true;
      this.initMoreCharts(props.fromDate, props.toDate);
    }
  }

  initAgeChart(data: any) {
    this.ageChart = {
      title: this.translate.instant('reports.table.age'),
      subtitle: "Showing results in last " + this.period + " days",
      labels: [],
      series: [],
      height: 365
    };

    data.forEach((el: any) => {
      this.ageChart.labels.push(el.key);
      this.ageChart.series.push(el.count);
    });
  }


  initGenderChart(data: any) {
    this.genderChart = {
      title: this.translate.instant('members.gender'),
      subtitle: "Showing results in last " + this.period + " days",
      labels: [],
      series: [],
      height: 365
    };

    data.forEach((el: any) => {
      this.genderChart.labels.push(el.key);
      this.genderChart.series.push(el.count);
    });
  }

  initCancelReasonChart(data: any) {
    this.cancellationReason = {
      title: this.translate.instant('classSchedule.cancellationReason'),
      subtitle: "Showing results in last " + this.period + " days",
      labels: [],
      series: [],
      height: 365
    };

    data.forEach((el: any) => {
      this.cancellationReason.labels.push(el.key);
      this.cancellationReason.series.push(el.count);
    });
  }

  initSuitSizeChart(data: any) {
    this.suitSize = {
      title: "Suit Sizes",
      subtitle: "Showing results in last " + this.period + " days",
      series: [{ name: '', data: [] }],
      isGrouped: false,
      yAxisTitle: '',
      categories: []
    };

    data.forEach((el: any) => {
      this.suitSize.categories.push(el.key);
      this.suitSize.series[0].data.push(el.count)
    });
  }

  initMemberLevelsChart(data: any) {
    this.memberLevels = {
      title: "Member Levels",
      subtitle: "Showing results in last " + this.period + " days",
      series: [{ name: '', data: [] }],
      isGrouped: false,
      yAxisTitle: '',
      categories: []
    };

    data.forEach((el: any) => {
      this.memberLevels.categories.push(el.key);
      this.memberLevels.series[0].data.push(el.count)
    });
  }
  initMemberGoalsChart(data: any) {
    this.memberGoals = {
      title: "Member Goals",
      subtitle: "Showing results in last " + this.period + " days",
      series: [{ name: '', data: [] }],
      isGrouped: false,
      yAxisTitle: '',
      categories: []
    };

    data.forEach((el: any) => {
      this.memberGoals.categories.push(el.key);
      this.memberGoals.series[0].data.push(el.count)
    });
  }

  initAttendanceByDayChart(data: any) {
    this.attendancePerWeek = {
      title: "Attendance per week",
      subtitle: "Showing results in last " + this.period + " days",
      series: [{ name: '', data: [] }],
      isGrouped: false,
      yAxisTitle: '',
      categories: []
    };

    data.forEach((el: any) => {
      this.attendancePerWeek.categories.push(el.key);
      this.attendancePerWeek.series[0].data.push(el.count)
    });
  }


  initAttendanceDayByDayChart(data: any) {
    this.attendanceDayByDay = {
      title: "Attendance day by day",
      subtitle: "Showing results in last " + this.period + " days",
      series: [{ name: '', data: [] }],
      isGrouped: false,
      yAxisTitle: '',
      categories: []
    };

    data.forEach((el: any) => {
      this.attendanceDayByDay.categories.push(el.key);
      this.attendanceDayByDay.series[0].data.push(el.count)
    });
  }
}
