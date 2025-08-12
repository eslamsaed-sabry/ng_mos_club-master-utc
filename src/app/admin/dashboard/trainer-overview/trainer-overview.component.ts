import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { MatOptionModule } from '@angular/material/core';
import moment from 'moment';
import { IDashboardChartFilters, ISalesSummary, ITrainerDashboard } from 'src/app/models/common.model';
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
import { LineChartComponent } from 'src/app/shared/line-chart/line-chart.component';
import { BarChartComponent } from 'src/app/shared/bar-chart/bar-chart.component';
import { CircleChartComponent } from 'src/app/shared/circle-chart/circle-chart.component';
import { IChartConfig, IPieChartConfig } from 'src/app/models/chart.model';

@Component({
  selector: 'app-trainer-overview',
  templateUrl: './trainer-overview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCheckboxModule, FormsModule, MatFormFieldModule, MatSelectModule, MatOptionModule, MatInputModule, MatDatepickerModule, MatExpansionModule, MatIconModule, MatButtonModule, RouterLink, DatePipe, TranslateModule, CircleChartComponent, BarChartComponent, LineChartComponent]
})
export class TrainerOverviewComponent implements OnInit {
  formChangesSubscription: Subscription;
  wholeTargetPieChart: IPieChartConfig;
  targetSalesPersonBarChart: IChartConfig;
  trainersSummary: ISalesSummary[];
  trainers: any[] = [];
  filters: IDashboardChartFilters = {} as IDashboardChartFilters;
  chartService = inject(DashboardChartService);
  cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.filters.fromDate = new Date();
    this.getDashboard();
    this.chartService.getTrainers().subscribe(trainers => this.trainers = trainers);
  }

  getDashboard() {
    this.filters.fromDate = moment(this.filters.fromDate).startOf('month');
    this.filters.toDate = moment(this.filters.fromDate).endOf('month');
    this.chartService.getTrainerDashboard(this.filters).subscribe({
      next: (res) => {
        const data: ITrainerDashboard = res.data;
        this.trainersSummary = data.summary;
        setTimeout(() => {
        this.wholeTargetPieChart = this.chartService.generateWholeTargetPieChart(data.wholeTarget, 'employeeName', this.filters.fromDate);
        this.targetSalesPersonBarChart = this.chartService.generateSalesChart(data.summary, 'employeeName', this.filters.fromDate);
        this.cdr.markForCheck();
        }, 500);
      }
    });
  }

  onSelectTrainers() {
    if (this.filters.trainersIds.includes(99999)) {
      this.filters.trainersIds = this.trainers.map(tr => tr.id);
    } else if (this.filters.trainersIds.includes(0)) {
      this.filters.trainersIds = [];
    }
    this.getDashboard();
  }

}
