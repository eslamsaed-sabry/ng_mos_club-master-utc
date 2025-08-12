import { HttpClient } from '@angular/common/http';
import {
  Injectable, inject
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  Observable
} from 'rxjs';
import {
  HttpResponseDTO, IAddVisit, IBenefitSession, IBranch, IMemberVisit, IUserNotification, UserNotificationFilters
} from '../models/common.model';
import { GymConfig, PageNames, ReceiptTypes } from '../models/enums';
import {
  CallMember,
  FullMemberInfo,
  Invitee,
  Member,
  Membership,
  Note,
  IPackage,
  Benefit,
  Attendance,
  FullMember,
  Session,
  Installment,
  Freeze,
  CancelMembership,
  TransferMembership,
  ChangeMoney,
  DebtsTableFilters,
  InvitationFilter,
  CallsFilters,
  PotentialMemberFilters,
  IPossibleMember,
  ISessionPrint,
  CheckedInMembersFilters,
  MembershipPayment,
  ChangeEmployee,
  AttendanceFilters,
  IMembershipReceipt,
  IMedicalHistory,
  IPTSession,
  IBulkPotentialMembersUploadForm,
  IMembershipChangeStartDate,
  MemberFilters,
  IWallet,
  DepositWithdrawIntoWallet,
  IPayments,
} from '../models/member.model';
import {
  APIService
} from './api.service';
import { MatDialog } from '@angular/material/dialog';
import { FreePrivateTrainingFilters, IFreePrivateTraining, ITasks, ITrainingNotes, TasksFilters } from '../models/extra.model';
import { DateType, StandardDatePipe } from '../pipes/standard-date.pipe';
import { ISchedule } from '../models/schedule.model';
import { ICallsFeedback } from '../models/management.model';
import { MembershipsReportFilter } from '../models/reports.model';

@Injectable({ providedIn: 'root' })
export class MemberService extends APIService {

  standardDate = inject(StandardDatePipe);

  constructor(private http: HttpClient, translate: TranslateService, private dialog: MatDialog) {
    super(translate);
  }

  uploadMemberPic(formData: FormData) {
    return this.http.post(
      this.api() + 'api/Utility/Upload?isProfilePicture=true',
      formData, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.upload', 'httpResponseMessages.elements.image')
    }
    );
  }

  getMemberData(id: number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<FullMemberInfo>>(this.api() + `api/Report/GetPersonDataById?Id=${id}`, {
      headers: this.makeHeaders()
    });
  }

  getMemberNotes(id: number): Observable<HttpResponseDTO<Note[]>> {
    return this.http.get<HttpResponseDTO<Note[]>>(this.api() + `api/Member/GetMemberNotes?memberId=${id}&includeDismissed=true`, {
      headers: this.makeHeaders()
    });
  }

  getMemberWallet(id: number): Observable<HttpResponseDTO<IWallet[]>> {
    return this.http.get<HttpResponseDTO<IWallet[]>>(this.api() + `api/Member/GetFinancialTransactions?memberId=${id}`, {
      headers: this.makeHeaders()
    });
  }

  GetMemberFinancialBalance(id: number): Observable<HttpResponseDTO<number>> {
    return this.http.get<HttpResponseDTO<number>>(this.api() + `api/Member/GetMemberFinancialBalance?memberId=${id}`, {
      headers: this.makeHeaders()
    });
  }

  getMemberPayments(id: number): Observable<HttpResponseDTO<IPayments[]>> {
    return this.http.get<HttpResponseDTO<IPayments[]>>(this.api() + `api/Member/GetMemberPayments?memberId=${id}`, {
      headers: this.makeHeaders()
    });
  }

  GetMemberPaymentsTotal(id: number): Observable<HttpResponseDTO<number>> {
    return this.http.get<HttpResponseDTO<number>>(this.api() + `api/Member/GetMemberPaymentsTotal?memberId=${id}`, {
      headers: this.makeHeaders()
    });
  }

  DepositIntoWallet(wallet: DepositWithdrawIntoWallet): Observable<HttpResponseDTO<DepositWithdrawIntoWallet>> {
    return this.http.post<HttpResponseDTO<DepositWithdrawIntoWallet>>(this.api() + 'api/Member/DepositIntoWallet', wallet, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.add', 'httpResponseMessages.elements.deposit')
    });
  }

  WithdrawFromWallet(wallet: DepositWithdrawIntoWallet): Observable<HttpResponseDTO<DepositWithdrawIntoWallet>> {
    return this.http.post<HttpResponseDTO<DepositWithdrawIntoWallet>>(this.api() + 'api/Member/WithdrawFromWallet', wallet, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.add', 'httpResponseMessages.elements.withdraw')
    });
  }

  getMembershipUpgrades(props: any): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<FullMemberInfo>>(this.api() + `api/Payment/GetMembershipUpgradeList?MembershipId=${props.membershipId}`, props, {
      headers: this.makeHeaders()
    });
  }

  getMembershipActions(props: any): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<IMembershipChangeStartDate>>(this.api() + `api/Membership/GetMembershipActions?membershipId=${props.membershipId}&actionType=${props.actionType}`, {
      headers: this.makeHeaders()
    });
  }

  getMembershipFreeze(membershipId: number, isMedical: boolean): Observable<any> {
    return this.http.get<HttpResponseDTO<Freeze>>(this.api() + `api/Membership/GetMembershipFreeze?MembershipId=${membershipId}&IsMedical=${isMedical}`, {
      headers: this.makeHeaders()
    });
  }

  deleteFreeze(freezeId: number): Observable<any> {
    return this.http.get<HttpResponseDTO<Freeze>>(this.api() + `api/Membership/RemoveFreeze?Id=${freezeId}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.delete', 'httpResponseMessages.elements.freeze')
    });
  }

  getFullMemberData(props: any): Observable<HttpResponseDTO<FullMember>> {

    return this.http.get<HttpResponseDTO<FullMember>>(
      this.api() + `api/report/GetMemberFullMembershipsDetails`, {
      headers: this.makeHeaders('false', props.showSpinner),
      params: {
        SearchKey: props.searchText,
        SearchMethod: props.searchMethod,
        IncludeSearchByPhone: props.includeSearchByPhone,
        AutoAddAttendance: props.autoAddAttendance,
        BranchId: props.branchId
      }
    }
    );
  }

  getLookup(lookupID: number, isActive: boolean = true): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/LookUp/GetLookUp?LookupId=${lookupID}&IsActive=${isActive}`, {
      headers: this.makeHeaders()
    });
  }

  findStaff(): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Staff/GetStaff`, {
      "jobSymbol": "SalesPerson"
    }, {
      headers: this.makeHeaders()
    });
  }

  getMembers(props: MemberFilters): Observable<HttpResponseDTO<Member[]>> {
    const params = { ...props };
    params.BirthDateFrom = props.BirthDateFrom ? this.standardDate.transform(props.BirthDateFrom, DateType.TO_UTC) : '';
    params.BirthDateTo = props.BirthDateTo ? this.standardDate.transform(props.BirthDateTo, DateType.TO_UTC) : '';
    params.LastTransferDateFrom = props.LastTransferDateFrom ? this.standardDate.transform(props.LastTransferDateFrom, DateType.TO_UTC) : '';
    params.LastTransferDateTo = props.LastTransferDateTo ? this.standardDate.transform(props.LastTransferDateTo, DateType.TO_UTC) : '';

    return this.http.post<HttpResponseDTO<Member[]>>(
      this.api() + 'api/Member/GetMembers',
      params, {
      headers: this.makeHeaders(props.showSuccessToastr, props.showSpinner)
    }
    );
  }

  getSuggestedMember(props: any): Observable<HttpResponseDTO<Member[]>> {
    return this.http.post<HttpResponseDTO<Member[]>>(
      this.api() + 'api/Member/GetMatchedMembersWhileAdding',
      props, {
      headers: this.makeHeaders(props.showSuccessToastr, props.showSpinner)
    }
    );
  }


  getPossibleMembers(props: PotentialMemberFilters): Observable<HttpResponseDTO<Member[]>> {
    return this.http.post<HttpResponseDTO<Member[]>>(
      this.api() + 'api/Member/GetPossibleMembers',
      props, {
      headers: this.makeHeaders()
    }
    );
  }

  editPotentialName(props: IPossibleMember): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(
      this.api() + `api/Member/EditPotentialName?PotentialId=${props.id}&Name=${props.nameEng}`, {
      headers: this.makeHeaders()
    }
    );
  }

  searchMembers(props: any): Observable<HttpResponseDTO<Member[]>> {
    let params = {
      SearchText: props.searchText,
      SkipCount: props.skipCount,
      TakeCount: props.takeCount
    }
    return this.http.post<HttpResponseDTO<Member[]>>(
      this.api() + `api/Member/GetMatchedMembers`, params, {
      headers: this.makeHeaders(props.showSuccessToastr, props.showSpinner)
    }
    );
  }

  getMemberships(props: any): Observable<HttpResponseDTO<Membership[]>> {
    return this.http.post<HttpResponseDTO<Membership[]>>(
      this.api() + 'api/Membership/GetMembership',
      props, {
      headers: this.makeHeaders(props.showToastr, props.showSpinner)
    }
    );
  }

  getPrivateMemberships(props: any): Observable<HttpResponseDTO<Membership[]>> {
    return this.http.post<HttpResponseDTO<Membership[]>>(
      this.api() + 'api/Membership/GetPrivateMemberships',
      props, {
      headers: this.makeHeaders(props.showToastr, props.showSpinner)
    }
    );
  }

  getMembershipById(id: number): Observable<HttpResponseDTO<Membership>> {
    return this.http.get<HttpResponseDTO<Membership>>(
      this.api() + `api/Membership/GetMembershipById?Id=${id}`, {
      headers: this.makeHeaders()
    }
    );
  }

  terminateMembership(id: number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(
      this.api() + `api/Membership/Terminate?MembershipId=${id}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.terminate', 'httpResponseMessages.elements.membership')
    }
    );
  }

  deleteMembership(id: number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(
      this.api() + `api/Membership/DeleteMembership?Id=${id}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.delete', 'httpResponseMessages.elements.membership')
    }
    );
  }

  getFormFields(pageDevName = 'MemberProfile') {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Utility/GetPageFields?pageDevName=${pageDevName}`, {
      headers: this.makeHeaders()
    });
  }

  addMember(member: Member | IPossibleMember): Observable<HttpResponseDTO<number>> {
    return this.http.post<HttpResponseDTO<number>>(this.api() + 'api/Member/AddMember', member, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.add', 'httpResponseMessages.elements.member')
    });
  }

  editMember(member: Member | IPossibleMember): Observable<number> {
    const props = { ...member };
    props.joiningDate = this.standardDate.transform(props.joiningDate, DateType.TO_UTC);
    return this.http.post<number>(this.api() + 'api/Member/EditMember', props, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.edit', 'httpResponseMessages.elements.member')
    });
  }

  editPotentialMember(member: Member | IPossibleMember): Observable<number> {
    const props = { ...member };
    props.joiningDate = this.standardDate.transform(props.joiningDate, DateType.TO_UTC);
    return this.http.post<number>(this.api() + 'api/Member/EditPotentialMember', props, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.edit', 'httpResponseMessages.elements.member')
    });
  }

  deleteMember(MemberId: number) {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Member/DeleteMember?Id=${MemberId}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.delete', 'httpResponseMessages.elements.member')
    });
  }

  deletePotentialMember(MemberId: number) {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Member/DeletePotentialMember?Id=${MemberId}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.delete', 'httpResponseMessages.elements.member')
    });
  }


  blockMember(MemberId: number, BlockReason: string) {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Member/BlockMember?MemberId=${MemberId}&BlockReason=${BlockReason}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.block', 'httpResponseMessages.elements.member')
    });
  }

  unblockMember(MemberId: number) {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Member/UnblockMember?MemberId=${MemberId}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.unblock', 'httpResponseMessages.elements.member')
    });
  }

  changeMemberPassword(MemberId: number, Password: string) {
    let props = {
      MemberId: MemberId,
      Password: Password
    }
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Member/ChangeMemberPassword`, props, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.change', 'httpResponseMessages.elements.password')
    });
  }

  addMembership(membership: Membership): Observable<any> {
    return this.http.post<any>(this.api() + 'api/Membership/AddMembership', membership, {
      headers: this.makeHeaders('false', 'true', 'httpResponseMessages.add', 'httpResponseMessages.elements.membership')
    });
  }

  AddMembershipWithMember(data: any): Observable<any> {
    return this.http.post<any>(this.api() + 'api/Membership/AddMembershipWithMemberData', data, {
      headers: this.makeHeaders('false', 'true', 'httpResponseMessages.add', 'httpResponseMessages.elements.membership')
    });
  }

  addCall(call: CallMember): Observable<HttpResponseDTO<CallMember>> {
    return this.http.post<HttpResponseDTO<CallMember>>(this.api() + 'api/Call/AddCall', call, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.add', 'httpResponseMessages.elements.call')
    });
  }

  editCall(call: CallMember): Observable<HttpResponseDTO<CallMember>> {
    return this.http.post<HttpResponseDTO<CallMember>>(this.api() + 'api/Call/EditCall', call, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.edit', 'httpResponseMessages.elements.call')
    });
  }

  deleteCall(callId: number) {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Call/DeleteCall?Id=${callId}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.delete', 'httpResponseMessages.elements.call')
    });
  }

  getCallFeedback(): Observable<HttpResponseDTO<ICallsFeedback[]>> {
    return this.http.get<HttpResponseDTO<ICallsFeedback[]>>(this.api() + `api/call/GetFeedback`, {
      headers: this.makeHeaders()
    })
  }

  getInvitations(props?: InvitationFilter, memberId?: number, inviteeId?: number): Observable<any> {
    if (memberId) {
      props = { memberId: memberId } as any
    }
    if (inviteeId) {
      props = { inviteeId: inviteeId } as any
    }
    return this.http.post<HttpResponseDTO<Invitee>>(this.api() + 'api/Invitation/GetInvitations', props, {
      headers: this.makeHeaders()
    });
  }

  addInvitation(invite: Invitee): Observable<HttpResponseDTO<Invitee>> {
    return this.http.post<HttpResponseDTO<Invitee>>(this.api() + 'api/Invitation/AddInvitation', invite, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.add', 'httpResponseMessages.elements.invitation')
    });
  }

  addNote(note: Note): Observable<HttpResponseDTO<Note>> {
    return this.http.post<HttpResponseDTO<Note>>(this.api() + 'api/Member/AddMemberNote', note, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.add', 'httpResponseMessages.elements.note')
    });
  }

  editNote(note: Note): Observable<HttpResponseDTO<Note>> {
    return this.http.post<HttpResponseDTO<Note>>(this.api() + 'api/Member/EditMemberNote', note, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.edit', 'httpResponseMessages.elements.note')
    });
  }

  deleteNote(noteID: number): Observable<HttpResponseDTO<Note>> {
    return this.http.get<HttpResponseDTO<Note>>(this.api() + `api/Member/DeleteMemberNote?NoteId=${noteID}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.delete', 'httpResponseMessages.elements.note')
    });
  }

  dismissNote(noteID: number): Observable<HttpResponseDTO<Note>> {
    return this.http.get<HttpResponseDTO<Note>>(this.api() + `api/Member/DismissMemberNote?NoteId=${noteID}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.dismiss', 'httpResponseMessages.elements.note')
    });
  }

  getPackages(PackageTypeId: any, branchId: any = null): Observable<HttpResponseDTO<IPackage>> {
    return this.http.get<HttpResponseDTO<IPackage>>(this.api() + `api/Period/GetPeriod`, {
      headers: this.makeHeaders(),
      params: {
        ActiveOnly: true,
        PackageTypeId: PackageTypeId ? PackageTypeId : null,
        branchId: branchId ? branchId : null,
        PackageCategory: 0,
        MembersPeriodsOnly: false,
        IncludeSystemPackages: false
      }
    });
  }

  getPackagesByTypeAndCategory(filter: MembershipsReportFilter, branchId: any = null): Observable<HttpResponseDTO<IPackage>> {
    return this.http.get<HttpResponseDTO<IPackage>>(this.api() + `api/Period/GetPeriod`, {
      headers: this.makeHeaders(),
      params: {
        ActiveOnly: true,
        PackageTypeId: filter.packageType,
        branchId: branchId ? branchId : null,
        PackageCategory: filter.packageCategory,
        MembersPeriodsOnly: false,
        IncludeSystemPackages: false
      }
    });
  }

  getAllBenefits(): Observable<HttpResponseDTO<Benefit[]>> {
    return this.http.get<HttpResponseDTO<Benefit[]>>(this.api() + `api/Period/GetAllBenfits?isIncluded=true`, {
      headers: this.makeHeaders()
    });
  }

  getPackageBenefits(PackageID: number, packageTypeId: number): Observable<HttpResponseDTO<Benefit[]>> {
    return this.http.get<HttpResponseDTO<Benefit[]>>(this.api() + `api/Period/GetPeriodBenfits`, {
      headers: this.makeHeaders(),
      params: {
        OfferId: 1,
        PeriodId: PackageID,
        PackageTypeId: packageTypeId
      }
    });
  }

  getMembershipReceiptData(membershipId: number): Observable<HttpResponseDTO<IMembershipReceipt>> {
    return this.http.get<HttpResponseDTO<IMembershipReceipt>>(this.api() + `api/Membership/GetMembershipReceiptData?MembershipId=${membershipId}`, {
      headers: this.makeHeaders()
    });
  }

  getMembershipAttendance(props?: AttendanceFilters, memberId?: number): Observable<any> {
    if (memberId) {
      props = { memberId: memberId } as any
    }
    return this.http.post<HttpResponseDTO<Attendance>>(this.api() + 'api/Attendance/GetAttendance', props, {
      headers: this.makeHeaders()
    });
  }

  getMembersAttendance(props: any): Observable<HttpResponseDTO<Attendance[]>> {
    return this.http.post<HttpResponseDTO<Attendance[]>>(this.api() + 'api/Attendance/GetAttendance', props, {
      headers: this.makeHeaders(props.showSuccessToastr, props.showSpinner)
    });
  }

  addAttendance(props: any): Observable<any> {
    return this.http.post<HttpResponseDTO<Attendance>>(this.api() + 'api/Attendance/AddAttendance', props, {
      headers: this.makeHeaders(props.showSuccessToastr, props.showSpinner, 'httpResponseMessages.add', 'httpResponseMessages.elements.attendance')
    });
  }

  getMyAttendance(MembershipId: number): Observable<any> {
    return this.http.get<HttpResponseDTO<Attendance>>(this.api() + `api/Attendance/GetMyAttendance?MembershipId=${MembershipId}`, {
      headers: this.makeHeaders()
    });
  }

  deleteAttendance(attendanceId: number): Observable<any> {
    return this.http.get<HttpResponseDTO<Attendance>>(this.api() + `api/Attendance/DeleteAttendance?Id=${attendanceId}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.delete', 'httpResponseMessages.elements.attendance')
    });
  }

  freezeOrUn(props: any, actionType = 'Freeze') {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Membership/${actionType}`, props, {
      headers: this.makeHeaders()
    });
  }

  getCalls(props?: CallsFilters, memberId?: number): Observable<HttpResponseDTO<CallMember>> {
    if (memberId) {
      props = { memberId: memberId } as any
    }
    return this.http.post<HttpResponseDTO<CallMember>>(this.api() + 'api/Call/GetCalls', props, {
      headers: this.makeHeaders()
    });
  }

  dismissCallReminder(id: number): Observable<any> {
    let arr = [id]
    return this.http.post<any>(this.api() + 'api/Call/DismissCallReminder', arr, {
      headers: this.makeHeaders()
    });
  }

  snoozeCallReminder(callId: number, minutesCount: number): Observable<any> {
    return this.http.get<any>(this.api() + `api/Call/SnoozeCall?callId=${callId}&minutesCount=${minutesCount}`, {
      headers: this.makeHeaders()
    });
  }

  getSessions(props: any): Observable<any> {
    return this.http.post<HttpResponseDTO<Session[]>>(this.api() + 'api/Session/GetSessions', props, {
      headers: this.makeHeaders()
    });
  }

  addSession(props: any): Observable<any> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + 'api/Session/AddSession', props, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.add', 'httpResponseMessages.elements.session')
    });
  }

  editSession(props: any): Observable<any> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + 'api/Session/EditSession', props, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.edit', 'httpResponseMessages.elements.session')
    });
  }

  deleteSessions(id: number): Observable<any> {
    return this.http.get<any>(this.api() + `api/Session/DeleteSession?Id=${id}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.delete', 'httpResponseMessages.elements.session')
    });
  }

  getSessionsTypes(): Observable<any> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Session/GetSessionTypes?activeOnly=true`, {
      headers: this.makeHeaders()
    });
  }

  getSession(id: number): Observable<any> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Session/GetSession?Id=${id}`, {
      headers: this.makeHeaders()
    });
  }

  getGymConfig(symbol: GymConfig): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Utility/GetRowConstantValue?Symbol=${symbol}`, {
      headers: this.makeHeaders('false')
    })
  }

  unlockGate(url: string) {
    return this.http.get<HttpResponseDTO<any>>(`${url}`)
  }

  getNextContractNo() {
    return this.http.get<any>(this.api() + `api/Member/GetNextContractNo`, {
      headers: this.makeHeaders()
    })
  }


  getInstallments(props: DebtsTableFilters): Observable<any> {
    return this.http.post<HttpResponseDTO<Installment[]>>(this.api() + 'api/Payment/GetInstallments', props, {
      headers: this.makeHeaders()
    });
  }

  editInstallment(props: any): Observable<any> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + 'api/Payment/EditInstallment', props, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.edit', 'httpResponseMessages.elements.installment')
    });
  }

  payoffInstallment(props: any): Observable<any> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + 'api/Payment/SettleInstallment', props, {
      headers: this.makeHeaders('true')
    });
  }

  deleteInstallment(installmentId: number) {
    return this.http.get<any>(this.api() + `api/Payment/DeleteInstallment?Id=${installmentId}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.delete', 'httpResponseMessages.elements.installment')
    })
  }

  revertPayment(installmentId: number) {
    return this.http.get<any>(this.api() + `api/Payment/DeleteInstallmentPayment?InstallmentId=${installmentId}`, {
      headers: this.makeHeaders('true')
    })
  }

  getBenefitSessions(membershipId: number, benefitId: number): Observable<HttpResponseDTO<IAddVisit[]>> {
    return this.http.get<HttpResponseDTO<IAddVisit[]>>(this.api() + `api/Membership/GetBenfitSessions?MembershipId=${membershipId}&BenefitId=${benefitId}`, {
      headers: this.makeHeaders()
    })
  }

  getMembershipBenefits(membershipId: number) {
    return this.http.get<any>(this.api() + `api/Membership/GetBenfitsSummary?MembershipId=${membershipId}`, {
      headers: this.makeHeaders()
    })
  }

  addBenefitSession(props: IBenefitSession): Observable<any> {
    return this.http.post<any>(this.api() + `api/Attendance/AddMonitoringAttendance`, props, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.add', 'httpResponseMessages.elements.benefit')
    })
  }

  editBenefitSession(props: any) {
    return this.http.post<any>(this.api() + `api/Attendance/EditMonitoringAttendance`, props, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.edit', 'httpResponseMessages.elements.benefit')
    })
  }

  deleteBenefitSession(id: number) {
    return this.http.get<any>(this.api() + `api/Attendance/DeleteMonitoringAttendance?Id=${id}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.delete', 'httpResponseMessages.elements.benefit')
    })
  }

  suspendMembership(membershipId: number) {
    return this.http.get<any>(this.api() + `api/Membership/SuspendMembership?MembershipId=${membershipId}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.suspend', 'httpResponseMessages.elements.membership')
    })
  }
  resumeMembership(membershipId: number) {
    return this.http.get<any>(this.api() + `api/Membership/ResumeMembership?MembershipId=${membershipId}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.resume', 'httpResponseMessages.elements.membership')
    })
  }

  changeMoney(props: ChangeMoney) {
    return this.http.get<any>(this.api() + `api/Membership/ChangeMoney`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.change', 'httpResponseMessages.elements.membership'),
      params: {
        MembershipId: props.membershipId,
        Price: props.price,
        CashAmountPaid: props.cashAmountPaid,
        VisaAmountPaid: props.visaAmountPaid,
        visaTypeId: props.visaTypeId
      }
    })
  }

  changeBulkSalesPersons(membersIds: number[], newSalesId: number, entityType: 'member' | 'potential') {
    const _body = {
      membersIds,
      newSalesId
    }
    const _url = entityType === 'member' ? 'api/Member/ChangeSelectedMembersSalesPerson' : 'api/Member/ChangeSelectedPotentialsSalesPerson';
    return this.http.post<any>(this.api() + `${_url}`, _body, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.change', 'httpResponseMessages.elements.salesPerson')
    })
  }

  changeSalesPerson(props: ChangeEmployee) {
    return this.http.get<any>(this.api() + `api/Membership/EditSalesPerson`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.change', 'httpResponseMessages.elements.salesPerson'),
      params: {
        MembershipId: props.membershipId,
        salesPersonId: props.salesPersonId,
      }
    })
  }

  changeTrainer(props: ChangeEmployee) {
    return this.http.get<any>(this.api() + `api/Membership/EditTrainer`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.change', 'httpResponseMessages.elements.membership'),
      params: {
        MembershipId: props.membershipId,
        TrainerId: props.trainerId,
      }
    })
  }

  removeTrainer(props: any) {
    return this.http.get<any>(this.api() + `api/Membership/EditTrainer`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.delete', 'httpResponseMessages.elements.trainer'),
      params: {
        MembershipId: props.membershipId,
        TrainerId: props.trainerId,
      }
    })
  }

  cancelMembership(props: any): Observable<HttpResponseDTO<CancelMembership>> {
    const _props = { ...props };
    _props.refundDate = this.standardDate.transform(_props.refundDate, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Membership/CancelMembership`, _props, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.cancel', 'httpResponseMessages.elements.membership')
    })
  }

  transferMembership(props: any): Observable<HttpResponseDTO<TransferMembership>> {
    const _props = { ...props };
    _props.paymentDate = this.standardDate.transform(_props.paymentDate, DateType.TO_UTC);
    _props.startDate = this.standardDate.transform(_props.startDate, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Membership/TransferMembership`, _props, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.transfer', 'httpResponseMessages.elements.membership')
    })
  }

  upgradeMembership(props: any) {
    return this.http.post<any>(this.api() + `api/Membership/Upgrade`, props, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.upgrade', 'httpResponseMessages.elements.membership')
    })
  }

  changeStartDate(props: any) {
    return this.http.post<any>(this.api() + `api/Membership/ChangeStartDate`, props, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.changeStartDate', 'httpResponseMessages.elements.membership')
    })
  }
  downgradeMembership(props: any) {
    return this.http.post<any>(this.api() + `api/Membership/Downgrade`, props, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.downgrade', 'httpResponseMessages.elements.membership')
    })
  }

  getGymRules(): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Utility/GetGymRules?RuleType=1`, {
      headers: this.makeHeaders('false')
    })
  }

  invitationTypeAhead(SearchKey: any): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Member/GetInvitee?SearchKey=${SearchKey}`, {
      headers: this.makeHeaders()
    })
  }

  removeInvitation(id: number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Invitation/DeleteInvitation?Id=${id}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.delete', 'httpResponseMessages.elements.invitation')
    })
  }

  exportMemberships(props: any): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(
      this.api() + 'api/Membership/ExportMemberships',
      props, {
      headers: this.makeHeaders(props.showToastr, props.showSpinner)
    }
    );
  }

  exportCalls(props: any): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(
      this.api() + 'api/Call/ExportCalls',
      props, {
      headers: this.makeHeaders(props.showToastr, props.showSpinner)
    }
    );
  }

  exportMembers(props: any): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(
      this.api() + 'api/Member/ExportMembers',
      props, {
      headers: this.makeHeaders(props.showToastr, props.showSpinner)
    }
    );
  }

  exportInvitations(props: any): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(
      this.api() + 'api/Invitation/ExportInvitations',
      props, {
      headers: this.makeHeaders(props.showToastr, props.showSpinner)
    }
    );
  }

  exportSessions(props: any): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(
      this.api() + 'api/Session/ExportSessions',
      props, {
      headers: this.makeHeaders(props.showToastr, props.showSpinner)
    }
    );
  }

  exportMemberAttendance(props: any): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(
      this.api() + 'api/Attendance/ExportAttendance',
      props, {
      headers: this.makeHeaders(props.showToastr, props.showSpinner)
    }
    );
  }

  calcExpDate(props: any): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(
      this.api() + 'api/Membership/CalculateExpirationDate',
      props, {
      headers: this.makeHeaders()
    }
    );
  }

  getRequiredFields(pageName: PageNames): Observable<any> {
    return this.http.get<any>(
      this.api() + `api/Utility/GetPageFields?PageDevName=${pageName}&IsMandatory=true`, {
      headers: this.makeHeaders('false', 'false')
    }
    );
  }

  getRates(id: number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(
      this.api() + `api/Class/GetRates?Id=${id}`, { headers: this.makeHeaders('false', 'false') }
    );
  }

  getMemberNotification(params: any): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(
      this.api() + `api/Notification/GetMemberNotification`, params, {
      headers: this.makeHeaders()
    });
  }

  getMemberReferral(params: any): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(
      this.api() + `api/Member/GetReferrals`, params, {
      headers: this.makeHeaders()
    });
  }

  getUserNotifications(params: UserNotificationFilters): Observable<HttpResponseDTO<IUserNotification>> {
    return this.http.post<HttpResponseDTO<IUserNotification>>(
      this.api() + `api/User/GetUserNotifications`, params, {
      headers: this.makeHeaders('false', 'false')
    });
  }

  getUnseenNotifications(userId: number) {
    return this.http.get<HttpResponseDTO<any>>(
      this.api() + `api/User/GetUnSeenUserNotificationsCount?UserId=${userId}`, { headers: this.makeHeaders('false', 'false') }
    );
  }

  markNotificationSeen(userId: number) {
    return this.http.get<HttpResponseDTO<any>>(
      this.api() + `api/User/MarkNotificationsAsSeen?UserId=${userId}`, { headers: this.makeHeaders('false', 'false') }
    );
  }

  preparePrintContainer(receiptType: ReceiptTypes) {
    if (receiptType === ReceiptTypes.SM_AR || receiptType === ReceiptTypes.W_F_AR) {
      document.body.classList.add('rtl');
    }
    // if (receiptType === ReceiptTypes.SM_AR || receiptType === ReceiptTypes.SM_EN) {
    //   document.body.classList.add('fs-xxl');
    // }
    document.body.classList.add('receipt-print-wrapper');
    let clonedDiv = document.querySelector('.print-wrapper')!.cloneNode(true);
    document.body.appendChild(clonedDiv);
    setTimeout(() => {
      window.print();
      this.removePrintArea();
      this.dialog.closeAll();
    }, 1000);
  }

  removePrintArea() {
    document.querySelector('.print-wrapper')!.remove();
    document.body.classList.remove('receipt-print-wrapper');
    document.body.classList.remove('rtl');
    document.body.classList.remove('fs-xxl');
  }

  getPrintableSessions(membershipID: number) {
    return this.http.get<HttpResponseDTO<ISessionPrint>>(
      this.api() + `api/Report/GetMembershipAndAttendance?MembershipId=${membershipID}`, { headers: this.makeHeaders() }
    );
  }

  getCheckedInMembers(params: CheckedInMembersFilters): Observable<HttpResponseDTO<Member[]>> {
    return this.http.post<HttpResponseDTO<Member[]>>(
      this.api() + `api/Attendance/GetNotCheckedOutAttendance`, params, {
      headers: this.makeHeaders()
    });
  }

  checkOutAllMembers() {
    return this.http.get<HttpResponseDTO<any>>(
      this.api() + `api/Attendance/CheckOutAllAttendance`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.checkout', 'httpResponseMessages.elements.attendance')
    }
    );
  }

  checkOutMember(id: number) {
    return this.http.get<HttpResponseDTO<any>>(
      this.api() + `api/Attendance/CheckOutAttendance?Id=${id}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.checkout', 'httpResponseMessages.elements.attendance')
    }
    );
  }

  getMembershipPayments(membershipId: number): Observable<HttpResponseDTO<MembershipPayment[]>> {
    return this.http.get<HttpResponseDTO<MembershipPayment[]>>(
      this.api() + `api/Membership/GetMembershipPayments?membershipId=${membershipId}`, {
      headers: this.makeHeaders()
    }
    );
  }

  getTasks(filters: TasksFilters): Observable<HttpResponseDTO<ITasks[]>> {
    return this.http.post<HttpResponseDTO<ITasks[]>>(this.api() + `api/Tasks/GetTasks`, filters, {
      headers: this.makeHeaders()
    });
  }

  addTask(task: ITasks): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Tasks/AddTask`, task, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.add', 'httpResponseMessages.elements.task')
    });
  }

  deleteTask(taskID: number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Tasks/DeleteTask?Id=${taskID}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.delete', 'httpResponseMessages.elements.task')
    });
  }

  AccomplishTask(taskID: number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Tasks/AccomplishTask?Id=${taskID}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.accomplish', 'httpResponseMessages.elements.task')
    });
  }

  UnaccomplishTask(taskID: number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Tasks/UnaccomplishTask?Id=${taskID}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.unAccomplish', 'httpResponseMessages.elements.task')
    });
  }

  getIsSalesPersonActive(membershipId: number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Membership/IsSalesPersonActive?membershipId=${membershipId}`, {
      headers: this.makeHeaders('false')
    })
  }

  membershipUpgradeChangePaymentDate(props: any): Observable<HttpResponseDTO<any>> {
    const _props = { ...props };
    _props.paymentDate = this.standardDate.transform(_props.paymentDate, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Membership/MembershipUpgradeChangePaymentDate`, _props, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.change', 'httpResponseMessages.elements.upgradePaymentDate')
    })
  }

  getProfileTabs(id: number): Observable<HttpResponseDTO<any[]>> {
    return this.http.get<HttpResponseDTO<any[]>>(this.api() + `api/Report/GetPersonDataCounts?Id=${id}`, {
      headers: this.makeHeaders('false')
    })
  }

  getMemberClasses(memberId: number): Observable<HttpResponseDTO<ISchedule[]>> {
    return this.http.get<HttpResponseDTO<ISchedule[]>>(this.api() + `api/Class/GetBookedClasses?MemberId=${memberId}`, {
      headers: this.makeHeaders()
    })
  }

  getAllowedBranchesIds(membershipId: number): Observable<HttpResponseDTO<any[]>> {
    return this.http.get<HttpResponseDTO<ISchedule[]>>(this.api() + `api/Membership/GetAllowedBranchesIds?MembershipId=${membershipId}`, {
      headers: this.makeHeaders()
    })
  }

  changeMembershipAllowedBranches(props: any): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Membership/ChangeMembershipAllowedBranches`, props, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.change', 'httpResponseMessages.elements.membershipBranches')
    })
  }


  getFreePrivateTraining(filters: FreePrivateTrainingFilters): Observable<HttpResponseDTO<IFreePrivateTraining[]>> {
    return this.http.post<HttpResponseDTO<IFreePrivateTraining[]>>(this.api() + `api/Membership/GetFreePrivateTraining`, filters, {
      headers: this.makeHeaders()
    });
  }

  hideFreePrivateTraining(membershipId: number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Membership/HideMembershipFromFreePT?MembershipId=${membershipId}`, {
      headers: this.makeHeaders()
    })
  }

  unHideFreePrivateTraining(membershipId: number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Membership/UnHideMembershipFromFreePT?MembershipId=${membershipId}`, {
      headers: this.makeHeaders()
    })
  }

  markAsReferralFreePrivateTraining(membershipId: number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Membership/MarkFreePTAsReferral?MembershipId=${membershipId}`, {
      headers: this.makeHeaders()
    })
  }

  unMarkAsReferralFreePrivateTraining(membershipId: number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Membership/UnMarkFreePTAsReferral?MembershipId=${membershipId}`, {
      headers: this.makeHeaders()
    })
  }

  updateTrainerCommentFreePrivateTraining(membershipId: number, trainerComment: string): Observable<HttpResponseDTO<any>> {
    let obj = {
      membershipId: membershipId,
      comment: trainerComment
    }
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Membership/UpdateTrainerComment`, obj, {
      headers: this.makeHeaders()
    })
  }

  getMembersRelatedToBatch(batchId: number, pageNumber: number, pageSize: number): Observable<HttpResponseDTO<Member[]>> {
    return this.http.get<HttpResponseDTO<Member[]>>(this.api() + `api/Member/GetMembersRelatedToBatch`, {
      headers: this.makeHeaders(),
      params: {
        BatchId: batchId,
        SkipCount: pageNumber,
        TakeCount: pageSize
      }
    });
  }

  getMembersTrainingNotes(filters: ITrainingNotes): Observable<HttpResponseDTO<Note[]>> {
    return this.http.get<HttpResponseDTO<Note[]>>(this.api() + `api/Member/GetMembersTrainingNotes`, {
      headers: this.makeHeaders(),
      params: {
        memberId: filters.memberId ?? '',
        includeDismissed: true,
        skipCount: filters.skipCount,
        takeCount: filters.takeCount
      }
    });
  }

  getMembersMedicalHistory(memberId: number): Observable<HttpResponseDTO<IMedicalHistory>> {
    return this.http.get<HttpResponseDTO<IMedicalHistory>>(this.api() + `api/Member/GetMemberMedicalHistory`, {
      headers: this.makeHeaders(),
      params: {
        memberId: memberId
      }
    });
  }

  updateMedicalHistory(data: IMedicalHistory): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Member/UpdateMemberMedicalHistory`, data, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.update', 'httpResponseMessages.elements.medicalHistory')
    });
  }

  getMyConsumedPTSessionsReport(memberId: number): Observable<HttpResponseDTO<IPTSession[]>> {
    return this.http.post<HttpResponseDTO<IPTSession[]>>(this.api() + `api/Attendance/GetConsumedPTSessions`, { memberId }, {
      headers: this.makeHeaders()
    });
  }

  uploadPotentialMembers(form: IBulkPotentialMembersUploadForm): Observable<HttpResponseDTO<IPTSession[]>> {
    const _formDate = new FormData();
    _formDate.append('Files', form.file!);
    return this.http.post<HttpResponseDTO<IPTSession[]>>(this.api() + `api/Member/UploadPotentials`, _formDate, {
      params: {
        PhoneFormatId: form.phoneFormatId,
        SourceId: form.sourceOfKnowledgeId,
        SalesPersonId: form.salesPersonId,
        Gender: form.gender
      },
      headers: this.makeHeaders('false', 'true')
    });
  }

  accomplishTask(id: number): Observable<any> {
    return this.http.get<HttpResponseDTO<Freeze>>(this.api() + `api/Tasks/AccomplishTask?Id=${id}`, {
      headers: this.makeHeaders()
    });
  }

  markAsHighPotential(memberId: number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(
      this.api() + `api/Member/MarkAsHighPotential?MemberId=${memberId}`, {
      headers: this.makeHeaders()
    });
  }

  unMarkAsHighPotential(memberId: number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(
      this.api() + `api/Member/UnMarkAsHighPotential?MemberId=${memberId}`, {
      headers: this.makeHeaders()
    });
  }

  confirmInvitation(id: number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(
      this.api() + `api/Invitation/ConfirmInvitation?Id=${id}`, {
      headers: this.makeHeaders()
    });
  }

  getMemberBranch(phone: string, branchId: number): Observable<HttpResponseDTO<IMemberVisit>> {
    return this.http.get<HttpResponseDTO<IMemberVisit>>(
      this.api() + `api/Report/GetMemberOfAnotherBranch?PhoneNumber=${phone}&BranchId=${branchId}`, {
      headers: this.makeHeaders()
    });
  }
}
