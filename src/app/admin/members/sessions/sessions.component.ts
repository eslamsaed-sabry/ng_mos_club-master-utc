import { Component, OnInit, Input, ViewChild, Output, EventEmitter, inject, DestroyRef, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { debounceTime, Subject } from 'rxjs';
import { Session, Member, dialogMemberSessionData, MemberFilters, dialogChangePaymentBranchData } from 'src/app/models/member.model';
import { MemberService } from 'src/app/services/member.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { SessionFormComponent } from './session-form/session-form.component';
import { SessionPrintReceiptComponent } from './session-print-receipt/session-print-receipt.component';
import { AppConfigService } from 'src/app/services/app-config.service';
import { ContextType, GymConfig } from 'src/app/models/enums';
import { DateType } from 'src/app/pipes/standard-date.pipe';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { SessionStatusPipe } from '../../../pipes/session-status.pipe';
import { RoleAttrDirective } from '../../../directives/role-attr.directive';
import { MatMenuModule } from '@angular/material/menu';
import { TableFiltersComponent } from '../table-filters/table-filters.component';
import { BidiModule } from '@angular/cdk/bidi';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RoleDirective } from '../../../directives/role.directive';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgStyle, NgClass, DatePipe } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ChangePaymentBranchComponent } from 'src/app/shared/change-payment-branch/change-payment-branch.component';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss'],
  imports: [MatSidenavModule, NgStyle, MatButtonModule, MatIconModule, RoleDirective, MatProgressSpinnerModule, BidiModule, TableFiltersComponent, MatTableModule, MatSortModule, NgClass, MatMenuModule, RoleAttrDirective, MatPaginatorModule, DatePipe, SessionStatusPipe, TranslateModule]
})
export class SessionsComponent implements OnInit {
  @ViewChild('phoneModal') phoneModal: TemplateRef<any>;
  @Output() refresh: EventEmitter<any> = new EventEmitter();
  sessions: Session[] = [];
  phoneModalData: Session = {} as Session;
  @Input() member: Member;
  dataSource: MatTableDataSource<Session>;
  displayedColumns: string[] = [
    'sessionDate',
    'phone',
    'memberName',
    'type',
    'price',
    // 'approveStatus',
    'actions'
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  totalElements: number;
  page: number = 0;
  width = screen.width;
  loading: boolean;
  appConfig = inject(AppConfigService);
  proxyUrl = this.appConfig.envUrl;
  filters: MemberFilters = new MemberFilters();

  public dialog = inject(MatDialog);
  private translate = inject(TranslateService);
  private memberService = inject(MemberService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private commonService = inject(CommonService);

  constructor() { }

  ngOnInit(): void {
    this.filters.skipCount = 0;
    this.filters.takeCount = 10;
    this.commonService.fetchRouteFilters().subscribe((params) => {
      if (params) {
        this.filters = { ...params } as MemberFilters;
        this.page = Math.floor(this.filters.skipCount! / this.filters.takeCount!);
      }
    });

    this.getSessions();

    this.filterSub.pipe(debounceTime(700)).subscribe((res) => {
      this.page = 0;
      this.filters = res;
      this.page = Math.floor(this.filters.skipCount! / this.filters.takeCount!);
      this.getSessions();
    });
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

    this.memberService.exportSessions(props).subscribe({
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

  filterSub = new Subject<MemberFilters>();

  getFilters(filters: MemberFilters) {
    filters.fromDate = filters.paymentDateFrom!;
    filters.toDate = filters.paymentDateTo!;

    delete filters.paymentDateFrom;
    delete filters.paymentDateTo;

    this.filters.skipCount = filters.skipCount == null ? 0 : filters.skipCount;
    this.filters.takeCount = filters.takeCount == null ? 10 : filters.takeCount;

    filters.skipCount = filters.skipCount == null ? 0 : filters.skipCount;
    filters.takeCount = filters.takeCount == null ? 10 : filters.takeCount;

    this.commonService.setRouteFilters(filters);
    this.filterSub.next(filters);
  }

  onPaginationChange(e: PageEvent) {
    this.page = e.pageIndex;

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
    this.getSessions();
  }

  getSessions() {
    this.memberService.getSessions(this.filters).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.sessions = res.data;
        this.totalElements = res.totalCount;
        this.dataSource = new MatTableDataSource(this.sessions);
        this.dataSource.sort = this.sort;
      }
    })
  }

  addSession() {
    let data = {} as dialogMemberSessionData;
    data.type = 'addSession';
    data.memberData = this.member;
    let dialogRef = this.dialog.open(SessionFormComponent, {
      maxHeight: '80vh',
      width: '600px',
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getSessions();
      }
    });
  }

  editSession(session: Session) {
    let data = {} as dialogMemberSessionData;
    data.type = 'editSession';
    data.memberData = this.member;
    data.session = session;
    let dialogRef = this.dialog.open(SessionFormComponent, {
      maxHeight: '80vh',
      width: '600px',
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getSessions();
      }
    });
  }

  onDeleteSession(session: Session) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxHeight: '80vh',
      data: { mainTitle: this.translate.instant('members.msgToDeletedSession'), subTitle: `${session.type}` },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'yes') {
        this.deleteSession(session.sessionId);
      }
    });
  }

  deleteSession(sessionId: number) {
    this.memberService.deleteSessions(sessionId).subscribe({
      next: (res) => {
        if (res) {
          this.getSessions();
        }
      }
    })
  }

  getReceiptType(session: Session) {
    this.memberService.getGymConfig(GymConfig.receiptType).subscribe({
      next: (res) => {
        session.receiptType = res.data;
        this.print(session);
      }
    })
  }

  print(session: Session) {
    let dialogRef = this.dialog.open(SessionPrintReceiptComponent, {
      maxHeight: '90vh',
      width: '700px',
      data: session,
      autoFocus: false,
      id: "printable-receipt"
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  changePaymentBranch(session: Session) {
    let data: dialogChangePaymentBranchData = {} as dialogChangePaymentBranchData;
    data.branchId = session.branchId;
    data.contextId = session.sessionId;
    data.contextTypeId = ContextType.SESSION;

    const downDialogRef = this.dialog.open(ChangePaymentBranchComponent, {
      maxHeight: '80vh',
      width: '500px',
      data: data,
      autoFocus: false
    });
    downDialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getSessions();
      }
    });
  }

  openPhonePopup(session: Session) {
    this.phoneModalData = session;
    this.dialog.open(this.phoneModal, {
      autoFocus: false,
      width: '400px',
    });
  }
}
