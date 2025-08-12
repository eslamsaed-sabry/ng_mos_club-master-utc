import { Component, OnInit, TemplateRef, ViewChild, Input, AfterViewInit, OnChanges, SimpleChanges, Output, EventEmitter, inject, DestroyRef } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Attendance, Benefit, dialogChangePaymentBranchData, dialogMemberData, dialogMemberFreezeData, dialogMemberInvitationData, dialogMembershipData, FullMember, IChangeSalesDialog, Member, Membership } from 'src/app/models/member.model';
import { MemberService } from 'src/app/services/member.service';
import { MatDialog } from '@angular/material/dialog';
import { UpgradeModalComponent } from './../upgrade-modal/upgrade-modal.component';
import { FreezeFormComponent } from '../../freezes/freeze-form/freeze-form.component';
import { InvitationFormComponent } from '../../invitations/invitation-form/invitation-form.component';
import { ShowHistoryModalComponent } from '../show-history-modal/show-history-modal.component';
import { ChangeMoneyModalComponent } from '../change-money-modal/change-money-modal.component';
import { TransferMembershipModalComponent } from '../transfer-membership-modal/transfer-membership-modal.component';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { CancelMembershipModalComponent } from '../cancel-membership-modal/cancel-membership-modal.component';
import { MembershipPrintReceiptComponent } from '../membership-print-receipt/membership-print-receipt.component';
import { ContextType, GymConfig, ReceiptTypes } from 'src/app/models/enums';
import { MembershipSessionsReceiptComponent } from '../membership-sessions-receipt/membership-sessions-receipt.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ChangeSalesPersonModalComponent } from '../change-sales-person-modal/change-sales-person-modal.component';
import { ChangeBranchesModalComponent } from '../change-branches-modal/change-branches-modal.component';
import { MembershipPaymentsComponent } from '../membership-payments/membership-payments.component';
import { MemberFreezesComponent } from '../../freezes/member-freezes/member-freezes.component';
import { MemberUpgradesComponent } from '../member-upgrades/member-upgrades.component';
import { MemberDebtsComponent } from '../../debts/member-debts/member-debts.component';
import { MemberAttendanceComponent } from '../../attendance/member-attendance/member-attendance.component';
import { BenefitsListComponent } from '../../benefits-list/benefits-list.component';
import { RoleDirective } from '../../../../directives/role.directive';
import { MatMenuModule } from '@angular/material/menu';
import { MembershipStatusBadgeComponent } from '../../../../shared/membership-status-badge/membership-status-badge.component';
import { RoleAttrDirective } from '../../../../directives/role-attr.directive';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgClass, DatePipe } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ChangePaymentBranchComponent } from 'src/app/shared/change-payment-branch/change-payment-branch.component';
import { DateType, StandardDatePipe } from 'src/app/pipes/standard-date.pipe';
import { map, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ChangeStartDateComponent } from '../change-start-date/change-start-date.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-single-member-memberships',
  templateUrl: './single-member-memberships.component.html',
  styleUrls: ['./single-member-memberships.component.scss'],
  imports: [MatSidenavModule, NgClass, MatFormFieldModule, MatIconModule, MatInputModule, MatButtonModule, RoleAttrDirective, MatTableModule, MatSortModule, MembershipStatusBadgeComponent, MatMenuModule, RoleDirective, MatPaginatorModule, BenefitsListComponent, MemberAttendanceComponent, MemberDebtsComponent, MemberUpgradesComponent, MemberFreezesComponent, MembershipSessionsReceiptComponent, MembershipPaymentsComponent, DatePipe, TranslateModule, RouterLink, ChangeStartDateComponent, MatTooltipModule]
})
export class SingleMemberMembershipsComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('benefitModal') benefitModal: TemplateRef<any>;
  @ViewChild('attendanceModal') attendanceModal: TemplateRef<any>;
  @ViewChild('debtsModal') debtsModal: TemplateRef<any>;
  @ViewChild('upgradeModal') upgradeModal: TemplateRef<any>;
  @ViewChild('freezeModal') freezeModal: TemplateRef<any>;
  @ViewChild('sessionPrint') sessionPrint: MembershipSessionsReceiptComponent;
  @ViewChild('paymentsModal') paymentsModal: TemplateRef<any>;
  @ViewChild('changeStartDateModal') changeStartDateModal: TemplateRef<any>;

  @Input() memberships: Membership[] = [];
  @Input() member: Member = {} as Member;
  @Input() hideSearch: boolean;
  @Input() hideAction: boolean;
  @Input() selectedId?: number;
  @Output() refresh: EventEmitter<any> = new EventEmitter();
  private destroyRef = inject(DestroyRef);
  private memberService = inject(MemberService);
  public dialog = inject(MatDialog);
  private translate = inject(TranslateService);
  private standardDate = inject(StandardDatePipe);

  selectedMember: FullMember;
  dataSource: MatTableDataSource<Membership>;
  displayedColumns: string[] = [
    'packageName',
    'attendance',
    'price',
    'totalAmountRemaining',
    'startDate',
    'expirationDate',
    'statusName',
    'salesName',
    'trainer',
    'userName',
    'actions'
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  width = screen.width;
  attendance: Attendance[] = [];
  selectedMembership: Membership = {} as Membership;
  currentDate: string;


  ngOnInit(): void {
    this.currentDate = this.standardDate.transform(this.currentDate, DateType.TO_UTC);
    this.dataSource = new MatTableDataSource(this.memberships);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['memberships'].firstChange) {
      this.dataSource = new MatTableDataSource(this.memberships);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource(this.memberships);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  selectedBenefit: Benefit[] = [];
  openModal: boolean = true;
  getBenefits(membership: Membership) {
    this.selectedMembership = membership;
    this.selectedMember = {} as FullMember;
    this.selectedMember.membershipMatchedData = <any>membership;
    this.selectedMember.membershipMatchedData.membershipId = membership.id;
    this.selectedMember.personalData = this.member;
    this.memberService.getMembershipBenefits(membership.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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
    this.memberService.getMembershipAttendance(obj).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.attendance = res.data;
        this.dialog.open(this.attendanceModal, {
          height: '500px',
        });
      }
    })
  }

  getMemberships() {
    this.memberService.getMemberData(this.member.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res: any) => {
        this.memberships = res.data.memberships;
        this.dataSource = new MatTableDataSource(this.memberships);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.refresh.emit();
      }
    })
  }

  freeze(membership: Membership) {
    this.selectedMembership = membership;
    this.dialog.open(this.freezeModal, {
      width: '900px',
    });
  }

  unfreeze(membership: Membership) {
    let data = {} as dialogMemberFreezeData;
    data.type = 'Unfreeze';;
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

  suspendMembership(membership: Membership) {
    this.memberService.suspendMembership(membership.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.getMemberships();
      }
    })
  }

  resumeMembership(membership: Membership) {
    this.memberService.resumeMembership(membership.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.getMemberships();
      }
    })
  }

  // addMembership() {
  //   let data = {} as dialogMemberData;
  //   data.type = 'addMembership';
  //   data.memberData = this.member;
  //   data.selectedTab = 'membership';

  //   let dialogRef = this.dialog.open(MemberFormComponent, {
  //     maxHeight: '80vh',
  //     width: '900px',
  //     data: data,
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result && result.status === 'success') {
  //       this.refresh.emit();
  //     }
  //   });
  // }

  // editMembership(membership: Membership) {
  //   let data = {} as dialogMemberData;
  //   data.type = 'editMembership';
  //   data.memberData = this.member;
  //   data.memberData.membership = membership;
  //   data.selectedTab = 'membership';

  //   let dialogRef = this.dialog.open(MemberFormComponent, {
  //     maxHeight: '80vh',
  //     width: '900px',
  //     data: data,
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result && result.status === 'success') {
  //       this.refresh.emit();
  //     }
  //   });
  // }

  terminateMembership(membershipId: number) {
    this.memberService.terminateMembership(membershipId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((res) => {
      if (res.data) {
        this.getMemberships();
      }
    })
  }

  deleteMembership(membershipId: number) {
    this.memberService.deleteMembership(membershipId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((res) => {
      if (res.data) {
        this.refresh.emit();
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
        let dialogRef = this.dialog.open(InvitationFormComponent, {
          maxHeight: '80vh',
          width: '750px',
          data: data,
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result && result.action === 'success') {
            this.refresh.emit();
          }
        });
      }
    })
  }

  showDebts(membership: Membership) {
    this.selectedMembership = membership;
    this.dialog.open(this.debtsModal, {
      autoFocus: false
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


  getReceiptType(membership: Membership) {
    this.memberService.getGymConfig(GymConfig.receiptType).pipe(
      switchMap(res =>
        this.memberService.getGymConfig(GymConfig.MembershipReceiptDisplayedFields).pipe(
          map(data => {
            return { receiptType: res, fields: data }
          }))
      ),
      takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (res) => {
          const _fields = res.fields.data.split(",").map(([firstLetter, ...rest]: [string]) => firstLetter.toLowerCase() + rest.join(''));
          membership.receiptType = res.receiptType.data;
          this.print(membership.id, _fields, res.receiptType.data);
        }
      })
  }


  print(membershipId: number, fields: string[], receiptType: ReceiptTypes) {
    let dialogRef = this.dialog.open(MembershipPrintReceiptComponent, {
      maxHeight: '90vh',
      width: '700px',
      data: { membershipId: membershipId, fields: fields, receiptType: receiptType },
      autoFocus: false,
      id: "printable-receipt"
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  printSessions(membership: Membership) {
    this.sessionPrint.printSessions(membership.id);
  }

  getPayments(membership: Membership) {
    this.selectedMembership = membership;
    this.dialog.open(this.paymentsModal, {
      width: '900px',
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

  changeStartDate(membership: Membership) {
    let data: dialogMembershipData = {} as dialogMembershipData;
    data.membership = membership;
    this.selectedMembership = membership;
    this.dialog.open(this.changeStartDateModal, {
      maxHeight: '80vh',
      width: '900px',
    });
  }

}
