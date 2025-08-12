import { Injectable, inject } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import moment from 'moment';
import { HttpResponseDTO, ISalesDashboardFilters, ISalesDayByDay, ISalesSummary } from 'src/app/models/common.model';
import { LookupType } from 'src/app/models/enums';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { APIService } from 'src/app/services/api.service';
import { IChartConfig, IPieChartConfig } from 'src/app/models/chart.model';
@Injectable()
export class DashboardChartService extends APIService {
  bgColor: string;
  palette = ['#dbdbdb', '#5d62b5', '#ffc533', '#f2726f', '#9e56df', '#f2726f', '#0080ff'];
  common = inject(CommonService);
  isDarkTheme: boolean;
  private http = inject(HttpClient);
  constructor(translate: TranslateService) {
    super(translate);
    this.common.getTheme.subscribe((theme: any) => {
      if (theme.theme) {
        if (theme.theme === 'dark-theme') {
          this.isDarkTheme = true;
          this.bgColor = '#1a1919';
        } else {
          this.isDarkTheme = false;
          this.bgColor = '#ffffff';
        }
      }
    });
  }

  getSales(): Observable<any[]> {
    return this.common.getLookup(LookupType.Sales);
  }
  getTrainers(): Observable<any[]> {
    return this.common.getLookup(LookupType.Trainers);
  }

  public generateWholeTargetPieChart(data: Partial<ISalesSummary>, name: keyof ISalesSummary = 'salesPersonName', fromDate: string): IPieChartConfig {
    if (data.reachedPercentage === 0) {
      data.reachedPercentage = .1;
    }
    return {
      title: `${data[name] ? data[name] : this.translate.instant('dashboard.wholeTarget')}`,
      subtitle: `${moment(fromDate).format('MMMM')}`,
      height: 300,
      labels: [`${this.translate.instant('dashboard.achievement')}`],
      series: [data.reachedPercentage!]
    };
  }

  public generateSalesChart(salesSummary: ISalesSummary[], name: keyof ISalesSummary = 'salesPersonName', fromDate: string): IChartConfig {
    return {
      title: this.translate.instant('dashboard.salesSummary'),
      subtitle: `${moment(fromDate).format('MMMM')}`,
      categories: salesSummary.map(item => { return item[name] }),
      series: [
        {
          name: this.translate.instant('dashboard.achievement'),
          data: salesSummary.map(item => { return item.actualValue })
        },
        {
          name: this.translate.instant('dashboard.target'),
          data: salesSummary.map(item => { return item.target })
        }
      ],
      yAxisTitle: '',
      showLegend: true,
      isGrouped: true
    };
  }

  public generateLineChart(salesName: string, monthlyData: ISalesDayByDay[], fromDate: string): IChartConfig {

    return {
      title: this.translate.instant('dashboard.salesDayByDay'),
      subtitle: `${salesName + ' (' + moment(fromDate).format('MMMM') + ')'}`,
      categories: monthlyData.map((item) => moment(item.atDate).format('DD')),
      series: [{ name: '', data: monthlyData.map((item) => item.actualValue) }],
      yAxisTitle: '',
    };
  }


  getDashboard(props: any): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(
      this.api() + 'api/Report/GetDashboardData', props, { headers: this.makeHeaders() }
    );
  }

  getChart(chartType: string, from: string, to: string): Observable<any> {

    let url = '';

    let props = {
      fromDate: from,
      toDate: to
    }

    switch (chartType) {
      case 'Attendance':
        url = 'api/Attendance/GetAttendanceStatisticsReport'
        break;
      case 'Money':
        url = 'api/Report/GetMoneyReceivedStatisticsReport'
        break;
      case 'Debts':
        url = 'api/Payment/GetDebtsStatisticsReport'
        break;
      case 'Packages':
        url = 'api/Accountant/GetAllPackagesRevenue'
        break;
      case 'Age':
        url = 'api/Member/GetAgeGroupReport'
        break;
      case 'Knowledge':
        url = 'api/Member/GetSourceOfKnowledgeReport'
        break;
      case 'Gender':
        url = 'api/Member/GetGenderReport'
        break;
      case 'CancellationReason':
        url = 'api/Membership/GetMembershipCancellationReasonReport'
        break;
      case 'Z10':
        url = 'api/Membership/GetMembersProgressForEachMonth'
        break;
      case 'IncomeSummary':
        url = 'api/Report/GetIncomeSummaryReport'
        break;
      case 'IncomePerEachPackage':
        url = 'api/Report/GetIncomeForEachPackageType'
        break;
      case 'suitSize':
        url = 'api/Member/GetMemberSuitSizeStatistics'
        break;
      case 'memberGoals':
        url = 'api/Member/GetMemberGoalsStatistics'
        break;
      case 'memberLevels':
        url = 'api/Member/GetMemberLevelStatistics'
        break;
      case 'attendanceByDay':
        url = 'api/Attendance/GetAttendanceGroupedByDayOfWeek'
        break;
      case 'attendanceDayByDay':
        url = 'api/Attendance/GetAttendanceDayByDay'
        break;
    }

    return this.http.post<HttpResponseDTO<any>>(this.api() + `${url}`, props, {
      headers: this.makeHeaders()
    });
  }

  getSalesDashboard(filters: ISalesDashboardFilters) {
    return this.http.post<HttpResponseDTO<any>>(this.api() + 'api/Report/GetSalesDashboard', filters, {
      headers: this.makeHeaders()
    });
  }

  getTrainerDashboard(filters: ISalesDashboardFilters) {
    return this.http.post<HttpResponseDTO<any>>(this.api() + 'api/Report/GetTrainersDashboard', filters, {
      headers: this.makeHeaders()
    });
  }

}
