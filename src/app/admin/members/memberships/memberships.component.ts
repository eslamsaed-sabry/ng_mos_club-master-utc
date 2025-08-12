import { Component, DestroyRef, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Attendance, Benefit, dialogChangePaymentBranchData, dialogMemberFreezeData, dialogMemberInvitationData, dialogMembershipData, FullMember, IChangeSalesDialog, Member, MemberFilters, Membership } from 'src/app/models/member.model';
import { MemberService } from 'src/app/services/member.service';
import { debounceTime, mergeMap, Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { UpgradeModalComponent } from './upgrade-modal/upgrade-modal.component';
import { FreezeFormComponent } from '../freezes/freeze-form/freeze-form.component';
import { AppConfigService } from 'src/app/services/app-config.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { CancelMembershipModalComponent } from './cancel-membership-modal/cancel-membership-modal.component';
import { TransferMembershipModalComponent } from './transfer-membership-modal/transfer-membership-modal.component';
import { ChangeMoneyModalComponent } from './change-money-modal/change-money-modal.component';
import { MatPaginator, PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MembershipPrintReceiptComponent } from './membership-print-receipt/membership-print-receipt.component';
import { InvitationFormComponent } from '../invitations/invitation-form/invitation-form.component';
import { ShowHistoryModalComponent } from './show-history-modal/show-history-modal.component';
import { ContextType, GymConfig, ReceiptTypes } from 'src/app/models/enums';
import { MembershipSessionsReceiptComponent } from './membership-sessions-receipt/membership-sessions-receipt.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ChangeSalesPersonModalComponent } from './change-sales-person-modal/change-sales-person-modal.component';
import { ChangeBranchesModalComponent } from './change-branches-modal/change-branches-modal.component';
import { MembershipPaymentsComponent } from './membership-payments/membership-payments.component';
import { MemberFreezesComponent } from '../freezes/member-freezes/member-freezes.component';
import { MemberUpgradesComponent } from './member-upgrades/member-upgrades.component';
import { MemberAttendanceComponent } from '../attendance/member-attendance/member-attendance.component';
import { BenefitsListComponent } from '../benefits-list/benefits-list.component';
import { RoleAttrDirective } from '../../../directives/role-attr.directive';
import { MatMenuModule } from '@angular/material/menu';
import { MembershipStatusBadgeComponent } from '../../../shared/membership-status-badge/membership-status-badge.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TableFiltersComponent } from '../table-filters/table-filters.component';
import { BidiModule } from '@angular/cdk/bidi';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { RoleDirective } from '../../../directives/role.directive';
import { NgClass, DatePipe } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ChangePaymentBranchComponent } from 'src/app/shared/change-payment-branch/change-payment-branch.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DateType, StandardDatePipe } from 'src/app/pipes/standard-date.pipe';
import { ChangeStartDateComponent } from './change-start-date/change-start-date.component';
import { CommonService } from 'src/app/services/common.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-memberships',
  templateUrl: './memberships.component.html',
  styleUrls: ['./memberships.component.scss'],
  imports: [MatSidenavModule, NgClass, RoleDirective, MatButtonModule, MatProgressSpinnerModule, MatIconModule,
    BidiModule, TableFiltersComponent, MatTableModule, MatSortModule, RouterLink, MembershipStatusBadgeComponent,
    MatMenuModule, RoleAttrDirective, MatPaginatorModule, BenefitsListComponent, MemberAttendanceComponent,
    MemberUpgradesComponent, MemberFreezesComponent, ChangeStartDateComponent, MembershipSessionsReceiptComponent,
    MembershipPaymentsComponent, DatePipe, TranslateModule, MatInputModule, MatFormFieldModule, MatTooltipModule,
    FormsModule]
})
export class MembershipsComponent implements OnInit {
  @ViewChild('benefitModal') benefitModal: TemplateRef<any>;
  @ViewChild('attendanceModal') attendanceModal: TemplateRef<any>;
  @ViewChild('upgradeModal') upgradeModal: TemplateRef<any>;
  @ViewChild('freezeModal') freezeModal: TemplateRef<any>;
  @ViewChild('paymentsModal') paymentsModal: TemplateRef<any>;
  @ViewChild('sessionPrint') sessionPrint: MembershipSessionsReceiptComponent;
  @ViewChild('changeStartDateModal') changeStartDateModal: TemplateRef<any>;
  @ViewChild('phoneModal') phoneModal: TemplateRef<any>;

  dataSource: MatTableDataSource<Membership[]> = new MatTableDataSource();
  displayedColumns: string[] = [
    'contractNo',
    'phoneNo',
    // 'accessCode',
    'nameEng',
    'packageName',
    'price',
    'paymentDate',
    'startDate',
    'expirationDate',
    'statusName',
    'salesName',
    'trainer',
    'actions',
  ];
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  private inputSearchSubject = new Subject<string>();

  totalElements: number;
  page: number = 0;
  perPage: number = 10;
  width = screen.width;
  member: Member = {} as Member;
  attendance: Attendance[] = [];
  memberships: Membership[];
  params: MemberFilters = { skipCount: 0, takeCount: 10, ...new MemberFilters() };
  loading: boolean;
  appConfig = inject(AppConfigService);
  proxyUrl = this.appConfig.envUrl;
  selectedMembership: Membership = {} as Membership;
  phoneModalData: Membership = {} as Membership;
  selectedMember: FullMember;
  selectedBenefit: Benefit[] = [];
  openModal: boolean = true;
  private memberService = inject(MemberService);
  public dialog = inject(MatDialog);
  private translate = inject(TranslateService);
  private route = inject(ActivatedRoute);
  destroyRef = inject(DestroyRef);
  standardDate = inject(StandardDatePipe);
  currentDate: string;
  private router = inject(Router);
  private commonService = inject(CommonService);

  ngOnInit(): void {
    this.currentDate = this.standardDate.transform(this.currentDate, DateType.TO_UTC);

    this.commonService.fetchRouteFilters().subscribe((params) => {
      if (params) {
        if (params.isActive || params.isActive == "true")
          params.isActive = true;

        this.params = { ...params } as MemberFilters;
        this.page = Math.floor(this.params.skipCount! / this.params.takeCount!);
      }
    });

    this.getMemberships();
    this.inputSearchSubject.pipe(
      debounceTime(1200)
    ).subscribe(value => {
      this.getMemberships();
    });
  }

  printTable() {
    window.print();
  }

  getFilters(filters: MemberFilters) {
    this.params = filters;
    this.params.memberName = filters.name!;
    this.params.accessCode = filters.code!;
    this.params.contractNo = filters.applicationNo!;
    this.params.StartFromDate = filters.BirthDateFrom!;
    this.params.StartToDate = filters.BirthDateTo!;
    this.params.skipCount = filters.skipCount == null ? 0 : filters.skipCount;
    this.params.takeCount = filters.takeCount == null ? 10 : filters.takeCount;

    delete this.params.name;
    delete this.params.code;
    delete this.params.applicationNo;
    delete this.params.BirthDateFrom;
    delete this.params.BirthDateTo;

    this.commonService.setRouteFilters(filters);
    this.getMemberships();
  }


  getMemberships() {
    this.route.queryParams.pipe(mergeMap((params) => {
      this.params.id = +params['contextId'];
      return this.memberService.getMemberships(this.params)
    }), takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.totalElements = res.totalCount;
        this.dataSource = new MatTableDataSource(res.data);
        this.dataSource.sort = this.sort;
      },
    });
  }

  onPaginationChange(e: PageEvent) {
    this.page = e.pageIndex;
    this.params.skipCount = e.pageIndex * this.params.takeCount!;
    this.params.takeCount = e.pageSize;

    this.router.navigate([], {
      queryParams: {
        skipCount: this.params.skipCount,
        takeCount: this.params.takeCount,
        page: this.page
      },
      queryParamsHandling: 'merge'
    });

    this.commonService.setRouteFilters(this.params);
    this.getMemberships();
  }

  getMemberData(membership: Membership, actionType: string = '') {
    this.member.membership = membership;
    if (actionType === 'viewMembership')
      this.viewMembership()
    if (actionType === 'invitation')
      this.addInvitation(membership)
    if (actionType === 'freeze')
      this.openFreezeTableModal()

  }

  openFreezeTableModal() {
    this.dialog.open(this.freezeModal, {
      width: '900px',
    });
  }

  deleteMembership(membershipId: number) {
    this.memberService.deleteMembership(membershipId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((res) => {
      if (res.data) {
        this.getMemberships();
      }
    })
  }

  terminateMembership(membershipId: number) {
    this.memberService.terminateMembership(membershipId).subscribe((res) => {
      if (res.data) {
        this.getMemberships();
      }
    })
  }


  viewMembership() {
    this.router.navigate(['/admin/form/membership/edit'], {
      queryParams: { id: this.member.membership.id }
    })
  }

  getBenefits(membership: Membership) {
    this.selectedMembership = membership;
    this.selectedMember = {} as FullMember;
    this.selectedMember.membershipMatchedData = <any>membership;
    this.selectedMember.membershipMatchedData.membershipId = membership.id;
    this.selectedMember.personalData = this.member;
    this.memberService.getMembershipBenefits(membership.id).subscribe({
      next: (res: any) => {
        this.selectedBenefit = res.data;
        this.selectedMember.membershipMatchedData.benfits = res.data;
        if (this.openModal) {
          this.dialog.open(this.benefitModal, {
            width: '600px',
          });
        }
      }
    })
  }

  getAttendance(membership: Membership) {
    this.selectedMembership = membership;
    let obj = {
      membershipId: membership.id
    };
    this.memberService.getMembershipAttendance(obj).subscribe({
      next: (res) => {
        this.attendance = res.data;
        this.dialog.open(this.attendanceModal);
      }
    })
  }

  freezeOrUn(membership: Membership) {
    let data = {} as dialogMemberFreezeData;
    data.type = membership.statusName === 'Freezed' ? 'Unfreeze' : 'freeze';;
    data.membership = membership;
    let dialogRef = this.dialog.open(FreezeFormComponent, {
      maxHeight: '80vh',
      width: '400px',
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getMemberships();
      }
    });

  }

  update(membership: Membership, whichCase: string) {
    let data: dialogMembershipData = {} as dialogMembershipData;
    data.membership = membership;
    data.type = whichCase;
    switch (whichCase) {
      case 'upgrade':
        this.selectedMembership = membership;
        this.dialog.open(this.upgradeModal, {
          width: '900px',
        });
        break;
      case 'downgrade':
        const downDialogRef = this.dialog.open(UpgradeModalComponent, {
          maxHeight: '80vh',
          width: '600px',
          data: data,
          autoFocus: false
        });
        downDialogRef.afterClosed().subscribe(result => {
          if (result && result.status === 'success') {
            this.getMemberships();
          }
        });
        break;
      case 'suspend':
        const suspendDialogRef = this.dialog.open(ConfirmationDialogComponent, {
          maxHeight: '80vh',
          width: '600px',
          data: { mainTitle: this.translate.instant('members.msgToSuspendMembership') },
          autoFocus: false
        });
        suspendDialogRef.afterClosed().subscribe(result => {
          if (result && result.status === 'yes') {
            this.suspendMembership(membership);
          }
        });
        break;
      case 'terminate':
        const terminateDialogRef = this.dialog.open(ConfirmationDialogComponent, {
          maxHeight: '80vh',
          width: '600px',
          data: { mainTitle: this.translate.instant('members.msgToTerminateMembership') },
          autoFocus: false
        });
        terminateDialogRef.afterClosed().subscribe(result => {
          if (result && result.status === 'yes') {
            this.terminateMembership(membership.id);
          }
        });
        break;
      case 'delete':
        const deleteDialogRef = this.dialog.open(ConfirmationDialogComponent, {
          maxHeight: '80vh',
          width: '600px',
          data: { mainTitle: this.translate.instant('members.msgToDeletedMembership') },
          autoFocus: false
        });
        deleteDialogRef.afterClosed().subscribe(result => {
          if (result && result.status === 'yes') {
            this.deleteMembership(membership.id);
          }
        });
        break;
      case 'resume':
        const resumeDialogRef = this.dialog.open(ConfirmationDialogComponent, {
          maxHeight: '80vh',
          width: '600px',
          data: { mainTitle: this.translate.instant('members.msgToResumeMembership') },
          autoFocus: false
        });
        resumeDialogRef.afterClosed().subscribe(result => {
          if (result && result.status === 'yes') {
            this.resumeMembership(membership);
          }
        });

        break;
      case 'cancel':
        const cancelDialogRef = this.dialog.open(CancelMembershipModalComponent, {
          maxHeight: '80vh',
          width: '600px',
          data: data,
          autoFocus: false
        });
        cancelDialogRef.afterClosed().subscribe(result => {
          if (result && result.status === 'success') {
            this.getMemberships();
          }
        });
        break;

    }
  }

  changeStartDate(membership: Membership) {
    let data: dialogMembershipData = {} as dialogMembershipData;
    data.membership = membership;

    this.selectedMembership = membership;
    this.dialog.open(this.changeStartDateModal, {
      maxHeight: '80vh',
      width: '900px',
    });
  }

  suspendMembership(membership: Membership) {
    this.memberService.suspendMembership(membership.id).subscribe({
      next: (res) => {
        this.getMemberships();
      }
    })
  }

  resumeMembership(membership: Membership) {
    this.memberService.resumeMembership(membership.id).subscribe({
      next: (res) => {
        this.getMemberships();
      }
    })
  }

  addInvitation(membership: Membership) {
    this.memberService.getGymConfig(GymConfig.RotateInvitation).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        let data = {} as dialogMemberInvitationData;
        data.type = 'addInvitation';

        data.memberData = this.member;
        data.membershipId = membership.id;
        data.hideSales = true;
        data.rotateInvitation = res.data == "true" ? true : false;
        data.memberData.applicationNo = this.member.membership.contractNo
        data.memberData.code = this.member.membership.accessCode
        data.memberData.phoneNo = this.member.membership.phoneNo
        data.memberData.nameEng = this.member.membership.memberEnglishName

        let dialogRef = this.dialog.open(InvitationFormComponent, {
          maxHeight: '80vh',
          width: '750px',
          data: data,
        });

        dialogRef.afterClosed().subscribe(result => {
        });
      }
    })
  }


  getExportedData() {
    this.loading = true;
    let props = {
      ...this.params,
      showToastr: 'false',
      showSpinner: 'false'
    }

    this.memberService.exportMemberships(props).subscribe({
      next: (res) => {
        this.loading = false;
        window.open(this.proxyUrl + res.data)
      },
      error: (err) => {
        this.loading = false;
      }
    });
  }

  // getReceiptType(membership: Membership) {
  //   this.memberService.getGymConfig(GymConfig.receiptType).pipe(
  //     switchMap(res =>
  //       this.memberService.getGymConfig(GymConfig.MembershipReceiptDisplayedFields).pipe(
  //         map(data => {
  //           return { receiptType: res, fields: data }
  //         }))
  //     ),
  //     takeUntilDestroyed(this.destroyRef)).subscribe({
  //       next: (res) => {
  //         const _fields = res.fields.data.split(",").map(([firstLetter, ...rest]: [string]) => firstLetter.toLowerCase() + rest.join(''));
  //         membership.receiptType = res.receiptType.data;
  //          this.print(membership.id, _fields, res.receiptType.data);
  //       }
  //     })
  // }


  print(membership: Membership) {
    let dialogRef = this.dialog.open(MembershipPrintReceiptComponent, {
      maxHeight: '90vh',
      width: '700px',
      data: { membershipId: membership.id },
      autoFocus: false,
      id: "printable-receipt"
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  transfer(membership: Membership) {
    let data: dialogMembershipData = {} as dialogMembershipData;
    data.membership = membership;
    const downDialogRef = this.dialog.open(TransferMembershipModalComponent, {
      maxHeight: '80vh',
      width: '600px',
      data: data,
      autoFocus: false
    });
    downDialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getMemberships();
      }
    });
  }

  changeEmployee(membership: Membership, type: 'salesPerson' | 'trainer') {
    let data: IChangeSalesDialog = {
      id: type === 'trainer' ? membership.coachId : membership.salesPersonId,
      type: type,
      membershipId: membership.id
    };

    const downDialogRef = this.dialog.open(ChangeSalesPersonModalComponent, {
      maxHeight: '80vh',
      width: '600px',
      data: data,
      autoFocus: false
    });
    downDialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getMemberships();
      }
    });
  }

  changeMoney(membership: Membership) {
    let data: dialogMembershipData = {} as dialogMembershipData;
    data.membership = membership;
    const downDialogRef = this.dialog.open(ChangeMoneyModalComponent, {
      maxHeight: '80vh',
      width: '600px',
      data: data,
      autoFocus: false
    });
    downDialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getMemberships();
      }
    });
  }

  changeMemberShipBranches(membership: Membership) {
    let data: dialogMembershipData = {} as dialogMembershipData;
    data.membership = membership;
    const downDialogRef = this.dialog.open(ChangeBranchesModalComponent, {
      maxHeight: '80vh',
      width: '500px',
      data: data,
      autoFocus: false
    });
    downDialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getMemberships();
      }
    });
  }

  changePaymentBranch(membership: Membership, isCanceled: boolean) {
    let data: dialogChangePaymentBranchData = {} as dialogChangePaymentBranchData;
    data.branchId = membership.branchId;
    data.contextId = membership.id;
    if (isCanceled)
      data.contextTypeId = ContextType.REFUND;
    else
      data.contextTypeId = ContextType.MEMBERSHIP;


    const downDialogRef = this.dialog.open(ChangePaymentBranchComponent, {
      maxHeight: '80vh',
      width: '500px',
      data: data,
      autoFocus: false
    });
    downDialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getMemberships();
      }
    });
  }

  showHistory(membership: Membership) {
    let data: dialogMembershipData = {} as dialogMembershipData;
    data.membership = membership;
    const downDialogRef = this.dialog.open(ShowHistoryModalComponent, {
      maxHeight: '80vh',
      width: '600px',
      data: data,
      autoFocus: false
    });
  }

  printSessions(membership: Membership) {
    this.sessionPrint.printSessions(membership.id);
  }

  getPayments(membership: Membership) {
    this.selectedMembership = membership;
    this.dialog.open(this.paymentsModal, {
      width: '900px',
      autoFocus: false
    });
  }

  openPhonePopup(member: Membership) {
    this.phoneModalData = member;
    this.dialog.open(this.phoneModal, {
      autoFocus: false,
      width: '400px',
    });
  }

  onSearchInput(value: string) {
    this.inputSearchSubject.next(value);
  }
}
