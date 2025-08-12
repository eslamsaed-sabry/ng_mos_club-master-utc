import { Component, OnInit, ViewChild, TemplateRef, inject, DestroyRef } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { LookupType } from 'src/app/models/enums';
import { IStaffAttendance, StaffAttendanceFilters } from 'src/app/models/staff.model';
import { StaffService } from 'src/app/services/staff.service';
import moment from 'moment';
import { CommonService } from 'src/app/services/common.service';
import { DateType, StandardDatePipe } from 'src/app/pipes/standard-date.pipe';
import { ToastrService } from 'ngx-toastr';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSidenavModule } from '@angular/material/sidenav';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
    selector: 'app-staff-attendance',
    templateUrl: './staff-attendance.component.html',
    styleUrls: ['./staff-attendance.component.scss'],
    imports: [MatSidenavModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, FormsModule, MatSelectModule, MatOptionModule, MatTableModule, MatSortModule, MatButtonModule, MatIconModule, MatPaginatorModule, DatePipe, TranslateModule, MatDialogModule]
})
export class StaffAttendanceComponent implements OnInit {
  @ViewChild('addNoteModal') addNoteModal: TemplateRef<any>;
  @ViewChild('addAttendanceModal') addAttendanceModal: TemplateRef<any>;
  staffAttendance: IStaffAttendance[] = [];
  dataSource: MatTableDataSource<IStaffAttendance>;
  displayedColumns: string[] = [
    'staffMemberName',
    'creationDate',
    'operation',
    'notes',
    'addNote'
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  filters: StaffAttendanceFilters = new StaffAttendanceFilters();
  totalElements: number;
  page: number = 0;
  perPage: number = 10;
  selectedMember: IStaffAttendance;
  staffMembers: any[] = [];
  staffAttendanceCode: string;

  public dialog = inject(MatDialog);
  private translate = inject(TranslateService);
  private staffService = inject(StaffService);
  private commonService = inject(CommonService);
  private toastr = inject(ToastrService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  constructor() { }

  ngOnInit(): void {
    this.filters.skipCount = 0;
    this.filters.takeCount = 10;
    this.commonService.fetchRouteFilters().subscribe((params) => {
      if (params) {
        this.filters = { ...params } as StaffAttendanceFilters;
        this.page = Math.floor(this.filters.skipCount / this.filters.takeCount);
      }
    });

    this.getStaffAttendance();
    this.getStaffMembers();
  }

  applyFilter() {
    this.commonService.setRouteFilters(this.filters);
    this.getStaffAttendance();
  }

  getStaffMembers() {
    this.commonService.getLookup(LookupType.Staff).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res: any) => {
        this.staffMembers = res;
      }
    })
  }

  getStaffAttendance() {
    this.filters.fromDate = moment(this.filters.fromDate).format("YYYY-MM-DD") + 'T00:00';
    this.filters.toDate = moment(this.filters.toDate).format("YYYY-MM-DD") + 'T23:59';
    this.staffService.getStaffAttendance(this.filters).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    })
  }

  onPaginationChange(e: PageEvent) {
    this.page = e.pageIndex;
    this.filters.skipCount = e.pageIndex * this.filters.takeCount;
    this.filters.takeCount = e.pageSize;
    this.router.navigate([], {
      queryParams: {
        skipCount: this.filters.skipCount,
        takeCount: this.filters.takeCount,
        page: this.page
      },
      queryParamsHandling: 'merge'
    });
    this.commonService.setRouteFilters(this.filters);
    this.getStaffAttendance();
  }

  onAddNote(elem: IStaffAttendance) {
    this.selectedMember = elem;
    this.dialog.open(this.addNoteModal, {
      width: '300px'
    })
  }

  addNote(form: NgForm) {
    if (form.form.status === 'VALID') {
      this.staffService.editStaffAttendance(this.selectedMember).subscribe({
        next: () => {
          this.dialog.closeAll();
        }
      })
    }
  }

  onAddAttendance() {
    this.selectedMember = {} as IStaffAttendance;
    this.selectedMember.punchDate = moment(new Date()).format('YYYY-MM-DD') + 'T' + moment(new Date()).format('HH:mm');
    this.dialog.open(this.addAttendanceModal, {
      width: '400px'
    })
  }

  addAtt(form: NgForm) {
    if (form.form.status === 'VALID') {
      this.staffService.addStaffAttendance(this.selectedMember).subscribe({
        next: (res) => {
          this.dialog.closeAll();
          this.getStaffAttendance();
        }
      })
    }
  }

  addStaffAttendanceByCode() {
    if (this.staffAttendanceCode) {
      this.staffService.addStaffAttendanceByCode(this.staffAttendanceCode).subscribe({
        next: (res) => {
          this.staffAttendanceCode = "";
          if (res.data) {
            this.getStaffAttendance();
            this.toastr.success(this.translate.instant('staff.msgAttendanceHasBeenAdded'))
          }
          else
            this.toastr.error(this.translate.instant('staff.msgAttendanceHasNotBeenAdded'))
        }
      })
    }
    else
      this.toastr.error(this.translate.instant('staff.msgAttendanceHasNotBeenAdded'))
  }
}
