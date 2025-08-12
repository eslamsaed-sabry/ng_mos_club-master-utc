import { Component, OnInit, inject } from '@angular/core';
import { tap } from 'rxjs';
import { ProfitFilters, ProfitReport } from 'src/app/models/reports.model';
import { ReportsService } from 'src/app/services/reports.service';
import { GenderPipe } from '../../../pipes/gender.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ReportTabsComponent } from '../report-tabs/report-tabs.component';
import { NgClass, DecimalPipe, DatePipe } from '@angular/common';
import { ProfitFiltersComponent } from './profit-filters/profit-filters.component';
import { ReportsPageHeaderComponent } from '../reports-page-header/reports-page-header.component';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-profit',
    templateUrl: './profit.component.html',
    styleUrls: ['./profit.component.scss'],
    imports: [ReportsPageHeaderComponent, ProfitFiltersComponent, ReportTabsComponent, NgClass, MatTooltipModule, DecimalPipe, DatePipe, TranslateModule, GenderPipe]
})
export class ProfitComponent implements OnInit {
  filters: ProfitFilters = new ProfitFilters();
  reports: ProfitReport;
  tabs: string[] = [];
  isResult: boolean;
  hiddenIDs: string[] = [];
  private reportsService = inject(ReportsService);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['startDate'] && params['closingDate']) {
        this.filters.fromDate = params['startDate'];
        this.filters.toDate = params['closingDate'];
        this.generate();
      }
    })
  }

  generate() {
    this.tabs = [];
    this.isResult = false;
    this.hiddenIDs = [];

    if (this.filters.isGroupByCat) {
      this.reportsService.generateProfitReport(this.filters).pipe(
        tap((res) => {
          this.isResult = true;
          this.reports = res.data;
          Object.entries(this.reports).forEach(([k, v]) => {
            if (k !== 'reservations' && k !== 'otherRevenue' && v.length > 0) {
              this.tabs.push(k);
            } else if (v.length === 0) {
              this.hiddenIDs.push(k);
            }
          });
        })
      ).subscribe({
        complete: () => {
          setTimeout(() => {
            this.hiddenIDs.forEach((el: string) => {
              if (document.getElementById(el))
                document.getElementById(el)!.style.display = 'none';
            });
          }, 500);
        }
      })
    } else {
      this.reportsService.generateProfitReceiptsSummaryReport(this.filters).subscribe({
        next: (res) => {
          this.isResult = true;
          this.reports = res.data;
          Object.keys(this.reports).forEach(k => {
            this.tabs.push(k);
          });
        }
      })
    }


  }

  calcTotal(array: any[], col: string): number {
    let result: number = 0;
    array!.forEach((el) => {
      result += el[col]
    });
    return result;
  }


  getAction(actionName: string) {
    switch (actionName) {
      case 'generate':
        this.generate();
        break;
      case 'clear':
        this.isResult = false;
        this.filters = new ProfitFilters();
        break;
      default:
        window.print();
        break;
    }
  }
}
