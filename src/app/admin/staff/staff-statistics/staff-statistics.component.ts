import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { CommonService } from 'src/app/services/common.service';
import { StaffService } from 'src/app/services/staff.service';
import { ChangeSalesFormComponent } from './change-sales-form/change-sales-form.component';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BarChartComponent } from 'src/app/shared/bar-chart/bar-chart.component';
import { IChartConfig } from 'src/app/models/chart.model';

@Component({
  selector: 'app-staff-statistics',
  templateUrl: './staff-statistics.component.html',
  imports: [MatButtonModule, MatIconModule, TranslateModule, BarChartComponent]
})
export class StaffStatisticsComponent implements OnInit {
  staffStatistics: IChartConfig;
  palette = ['#5d62b5', '#ffc533', '#62b58f', '#9e56df', '#f2726f', '#d40ad7'];
  currentTheme: string;
  bgColor: string;
  constructor(public dialog: MatDialog, private staffService: StaffService, private common: CommonService, private translate: TranslateService) { }

  ngOnInit(): void {
    this.common.getTheme.subscribe((theme: any) => {
      if (theme.theme) {
        this.currentTheme = theme.theme;
        if (this.currentTheme === 'dark-theme') {
          this.bgColor = '#1a1919';
        } else {
          this.bgColor = '#ffffff';
        }
        this.initChart();
      }
    });
  }

  initChart() {
    this.staffService.getSalesStatistics().subscribe({
      next: (res) => {
        this.staffStatistics = {
          title: this.translate.instant('staff.countOfMembers'),
          height:600,
          series: [
            {
              name: this.translate.instant('staff.member'),
              data: []
            },
            {
              name: this.translate.instant('staff.potential'),
              data: []
            }
          ],
          isGrouped: true,
          showLegend: true,
          yAxisTitle: this.translate.instant('staff.countOfMembers'),
          categories: []
        };
        res.data.forEach((el: any) => {
          this.staffStatistics.categories.push(el.salesPersoName);
          this.staffStatistics.series[0].data.push(el.membersCount);
          this.staffStatistics.series[1].data.push(el.potentialsCount);
        });
      }
    });
  }


  onChangeSales() {
    let dialogRef = this.dialog.open(ChangeSalesFormComponent, {
      maxHeight: '80vh',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.initChart();
      }
    });
  }


}


