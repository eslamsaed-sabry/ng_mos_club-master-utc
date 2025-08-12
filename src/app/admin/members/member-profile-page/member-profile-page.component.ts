import { Component, DestroyRef, OnInit, ViewChild, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { dialogPossibleMemberData, FullMemberInfo, IProfileTabs, Member, styleMemberAction } from 'src/app/models/member.model';
import { MemberService } from 'src/app/services/member.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AttachmentContextTypeId, MemberProfileTabs } from 'src/app/models/enums';
import { SingleMemberMembershipsComponent } from '../memberships/single-member-memberships/single-member-memberships.component';
import { MemberClassesComponent } from '../../../shared/member-classes/member-classes.component';
import { AttachmentsComponent } from '../../../shared/attachments/attachments.component';
import { MemberNotificationsComponent } from '../../management/member-notifications/member-notifications.component';
import { MemberSessionsComponent } from '../sessions/member-sessions/member-sessions.component';
import { MemberAttendanceComponent } from '../attendance/member-attendance/member-attendance.component';
import { MemberNotesComponent } from '../notes/member-notes/member-notes.component';
import { MemberInviteesComponent } from '../invitees/member-invitees/member-invitees.component';
import { MemberCallsComponent } from '../calls/member-calls/member-calls.component';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTabsModule } from '@angular/material/tabs';
import { MemberPersonalCardComponent } from '../member-personal-card/member-personal-card.component';
import { NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RoleDirective } from '../../../directives/role.directive';
import { MemberActionsComponent } from '../../../shared/member-actions/member-actions.component';
import { PotentialMemberFormComponent } from '../potential-members/potential-member-form/potential-member-form.component';
import { MemberMedicalHistoryComponent } from '../member-medical-history/member-medical-history.component';
import { MembersTrainingNotesComponent } from '../../extra/members-training-notes/members-training-notes.component';
import { ReportsService } from 'src/app/services/reports.service';
import { MemberPtSessionsComponent } from '../member-pt-sessions/member-pt-sessions.component';
import { MemberReferralComponent } from '../member-referral/member-referral.component';
import { MemberWalletComponent } from '../member-wallet/member-wallet.component';
import { MemberPaymentsComponent } from '../member-payments/member-payments.component';
@Component({
  selector: 'app-member-profile-page',
  templateUrl: './member-profile-page.component.html',
  styleUrls: ['./member-profile-page.component.scss'],
  imports: [MemberActionsComponent, RoleDirective, MatButtonModule, MatIconModule, MemberPersonalCardComponent, MatTabsModule, MatBadgeModule, MemberCallsComponent, MemberWalletComponent, MemberPaymentsComponent, MemberInviteesComponent, MemberNotesComponent, MemberAttendanceComponent, MemberSessionsComponent, MemberNotificationsComponent, MemberReferralComponent, AttachmentsComponent, MemberClassesComponent, SingleMemberMembershipsComponent, TranslateModule, MembersTrainingNotesComponent, RouterLink, MemberPtSessionsComponent, NgClass],
  providers: [ReportsService]
})
export class MemberProfilePageComponent implements OnInit {
  @ViewChild('membershipRef', { static: true }) membershipRef!: SingleMemberMembershipsComponent;
  fullMemberInfo: FullMemberInfo = {} as FullMemberInfo;
  id: number;
  styleMember: styleMemberAction;
  membershipId: number;
  sessionId: number;
  upgradeId: number;
  freezeId: number;
  debtId: number;
  private destroyRef = inject(DestroyRef);
  selectedTab: number = 0;
  activeTabName: MemberProfileTabs = MemberProfileTabs.MEMBERSHIP;
  tabs = MemberProfileTabs;
  memberContextId = AttachmentContextTypeId.MEMBERS;
  _MEMBER_PROFILE_TABS: IProfileTabs[] = [
    { id: MemberProfileTabs.MEMBERSHIP, title: 'members.memberships', countKey: 'totalMembershipsCount', showTitle: true },
    { id: MemberProfileTabs.MEMBER_Wallet, title: 'members.wallet', countKey: 'totalWallet', showTitle: false },
    { id: MemberProfileTabs.PAYMENTS, title: 'members.payment', countKey: 'totalPayments', showTitle: false },
    { id: MemberProfileTabs.CALLS, title: 'members.calls', countKey: 'totalCallsCount', showTitle: true },
    { id: MemberProfileTabs.INVITEES, title: 'members.invitees', countKey: 'totalInviteesCount', showTitle: true },
    { id: MemberProfileTabs.INVITED_BY, title: 'members.invitedBy', countKey: 'totalInvitationsCount', showTitle: true },
    // { id: MemberProfileTabs.TRAINING_NOTES, title: 'members.trainingNotes', countKey: 'totalTrainingNotes' ,showTitle:true},
    { id: MemberProfileTabs.NOTES, title: 'members.checkInNotes', countKey: 'totalNotesCount', showTitle: true },
    { id: MemberProfileTabs.ATTENDANCE, title: 'members.attendance', countKey: 'totalAttendanceCount', showTitle: true },
    { id: MemberProfileTabs.ONE_PASS_SERVICE, title: 'members.onePass', countKey: 'totalSessionsCount', showTitle: true },
    { id: MemberProfileTabs.NOTIFICATIONS, title: 'members.notifications', countKey: 'totalCommunications', showTitle: true },
    { id: MemberProfileTabs.ATTACHMENTS, title: 'members.attachments', countKey: 'totalAttachments', showTitle: true },
    { id: MemberProfileTabs.CLASSES, title: 'navigation.classes', countKey: 'totalClasses', showTitle: true },
    { id: MemberProfileTabs.PT_SESSIONS, title: 'classSchedule.pTSessions', countKey: 'totalConsumedPTSessions', showTitle: true },
    { id: MemberProfileTabs.MEMBER_REFERRALS, title: 'members.referrals', countKey: 'totalReferrals', showTitle: true },
  ];


  private memberService = inject(MemberService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  public dialog = inject(MatDialog);
  private translate = inject(TranslateService);
  width = window.innerWidth;
  ngOnInit(): void {
    this.getStyleMemberAction();
    this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.id = +params['id'];
      this.getMembershipData();
    });
  }



  init() {
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      let membership;
      switch (params['tab']) {
        case MemberProfileTabs.MEMBERSHIP:
          this.membershipId = +params['targetId'];
          break;
        case MemberProfileTabs.ONE_PASS_SERVICE:
          this.sessionId = +params['targetId']
          break;
        case MemberProfileTabs.UPGRADE:
          this.upgradeId = +params['targetId'];
          this.membershipId = +params['membershipId'];
          membership = this.fullMemberInfo.memberships.find(m => m.id === this.membershipId)
          this.membershipRef?.update(membership!, 'upgrade')
          break;
        case MemberProfileTabs.FREEZE:
          this.freezeId = +params['targetId'];
          this.membershipId = +params['membershipId'];
          membership = this.fullMemberInfo.memberships.find(m => m.id === this.membershipId)
          this.membershipRef?.freeze(membership!);
          break;
        case MemberProfileTabs.DEBTS:
          this.debtId = +params['targetId'];
          this.membershipId = +params['membershipId'];
          membership = this.fullMemberInfo.memberships.find(m => m.id === this.membershipId)
          this.membershipRef?.showDebts(membership!)
          break;
        default:
          break;
      };
      this.getSelectedTab(params['tab']);
    })
  }

  getStyleMemberAction(): void {
    this.styleMember = {} as styleMemberAction;
    this.styleMember.isButton = true;
    this.styleMember.styleClass = "";
    this.styleMember.color = "default";
    this.styleMember.iconName = "more_horiz";
    this.styleMember.mainTitle = this.translate.instant('members.actions')
  }


  getSelectedTab(tabName: MemberProfileTabs) {
    this.activeTabName = tabName;
    switch (tabName) {
      case MemberProfileTabs.ONE_PASS_SERVICE:
        this.selectedTab = 5;
        break;

      case MemberProfileTabs.CLASSES:
        this.selectedTab = 8;
        break;

      default:
        this.selectedTab = 0;
        break;
    }
  }

  getCalls() {
    this.memberService.getCalls(undefined, this.id).subscribe({
      next: (res) => {
        this.fullMemberInfo.calls = res.data;
      }
    })
  }

  getWallet() {
    this.memberService.getMemberWallet(this.id).subscribe({
      next: (res) => {
        this.fullMemberInfo.wallet = res.data;
      }
    })
  }

  getMemberFinancialBalance() {
    this.memberService.GetMemberFinancialBalance(this.id).subscribe({
      next: (res) => {
        this.fullMemberInfo.walletBalance = res.data;
      }
    })
  }

  getPayments() {
    this.memberService.getMemberPayments(this.id).subscribe({
      next: (res) => {
        this.fullMemberInfo.payments = res.data;
      }
    })
  }

  getMemberPaymentsTotal() {
    this.memberService.GetMemberPaymentsTotal(this.id).subscribe({
      next: (res) => {
        this.fullMemberInfo.totalPayments = res.data;
      }
    })
  }

  getInvitations(isInviteeId = false) {
    let sub = this.memberService.getInvitations(undefined, this.id)
    if (isInviteeId) {
      sub = this.memberService.getInvitations(undefined, undefined, this.id)
    }
    sub.subscribe({
      next: (res) => {
        this.fullMemberInfo.invitations = res.data;
      }
    })
  }

  getNotes() {
    this.memberService.getMemberNotes(this.id).subscribe({
      next: (res) => {
        this.fullMemberInfo.notes = res.data;
      }
    })
  }

  getAttendance() {
    this.memberService.getMembershipAttendance(undefined, this.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.fullMemberInfo.attendance = res.data;
      }
    })
  }

  getOnePassServices() {
    let obj = { memberId: this.id }
    this.memberService.getSessions(obj).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.fullMemberInfo.sessions = res.data;
      }
    })
  }

  getNotifications() {
    let obj = { memberId: this.id }
    this.memberService.getMemberNotification(obj).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.fullMemberInfo.communications = res.data;
      }
    })
  }

  getReferrals() {
    let obj = { memberId: this.id }
    this.memberService.getMemberReferral(obj).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.fullMemberInfo.referral = res.data;
      }
    })
  }

  getClasses() {
    this.memberService.getMemberClasses(this.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.fullMemberInfo.classes = res.data;
      }
    })
  }

  getPTSessions() {
    this.memberService.getMyConsumedPTSessionsReport(this.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.fullMemberInfo.ptSessions = res.data;
      }
    })
  }

  onChangeTab(e: any) {
    this.activeTabName = e.tab.ariaLabel;
    switch (this.activeTabName) {
      case MemberProfileTabs.CALLS:
        this.getCalls();
        break;
      case MemberProfileTabs.INVITEES:
        this.getInvitations();
        break;
      case MemberProfileTabs.INVITED_BY:
        this.getInvitations(true);
        break;
      case MemberProfileTabs.NOTES:
        this.getNotes();
        break;
      case MemberProfileTabs.ATTENDANCE:
        this.getAttendance();
        break;
      case MemberProfileTabs.ONE_PASS_SERVICE:
        this.getOnePassServices();
        break;
      case MemberProfileTabs.NOTIFICATIONS:
        this.getNotifications();
        break;
      case MemberProfileTabs.ATTACHMENTS:
        // self binding
        break;
      case MemberProfileTabs.CLASSES:
        this.getClasses();
        break;
      case MemberProfileTabs.PT_SESSIONS:
        this.getPTSessions();
        break;
      case MemberProfileTabs.MEMBER_REFERRALS:
        this.getReferrals();
        break;
      case MemberProfileTabs.MEMBER_Wallet:
        this.getWallet();
        this.getMemberFinancialBalance();
        break;
      case MemberProfileTabs.PAYMENTS:
        this.getPayments();
        this.getMemberPaymentsTotal();
        break;

      default:
        // memberships
        break;
    }
  }

  getMembershipData() {
    this.memberService.getProfileTabs(this.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.fullMemberInfo = res.data;
        if (this.fullMemberInfo.personalData.isPossibleMember) {
          this._MEMBER_PROFILE_TABS.find(t => t.id === MemberProfileTabs.MEMBERSHIP)!.isDisabled = true;
          this.selectedTab = 1;
          this.activeTabName = MemberProfileTabs.CALLS;
          this.getCalls();
        } else {
          this.selectedTab = 0;
          this.activeTabName = MemberProfileTabs.MEMBERSHIP;
          this._MEMBER_PROFILE_TABS.map(t => t.isDisabled = false);
        }
        this.init();

      }
    })
  }

  edit(selectedTab: string = '') {
    this.router.navigate(['/admin/form/member/edit'], {
      queryParams: { memberId: this.fullMemberInfo.personalData.id }
    })
  }

  openPossibleMemberForm() {
    let data = {} as dialogPossibleMemberData;
    data.type = 'editMember';
    data.memberData = this.fullMemberInfo.personalData;

    let dialogRef = this.dialog.open(PotentialMemberFormComponent, {
      maxHeight: '80vh',
      width: '500px',
      data: data,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status && result.status === 'success') {
        this.getMembershipData();
      }
    });

  }

  getCardAction(action: { actionType: string, member: Member }) {
    switch (action.actionType) {
      case 'addCall':
      case 'addNote':
        this.getMembershipData();
        break;
    }
  }

  openMedicalHistory() {
    const dialogRef = this.dialog.open(MemberMedicalHistoryComponent, {
      data: { memberId: this.fullMemberInfo.personalData.id },
      width: '500px',
      autoFocus: false
    })
  }
}
