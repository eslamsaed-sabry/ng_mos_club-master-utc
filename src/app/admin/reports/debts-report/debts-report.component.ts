import { Component, OnInit } from '@angular/core';
import { DebtsReportFilters } from 'src/app/models/reports.model';
import { MemberService } from 'src/app/services/member.service';
import { GenderPipe } from '../../../pipes/gender.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { DecimalPipe, DatePipe } from '@angular/common';
import { DebtsReportFiltersComponent } from './debts-report-filters/debts-report-filters.component';
import { ReportsPageHeaderComponent } from '../reports-page-header/reports-page-header.component';

@Component({
    selector: 'app-debts-report',
    templateUrl: './debts-report.component.html',
    styleUrls: ['./debts-report.component.scss'],
    imports: [ReportsPageHeaderComponent, DebtsReportFiltersComponent, DecimalPipe, DatePipe, TranslateModule, GenderPipe]
})
export class DebtsReportComponent implements OnInit {
  isResult: boolean;
  filters: DebtsReportFilters = new DebtsReportFilters();
  debts: any[] = [];
  constructor(private memberService: MemberService) { }

  ngOnInit(): void {
  }

  clear() {
    this.isResult = false;
    this.filters = new DebtsReportFilters();
  }

  getAction(actionName: string) {
    switch (actionName) {
      case 'generate':
        this.generate();
        break;
      case 'clear':
        this.isResult = false;
        this.clear();
        break;
      default:
        window.print();
        break;
    }
  }

  calcTotal(array: any[], col: string): number {
    let result: number = 0;
    array!.forEach((el) => {
      result += el[col]
    });
    return result;
  }

  generate() {
    this.isResult = false;
    this.memberService.getInstallments(this.filters)
      .subscribe({
        next: (res) => {
          this.isResult = true;
          this.debts = res.data;
        },
      });
  }
}
