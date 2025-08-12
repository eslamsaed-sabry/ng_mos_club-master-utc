import { Component, DestroyRef, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { ReportsService } from 'src/app/services/reports.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IChangeClassRate, IInstructorDueAmountGroupedByClasses, InstructorDueAmountClassesReportFilters, InstructorDueAmountGrouped } from 'src/app/models/reports.model';
import moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIcon } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DatePipe, DecimalPipe } from '@angular/common';
import { InstructorDueAmountReportComponent } from '../../instructor-due-amount-report/instructor-due-amount-report.component';
import { MatDialog } from '@angular/material/dialog';
import { ReportsPageHeaderComponent } from '../../../reports-page-header/reports-page-header.component';

@Component({
  selector: 'app-payroll-classes-grouped',
  imports: [TranslateModule, MatDatepickerModule, MatInputModule, MatIcon, MatTooltipModule, ReportsPageHeaderComponent, DecimalPipe,
    FormsModule, MatSelectModule, MatTableModule, MatSortModule, MatPaginatorModule, DatePipe, InstructorDueAmountReportComponent],
  templateUrl: './payroll-classes-grouped.component.html',
  providers: [provideNativeDateAdapter()]
})
export class PayrollClassesGroupedComponent implements OnInit {
  displayedColumns: string[] = ['classTypeName', 'classStartDate', 'classEndDate', 'membersCount', 'instructorRate', 'isPercentage'];
  dataSource: MatTableDataSource<IInstructorDueAmountGroupedByClasses>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('dueAmountReportModal') dueAmountReportModal: TemplateRef<any>;
  private reportService = inject(ReportsService);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  fromDate = new Date(moment().startOf('month').format('YYYY-MM-DD hh:mm'));
  toDate = new Date(moment().endOf('month').format('YYYY-MM-DD hh:mm'));
  filters = new InstructorDueAmountGrouped(this.fromDate, this.toDate);
  totalElements: number;
  classDetailsFilter: InstructorDueAmountClassesReportFilters;
  translate = inject(TranslateService);
  selectedClass: IInstructorDueAmountGroupedByClasses;
  instructorName = this.route.snapshot.queryParams['instructor'];
  count = this.route.snapshot.queryParams['count'];
  dueAmount = this.route.snapshot.queryParams['dueAmount'];
  ngOnInit(): void {
    this.filters.fromDate = new Date(this.route.snapshot.queryParams['from']);
    this.filters.toDate = new Date(this.route.snapshot.queryParams['to']);
    this.getInstructors();
  }


  getInstructors() {
    const instructorId = +this.route.snapshot.queryParams['instructorId'];
    this.reportService.getInstructorDueAmountGroupedByClass(this.filters, instructorId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.data);
        this.dataSource.sort = this.sort;
        this.totalElements = res.totalCount;
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onChangeClassRate(selectedClass: IInstructorDueAmountGroupedByClasses) {
    const data: IChangeClassRate = {
      classId: selectedClass.classId,
      isPercentage: selectedClass.isPercentage,
      rate: selectedClass.instructorRate
    }
    this.reportService.changeClassRate(data).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  gotoClass(selectedClass: IInstructorDueAmountGroupedByClasses) {
    this.router.navigate(['/admin/scheduler/booking-list/class', selectedClass.classId]);
  }

  showClassDetails(selectedClass: IInstructorDueAmountGroupedByClasses) {
    this.selectedClass = selectedClass;
    this.classDetailsFilter = {
      classId: selectedClass.classId,
      fromDate: this.filters.fromDate,
      toDate: this.filters.toDate
    }

    this.dialog.open(this.dueAmountReportModal, {
      maxHeight: '90vh',
      minHeight: '40vh'
    });
  }

  printReport() {
    let name = this.translate.instant('classSchedule.instructorsPayrollClassesGrouped');
    this.reportService.printReportTable(name);
  }


  backToPre() {
    this.router.navigate(['/admin/reports/instructors-payroll'], {
      queryParams: {
        from: moment(this.filters.fromDate).format('YYYY-MM-DD hh:mm'),
        to: moment(this.filters.toDate).format('YYYY-MM-DD hh:mm')
      }
    })
  }


}
