import { Component, OnInit, Input, ViewChild, inject, DestroyRef, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Attendance, Member, AttendanceFilters } from 'src/app/models/member.model';
import { MemberService } from 'src/app/services/member.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { AppConfigService } from 'src/app/services/app-config.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { MembershipStatusBadgeComponent } from '../../../shared/membership-status-badge/membership-status-badge.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MemberAttendanceFiltersComponent } from './member-attendance-filters/member-attendance-filters.component';
import { BidiModule } from '@angular/cdk/bidi';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { RoleDirective } from '../../../directives/role.directive';
import { NgStyle, NgClass, DatePipe } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { mergeMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss'],
  imports: [MatSidenavModule, NgStyle, RoleDirective, MatButtonModule, MatProgressSpinnerModule, MatIconModule, BidiModule, MemberAttendanceFiltersComponent, MatTableModule, MatSortModule, RouterLink, NgClass, MatPaginatorModule, MembershipStatusBadgeComponent, DatePipe, TranslateModule]
})
export class AttendanceComponent implements OnInit {
  @ViewChild('phoneModal') phoneModal: TemplateRef<any>;
  attendance: Attendance[] = [];
  @Input() viewMode: string = 'table';
  @Input() member: Member;
  @Input() showFilters: boolean = true;
  dataSource: MatTableDataSource<Attendance[]> = new MatTableDataSource();;
  displayedColumns: string[] = [
    'attendanceDate',
    // 'accessCode',
    'contractNo',
    'phoneNumber',
    'englishName',
    'package',
    'startDate',
    'endDate',
    'checkOutDate',
    'branch',
    'salesPersonName',
    'userName',
    'delete'
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  imageLoader: boolean = true;
  public appConfig = inject(AppConfigService);
  proxyUrl = this.appConfig.envUrl;
  loading: boolean;
  totalElements: number;
  page: number = 0;
  @Input() perPage: number = 10;
  width = screen.width;
  filters: AttendanceFilters = new AttendanceFilters();
  phoneModalData: Attendance = {} as Attendance;
  public dialog = inject(MatDialog);
  private memberService = inject(MemberService);
  private translate = inject(TranslateService);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private commonService = inject(CommonService);

  ngOnInit(): void {
    this.filters.skipCount = 0;
    this.filters.takeCount = 10;
    this.commonService.fetchRouteFilters().subscribe((params) => {
      if (params) {
        this.filters = { ...params } as AttendanceFilters;
        this.page = Math.floor(this.filters.skipCount! / this.filters.takeCount!);
      }
    });

    this.getAttendance();
  }

  applyFilter() {
    this.commonService.setRouteFilters(this.filters);
    this.getAttendance();
  }

  getExportedData() {
    this.loading = true;
    let newFilters = { ...this.filters };
    delete newFilters.skipCount;
    delete newFilters.takeCount;
    let props = {
      ...newFilters,
      showToastr: 'false',
      showSpinner: 'false'
    }

    this.memberService.exportMemberAttendance(props).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.data) {
          window.open(this.proxyUrl + res.data)
        }
      },
      error: (err) => {
        this.loading = false;
      }
    });
  }

  onPaginationChange(e: PageEvent) {
    this.page = e.pageIndex;
    this.perPage = e.pageSize;

    this.filters.skipCount = e.pageIndex * this.filters.takeCount!;
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
    this.getAttendance();
  }

  reset() {
    this.router.navigate([], {
      queryParams: {
        contextId: null
      },
      queryParamsHandling: 'merge'
    });
    delete this.filters.id;
  }

  getAttendance() {
    this.filters = {
      ...this.filters,
      skipCount: this.page * this.perPage,
      takeCount: this.perPage,
    };

    this.filters = <AttendanceFilters>Object.fromEntries(Object.entries(this.filters).filter(([k, v]) => v != null))
    const _contextId = +this.route.snapshot.queryParams['contextId'];
    if (_contextId) {
      this.filters.id = _contextId;
    }

    this.memberService.getMembersAttendance(this.filters).pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.attendance = res.data;
          this.totalElements = res.totalCount;
          this.dataSource = new MatTableDataSource(res.data);
          this.dataSource.sort = this.sort;
        },
      });
  }

  onDeleteAttendance(attendance: Attendance) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxHeight: '80vh',
      data: { mainTitle: this.translate.instant('members.msgToDeletedAttendance'), subTitle: `${attendance.attendanceDateAsString}` },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'yes') {
        this.deleteAttendance(attendance.id);
      }
    });
  }

  deleteAttendance(attenID: number) {
    this.memberService.deleteAttendance(attenID).subscribe({
      next: (res) => {
        if (res.statusCode === 200) {
          this.getAttendance();
        }
      }
    })
  }

  openPhonePopup(attendance: Attendance) {
    this.phoneModalData = attendance;
    this.dialog.open(this.phoneModal, {
      autoFocus: false,
      width: '400px',
    });
  }

}
