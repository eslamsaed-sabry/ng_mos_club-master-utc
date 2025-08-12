import { AsyncPipe } from "@angular/common";
import { Component, effect, inject, input, model, ViewChild } from "@angular/core";
import { ChartComponent, NgApexchartsModule } from "ng-apexcharts";
import { map } from "rxjs";
import { _ChartsPalette, IPieChartConfig, PieChartOptions } from "src/app/models/chart.model";
import { CommonService } from "src/app/services/common.service";

@Component({
  selector: 'app-circle-chart',
  imports: [NgApexchartsModule, AsyncPipe],

  templateUrl: './circle-chart.component.html'
})
export class CircleChartComponent {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<PieChartOptions>;
  config = model.required<IPieChartConfig>();
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
          width: this.config().width || '100%',
          height: this.config().height || '100%',
          type: "radialBar"
        },
        fill: {
          opacity: 1,
          colors: this.palette
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
        labels: this.config().labels,
        plotOptions: {
          radialBar: {
            hollow: {
              size: "70%" // Controls the inner circle size (higher value = thinner bar)
            },
            track: {
              background: "#E0E0E0",
              strokeWidth: "100%" // Controls the background track thickness
            },
            dataLabels: {
              name: {
                fontSize: "14px",
                fontWeight: '600',
                color: '#000',
                fontFamily: 'Cairo'
              },
              value: {
                fontSize: "14px",
                fontWeight: '600',
                color: '#000',
                fontFamily: 'Cairo'
              }
            }
          }
        },
      };
    })
  }
}
