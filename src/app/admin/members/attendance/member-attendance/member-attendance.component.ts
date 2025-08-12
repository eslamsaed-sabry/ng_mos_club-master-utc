import { Component, OnInit, Input, ViewChild, AfterViewInit, EventEmitter, Output, OnChanges, SimpleChanges, inject, DestroyRef, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Attendance, AttendanceFilters, dialogMemberAttendanceData, Membership } from 'src/app/models/member.model';
import { MemberService } from 'src/app/services/member.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { AddAttendanceComponent } from '../add-attendance/add-attendance.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { RoleDirective } from '../../../../directives/role.directive';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgClass, DatePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


@Component({
    selector: 'app-member-attendance',
    templateUrl: './member-attendance.component.html',
    styleUrls: ['./member-attendance.component.scss'],
    imports: [MatFormFieldModule, MatIconModule, MatInputModule, MatCheckboxModule, FormsModule, MatButtonModule, MatTableModule, MatSortModule, RoleDirective, NgClass, MatPaginatorModule, DatePipe, TranslateModule, MatDialogTitle, MatDialogContent]
})
export class MemberAttendanceComponent implements OnInit, AfterViewInit, OnChanges {
  @Output() refresh: EventEmitter<any> = new EventEmitter();
  @Input() attendance: Attendance[] = [];
  @Input() membership: Membership;
  @Input() hideSearch: boolean;
  @Input() hideAddBtn: boolean;
  @ViewChild('responseModal') responseModal: TemplateRef<any>;
  dataSource: MatTableDataSource<Attendance>;
  displayedColumns: string[] = [
    'attendanceDate',
    // 'phoneNumber',
    'startDate',
    'endDate',
    'checkOutDate',
    'branch',
    'status',
    'salesPersonName',
    'userName',
    'response',
    'delete'
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isDeleted: boolean;
  attendanceResponse: Attendance;

  public dialog = inject(MatDialog);
  private memberService = inject(MemberService);
  private translate = inject(TranslateService);
  destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.attendance);
    if (this.attendance && this.attendance.length > 0 && this.attendance[0].packageCategory > 1) {
      this.displayedColumns = [
        'attendanceDate',
        // 'phoneNumber',
        'startDate',
        'endDate',
        'trainerName',
        // 'rateName',
        'status',
        'salesPersonName',
        'userName',
        'response',
        'delete'
      ];
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.dataSource = new MatTableDataSource(this.attendance);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    if (this.attendance && this.attendance.length > 0 && this.attendance[0].packageCategory > 1) {
      this.displayedColumns = [
        'attendanceDate',
        // 'phoneNumber',
        'startDate',
        'endDate',
        'trainerName',
        // 'rateName',
        'salesPersonName',
        'userName',
        'response',
        'delete'
      ];
    }
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onDeleteAttendance(attendance: Attendance) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxHeight: '80vh',
      data: { mainTitle: this.translate.instant('members.msgToDeletedAttendance'), subTitle: `${attendance.attendanceDateAsString}` },
      disableClose: true,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'yes') {
        this.deleteAttendance(attendance.id);
      }
    });
  }

  deleteAttendance(attenID: number) {
    this.memberService.deleteAttendance(attenID).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        if (res.statusCode === 200) {
          this.attendance = this.attendance.filter(el => el.id != attenID);
          this.dataSource = new MatTableDataSource(this.attendance);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      }
    })
  }

  getAttendance() {
    let obj: AttendanceFilters = {
      membershipId: this.membership.id,
      includeDeleted: this.isDeleted
    };
    this.memberService.getMembershipAttendance(obj).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.attendance = res.data;
        this.dataSource = new MatTableDataSource(this.attendance);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    })
  }

  addAttendance() {
    let data = {} as dialogMemberAttendanceData;
    data.type = 'add';
    data.membership = this.membership;

    let dialogRef = this.dialog.open(AddAttendanceComponent, {
      maxHeight: '80vh',
      width: '350px',
      data: data,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getAttendance();
      }
    });
  }

  showResponse(attendance: Attendance) {
    this.attendanceResponse = attendance;
    this.dialog.open(this.responseModal);
  }

}
