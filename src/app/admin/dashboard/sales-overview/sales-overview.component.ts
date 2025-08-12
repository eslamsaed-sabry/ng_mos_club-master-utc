import { ChangeDetectorRef, Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { MatOptionModule } from '@angular/material/core';
import moment from 'moment';
import { IDashboardChartFilters, ISalesDashboard, ISalesSummary } from 'src/app/models/common.model';
import { DashboardChartService } from '../dashboard-chart.service';
import { Subscription } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { DatePipe } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CircleChartComponent } from 'src/app/shared/circle-chart/circle-chart.component';
import { BarChartComponent } from 'src/app/shared/bar-chart/bar-chart.component';
import { LineChartComponent } from 'src/app/shared/line-chart/line-chart.component';
import { IChartConfig, IPieChartConfig } from 'src/app/models/chart.model';

@Component({
  selector: 'app-sales-overview',
  templateUrl: './sales-overview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCheckboxModule, FormsModule, MatFormFieldModule, MatSelectModule, MatOptionModule, MatInputModule, MatDatepickerModule, MatExpansionModule, MatIconModule, MatButtonModule, RouterLink, DatePipe, TranslateModule, CircleChartComponent, BarChartComponent, LineChartComponent]
})
export class SalesOverviewComponent implements OnInit {
  formChangesSubscription: Subscription;
  wholeTargetPieChart: IPieChartConfig;
  targetSalesPersonBarChart: IChartConfig;
  salesPersons: ISalesSummary[];
  chartService = inject(DashboardChartService);
  cdr = inject(ChangeDetectorRef);
  sales: any[] = [];
  filters: IDashboardChartFilters = {} as IDashboardChartFilters;


  ngOnInit(): void {
    this.filters.fromDate = new Date();
    this.getDashboard();
    this.chartService.getSales().subscribe(sales => this.sales = sales);
  }

  getDashboard() {
    this.filters.fromDate = moment(this.filters.fromDate).startOf('month');
    this.filters.toDate = moment(this.filters.fromDate).endOf('month');
    this.chartService.getSalesDashboard(this.filters).subscribe({
      next: (res) => {
        const data: ISalesDashboard = res.data;
        this.salesPersons = data.salesSummary;
        setTimeout(() => {
          this.wholeTargetPieChart = this.chartService.generateWholeTargetPieChart(data.wholeTarget, 'salesPersonName', this.filters.fromDate);
          this.targetSalesPersonBarChart = this.chartService.generateSalesChart(data.salesSummary, 'salesPersonName', this.filters.fromDate);
          this.cdr.markForCheck();
        }, 500);
      }
    });
  }

  onSelectSales() {
    if (this.filters.salesIds.includes(99999)) {
      this.filters.salesIds = this.sales.map(sale => sale.id);
    } else if (this.filters.salesIds.includes(0)) {
      this.filters.salesIds = [];
    }
    this.getDashboard();
  }

}
