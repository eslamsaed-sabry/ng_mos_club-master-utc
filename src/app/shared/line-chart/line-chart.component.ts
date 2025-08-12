import { AsyncPipe } from "@angular/common";
import { Component, effect, inject, model, ViewChild } from "@angular/core";
import { ChartComponent, NgApexchartsModule } from "ng-apexcharts";
import { map } from "rxjs";
import { _ChartsPalette, ChartOptions, IChartConfig } from "src/app/models/chart.model";
import { CommonService } from "src/app/services/common.service";

@Component({
  selector: 'app-line-chart',
  imports: [NgApexchartsModule, AsyncPipe],
  templateUrl: './line-chart.component.html'
})
export class LineChartComponent {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  config = model.required<IChartConfig>();
  palette = _ChartsPalette;
  private common = inject(CommonService);

  theme$ = this.common.getTheme.pipe(map((theme: any) => {
    const _theme = { mode: theme.theme === 'dark-theme' ? 'dark' : 'light' } as ApexTheme;
    this.config.update((data) => {
      const _data = { ...data }
      return _data
    });
    return _theme;
  }));

  constructor() {
    effect(() => {
      this.chartOptions = {
        series: this.config().series,
        chart: {
          height: 350,
          type: "line",
          zoom: {
            enabled: false
          },
          toolbar: {
            show: false
          }
        },
        dataLabels: {
          enabled: this.config().showDataLabels
        },
        stroke: {
          show: true,
          curve: 'straight',
          lineCap: 'butt',
          // colors: ['#444', '#999'],
          width: 3,
          dashArray: 0,
        },
        markers: {
          size: 6,
          hover: {
            size: 10
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
        grid: {
          row: {
            colors: ["#f3f3f3", "transparent"],
            opacity: 0.5
          }
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
        }
      };
    })
  }
}
