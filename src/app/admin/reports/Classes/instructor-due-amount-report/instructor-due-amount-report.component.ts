import { Component, inject, input, OnInit } from '@angular/core';
import { DecimalPipe, NgStyle } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { InstructorDueAmountClassesReportFilters, InstructorDueAmountReport } from 'src/app/models/reports.model';
import { ClassesReports, InstructorDueAmountBasedOn } from 'src/app/models/enums';
import { ReportsService } from 'src/app/services/reports.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-instructor-due-amount-report',
  templateUrl: './instructor-due-amount-report.component.html',
  imports: [TranslateModule, DecimalPipe, NgStyle, RouterLink]
})


export class InstructorDueAmountReportComponent implements OnInit {

  filters = input.required<InstructorDueAmountClassesReportFilters>();
  reports: InstructorDueAmountReport[];
  classesReportsName = ClassesReports;
  instructorDueAmountBasedOn = InstructorDueAmountBasedOn;
  private reportsService = inject(ReportsService);

  ngOnInit(): void {
    this.generate();
  }

  generate() {
    this.reportsService.getInstructorDueAmountBasedOnAmount(this.filters()).subscribe({
      next: (res) => {
        this.reports = res.data;
      }
    })
  }

  calcTotal(array: any[], col: string): number {
    let result: number = 0;
    array!.forEach((el) => {
      result += el[col]
    });
    return result;
  }
}

