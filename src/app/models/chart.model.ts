
import {
    ApexAxisChartSeries,
    ApexChart,
    ApexDataLabels,
    ApexPlotOptions,
    ApexYAxis,
    ApexLegend,
    ApexStroke,
    ApexXAxis,
    ApexFill,
    ApexTooltip,
    ApexTitleSubtitle,
    ApexGrid,
    ApexMarkers,
    ApexResponsive,
    ApexTheme
} from "ng-apexcharts";


export type PieChartOptions = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    responsive: ApexResponsive[];
    labels: any;
    fill: ApexFill;
    title: ApexTitleSubtitle;
    subtitle: ApexTitleSubtitle;
    legend: ApexLegend;
    plotOptions: ApexPlotOptions;
  };

export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    yaxis: ApexYAxis;
    xaxis: ApexXAxis;
    title: ApexTitleSubtitle;
    subtitle: ApexTitleSubtitle;
    fill: ApexFill;
    tooltip: ApexTooltip;
    stroke: ApexStroke;
    legend: ApexLegend;
    grid: ApexGrid;
    markers: ApexMarkers;
    responsive: ApexResponsive[];
    labels: any;
    theme: ApexTheme
};

export interface IChartConfig {
    title: string,
    subtitle?: string,
    series: { name: string, data: number[] }[],
    height?: number,
    categories: any[],
    yAxisTitle: string,
    showDataLabels?: boolean,
    isHorizontal?: boolean,
    isGrouped?: boolean;
    showLegend?: boolean
}

export interface IPieChartConfig{
    series: number[],
    width?:any,
    height?:any,
    labels:string[],
    title: string,
    subtitle?: string,
}

export const _ChartsPalette = ['#5d62b5', '#62b58f', '#ffc533', '#f2726f', '#9e56df', '#f2726f', '#0080ff'];