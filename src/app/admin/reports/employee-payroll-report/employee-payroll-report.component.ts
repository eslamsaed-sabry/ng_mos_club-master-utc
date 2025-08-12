import { Component, inject, OnInit } from '@angular/core';
import { EmployeePayrollReportFilter, EmployeePayrollReport } from 'src/app/models/reports.model';
import { ReportsService } from 'src/app/services/reports.service';
import { TranslateModule } from '@ngx-translate/core';
import { DecimalPipe, DatePipe } from '@angular/common';
import { EmployeePayrollFiltersComponent } from './employee-payroll-filters/employee-payroll-filters.component';
import { ReportsPageHeaderComponent } from '../reports-page-header/reports-page-header.component';

@Component({
  selector: 'app-employee-payroll-report',
  templateUrl: './employee-payroll-report.component.html',
  styleUrls: ['./employee-payroll-report.component.scss'],
  imports: [ReportsPageHeaderComponent, EmployeePayrollFiltersComponent, DecimalPipe, DatePipe, TranslateModule]
})
export class EmployeePayrollReportComponent implements OnInit {

  filters: EmployeePayrollReportFilter = new EmployeePayrollReportFilter();
  reports: EmployeePayrollReport;
  isResult: boolean;

  private reportsService = inject(ReportsService);

  ngOnInit(): void {
  }

  generate() {
    this.isResult = false;
    this.reportsService.getEmployeePayrollReport(this.filters).subscribe({
      next: (res) => {
        this.isResult = true;
        this.reports = res.data;
      }
    })
  }

  calcTotal(array: any[], col: string): number {
    let result: number = 0;
    array!.forEach((el) => {
      result += el[col]
    });
    return result / 60;
  }

  getAction(actionName: string) {
    switch (actionName) {
      case 'generate':
        this.generate();
        break;
      case 'clear':
        this.isResult = false;
        this.filters = new EmployeePayrollReportFilter();
        break;
      default:
        window.print();
        break;
    }
  }

}

