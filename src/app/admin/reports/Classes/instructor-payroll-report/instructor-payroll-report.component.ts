import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ITableActionEvent, ITableColumn, MAT_TABLE_ACTION_TYPE, MAT_TABLE_COL_TYPE, MaterialTableComponent } from 'src/app/shared/material-table/material-table.component';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { ReportsService } from 'src/app/services/reports.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IInstructorDueAmountGrouped, InstructorDueAmountGrouped } from 'src/app/models/reports.model';
import moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { DecimalPipe } from '@angular/common';
import { map, mergeMap, of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-instructor-payroll-report',
  imports: [TranslateModule, MatDatepickerModule, MaterialTableComponent, MatInputModule, FormsModule, DecimalPipe],
  templateUrl: './instructor-payroll-report.component.html',
  providers: [provideNativeDateAdapter()]
})
export class InstructorPayrollReportComponent implements OnInit {
  private reportService = inject(ReportsService);
  private destroyRef = inject(DestroyRef);
  private translate = inject(TranslateService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  displayedCols: ITableColumn[] = [
    { key: 'isWithoutMembership', label: '', colType: MAT_TABLE_COL_TYPE.ICON, icon: 'warning_amber', iconClass: 'mo-text-red-500', tooltip: this.translate.instant('classSchedule.dueInstructorNoMembershipMsg') },
    { key: 'instructorName', label: this.translate.instant('classSchedule.instructor') },
    { key: 'classesCount', label: this.translate.instant('classSchedule.classesCount') },
    { key: 'instructorDueAmount', label: this.translate.instant('navigation.instructorDueAmount'), colType: MAT_TABLE_COL_TYPE.NUMBER }
  ];

  filters: InstructorDueAmountGrouped;
  data: IInstructorDueAmountGrouped[];
  totalDueAmount: number;

  ngOnInit(): void {
    this.getInstructors();
  }

  getDates() {

    const _fromParam = this.route.snapshot.queryParams['from'];
    const _toParam = this.route.snapshot.queryParams['to'];

    if (!this.filters) {
      let fromDate: Date;
      let toDate: Date;
      if (_fromParam && _toParam) {
        fromDate = new Date(_fromParam)
        toDate = new Date(_toParam)
      } else {
        fromDate = new Date(moment().startOf('month').format('YYYY-MM-DD hh:mm'));
        toDate = new Date(moment().endOf('month').format('YYYY-MM-DD hh:mm'));
      }
      this.filters = new InstructorDueAmountGrouped(fromDate, toDate)
    }
    return of([]);
  }

  getInstructors() {
    this.getDates().pipe(
      mergeMap(() => {
        return this.reportService.getInstructorDueAmountGroupedByInstructor(this.filters)
      })
    ).subscribe({
      next: (res) => {
        this.data = res.data;
        this.totalDueAmount = res.data.reduce((acc: any, curr: any) => acc + curr.instructorDueAmount, 0);
        this.router.navigate([], {
          queryParams: {}
        })
      }
    })
  }

  onTableAction(e: ITableActionEvent<IInstructorDueAmountGrouped>) {
    switch (e.actionName) {
      case MAT_TABLE_ACTION_TYPE.PAGINATION:

        break;

      default:
        this.router.navigate(['/admin/reports/instructors-classes-payroll'], {
          queryParams: {
            from: this.filters.fromDate,
            to: this.filters.toDate,
            instructorId: (e.data as IInstructorDueAmountGrouped)!.instructorId,
            instructor: (e.data as IInstructorDueAmountGrouped)!.instructorName,
            count: (e.data as IInstructorDueAmountGrouped)!.classesCount,
            dueAmount: (e.data as IInstructorDueAmountGrouped)!.instructorDueAmount,
          }
        })
        break;
    }
  }

}
