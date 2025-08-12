import { AsyncPipe } from "@angular/common";
import { Component, effect, inject, model, ViewChild } from "@angular/core";
import { ChartComponent, NgApexchartsModule } from "ng-apexcharts";
import { map } from "rxjs";
import { _ChartsPalette, ChartOptions, IChartConfig } from "src/app/models/chart.model";
import { CommonService } from "src/app/services/common.service";

@Component({
  selector: 'app-bar-chart',
  imports: [NgApexchartsModule, AsyncPipe],
  templateUrl: './bar-chart.component.html'
})
export class BarChartComponent {
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  config = model.required<IChartConfig>();
  palette = _ChartsPalette;
  private common = inject(CommonService);
  colWidth = '15px';
  theme$ = this.common.getTheme.pipe(map((theme: any) => {
    const _theme = { mode: theme.theme === 'dark-theme' ? 'dark' : 'light' } as ApexTheme;
    this.config.update((data) => {
      const _data = { ...data }
      if(_data.categories.length < 8 ){
        this.colWidth = '40px'
      }
      return _data
    });
    return _theme;
  }));

  constructor() {
    effect(() => {

      this.chartOptions = {
        series: this.config().series,
        chart: {
          type: "bar",
          height: this.config().height || 300,
          toolbar: {
            show: false
          }
        },
        fill: {
          opacity: 1,
          colors: this.palette
        },
        legend: {
          show: this.config().showLegend
        },
        plotOptions: {
          bar: {
            horizontal: this.config().isHorizontal,
            columnWidth: this.colWidth,
            distributed: !this.config().isGrouped
          }
        },
        dataLabels: {
          enabled: this.config().showDataLabels
        },
        stroke: {
          show: true,
          width: 2,
          colors: ["transparent"]
        },
        xaxis: {
          categories: this.config().categories,
          labels: {
            rotate: -90,
            style: {
              fontSize: '12px',
              fontFamily: 'Cairo',
              fontWeight: 400,
            }
          }
        },
        yaxis: {
          title: {
            text: this.config().yAxisTitle
          }
        },
        title: {
          text: this.config().title,
          offsetY: 0,
          align: "center",
          style: {
            fontSize: '18px',
            fontFamily: 'Cairo'
          }
        },
        subtitle: {
          text: this.config()?.subtitle,
          align: 'center',
          style: {
            fontSize: '12px',
            fontWeight: 'normal',
            fontFamily: 'Cairo'
          },
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val + "";
            }
          }
        }
      };

    })
  }
}


