import { Component, OnInit, Input, ViewChild, EventEmitter, Output, TemplateRef, inject, DestroyRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CallMember, CallsFilters, dialogMemberCallData, Member } from 'src/app/models/member.model';
import { MemberService } from 'src/app/services/member.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { CallFormComponent } from './call-form/call-form.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { AppConfigService } from 'src/app/services/app-config.service';
import { MemberCallsComponent } from './member-calls/member-calls.component';
import { MatMenuModule } from '@angular/material/menu';
import { CallFiltersComponent } from './call-filters/call-filters.component';
import { BidiModule } from '@angular/cdk/bidi';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RoleDirective } from '../../../directives/role.directive';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgStyle, DatePipe } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonService } from 'src/app/services/common.service';
@Component({
  selector: 'app-calls',
  templateUrl: './calls.component.html',
  styleUrls: ['./calls.component.scss'],
  imports: [MatSidenavModule, NgStyle, MatButtonModule, MatIconModule, RoleDirective, MatProgressSpinnerModule, BidiModule, CallFiltersComponent, MatTableModule, MatSortModule, RouterLink, MatMenuModule, MatPaginatorModule, MemberCallsComponent, DatePipe, TranslateModule]
})
export class CallsComponent implements OnInit {
  @ViewChild('callsModal') callsModal: TemplateRef<any>;
  @ViewChild('phoneModal') phoneModal: TemplateRef<any>;
  @Output() refresh: EventEmitter<any> = new EventEmitter();
  calls: CallMember[] = [];
  memberCalls: CallMember[] = [];
  @Input() member: Member;
  selectedMember: any;
  @Input() membershipId: number;
  phoneModalData: CallMember = {} as CallMember;
  dataSource: MatTableDataSource<CallMember>;
  displayedColumns: string[] = [
    'callDate',
    'memberName',
    'memberPhoneNo',
    'sourceName',
    // 'reasonName',
    'feedbackName',
    'followUpDate',
    'summary',
    'userName',
    'actions'
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  totalElements: number;
  page: number = 0;
  width = screen.width;
  filters: CallsFilters = new CallsFilters();
  loading: boolean;
  appConfig = inject(AppConfigService);
  private router = inject(Router);
  public dialog = inject(MatDialog);
  private memberService = inject(MemberService);
  private route = inject(ActivatedRoute);
  private translate = inject(TranslateService);
  private destroyRef = inject(DestroyRef);
  private commonService = inject(CommonService);

  proxyUrl = this.appConfig.envUrl;
  selectedMemberName: string;
  constructor() { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['memberId']) {
        this.filters.memberId = params['memberId'];
        this.selectedMemberName = params['memberName'];
        this.getSelectedMember();
      }
    });
    this.filters.lastCallOnly = true;
    this.filters.skipCount = 0;
    this.filters.takeCount = 10;
    this.commonService.fetchRouteFilters().subscribe((params) => {
      if (params) {
        if (params.lastCallOnly || params.lastCallOnly == "true")
          params.lastCallOnly = true;

        this.filters = { ...params } as CallsFilters;
        this.page = Math.floor(this.filters.skipCount! / this.filters.takeCount!);
      }
    });
    this.getCalls();
  }

  applyFilter() {
    this.commonService.setRouteFilters(this.filters);
    this.getCalls();
  }

  clearFilters() {
    delete this.filters.memberId;
    this.page = 0;
    this.getCalls();
  }

  getExportedData() {
    this.loading = true;
    let newFilters = { ...this.filters };
    delete newFilters.skipCount;
    delete newFilters.takeCount;

    this.memberService.exportCalls(newFilters).subscribe({
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

  getMemberCalls(call: CallMember, openModal: boolean = true) {
    this.selectedMember = {} as Member;
    this.selectedMember.id = call.memberId;
    this.selectedMember.nameEng = call.memberName;
    this.selectedMember.phoneNo = call.memberPhoneNo;
    let filters = new CallsFilters();
    filters.memberId = call.memberId;
    this.memberService.getCalls(filters).subscribe({
      next: (res) => {
        this.memberCalls = res.data;
        if (openModal) {
          this.dialog.open(this.callsModal, {
            autoFocus: false
          });
        }
      }
    })
  }

  getCalls() {
    this.filters = <CallsFilters>Object.fromEntries(Object.entries(this.filters).filter(([k, v]) => v != null))

    this.memberService.getCalls(this.filters).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.calls = res.data;
        this.totalElements = res.totalCount;
        this.dataSource = new MatTableDataSource(this.calls);
        this.dataSource.sort = this.sort;
      }
    })
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
    this.getCalls();
  }

  getSelectedMember() {
    this.memberService.getMemberData(this.filters.memberId!).subscribe({
      next: (res) => {
        this.selectedMember = res.data.personalData;
      }
    })
  }

  openCallForm(actionType: string, call?: CallMember, showSearch: boolean = false) {
    let data = {} as dialogMemberCallData;
    if (call) {
      data.memberData = {} as Member;
      data.memberData.nameAR = call!.memberName;
      data.memberData.nameEng = call!.memberName;
      data.memberData.phoneNo = call!.memberPhoneNo;
      data.memberData.isHighPotential = call!.isHighPotential;
      data.memberData.id = call!.memberId;
      data.call = call;
    }
    data.type = actionType;
    data.showSearch = showSearch;
    if (this.filters.memberId) {
      data.memberData = this.selectedMember;
      data.showSearch = false;
    }
    let dialogRef = this.dialog.open(CallFormComponent, {
      maxHeight: '80vh',
      width: '700px',
      data: data,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getCalls();
        this.refresh.emit();
      }
    });
  }

  deleteCall(call: CallMember) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxHeight: '80vh',
      data: { mainTitle: this.translate.instant('members.msgToDeletedCall') },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'yes') {
        this.memberService.deleteCall(call.id).subscribe({
          next: (res) => {
            this.getCalls();
          }
        })
      }
    });
  }

  openPhonePopup(call: CallMember) {
    this.phoneModalData = call;
    this.dialog.open(this.phoneModal, {
      autoFocus: false,
      width: '400px',
    });
  }
}
