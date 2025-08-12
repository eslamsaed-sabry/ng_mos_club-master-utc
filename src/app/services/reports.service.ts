import {
  ConsumedPTSessionsPerMembershipReport, ConsumedPTSessionsPerMembershipReportFilter, ConsumedPTSessionsPerTrainerReport,
  ConsumedPTSessionsPerTrainerReportFilter, ConsumedPTSessionsReportFilter, EmployeeFinancialReport, EmployeeFinancialReportFilter,
  ExpensesReportFilter, InstructorDueAmountReport, MembershipUpgradeReport, MembershipUpgradeReportFilter, MembershipsIncomeFilters,
  PackageUtilizationPerSalesPersonalReportFilter, PrivateMembershipsIncomeFilters, TrainerClosingRatioDetailsReport,
  TrainerClosingRatioDetailsReportFilter, TrainerClosingRatioReport, TrainerClosingRatioReportFilter, MultipleAttendancePerDayReport,
  MultipleAttendancePerDayReportFilter, FixedTrainerCommissionReportFilter, TrainerMemberRetentionReport, SalesPersonClosingRatioReportFilter,
  SalesPersonClosingRatioReport, SalesPersonClosingRatioDetailsReportFilter, SalesPersonClosingRatioDetailsReport,
  MembershipsIncomePerPackageTypeReportFilters, FreePrivateTrainingReport, InstructorDueAmountGrouped, IInstructorDueAmountGrouped,
  IInstructorDueAmountGroupedByClasses, IChangeClassRate, MedicalMembershipsIncomeFilters, InstructorDueAmountClassesReportFilters,
  ProfitSummaryReportFilter,
  ProfitSummaryReport,
  SinglePackageUtilReport,
  IPackageUtilizationReport,
  OtherEntitiesBookings
} from 'src/app/models/reports.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APIService } from './api.service';
import { Observable } from 'rxjs';
import {
  AbsentMembersReport, BenefitsConsumptionReport, BenefitsConsumptionReportFilter, BirthdaysReport, BlockedMembersFilters,
  BlockedMembersReport, CallsSummaryReport, CancelledClassesReport, ClassesBookingListReport,
  ClassesPerInstructorAndTypeReport, ClassesReportFilters, ClassesTypesReport, DayByDayProfitReport,
  DeletedReceiptsReport, DeletedReceiptsReportFilter,
  EmployeePayrollReportFilter,
  FreeConsumedBenefitsReport,
  FreeConsumedBenefitsReportFilter,
  GymAttendanceCountReport,
  HeldClassesReport, InvitationCountReport, InvitationCountReportFilter, LogsReport, MaximumExpirationDateReport,
  MaximumExpirationDateReportFilter, MemberAttendanceFilters, MemberAttendanceReport, MemberReservationsOnClassesReport,
  MembersFilters, MembersReport, MembershipTransferReport, MembershipTransferReportFilter, MembershipsDiscountReportFilter,
  MembershipsLogReportFilter, NewNotRenewedMembershipsReportFilter, NotActiveMembersReport,
  OverAttendanceReport, PackageCommissionReport, PackagesUtilReport, ProfitFilters, ProfitReport, SalesCommissionReport,
  TopActiveMembersReport, TopActiveMembersReportFilter, TrainerCommissionReport, TrainersAchievementReport, lostItemsReport, lostItemsReportFilter
} from '../models/reports.model';

import { HttpResponseDTO } from '../models/common.model';
import { TranslateService } from '@ngx-translate/core';
import { DateType, StandardDatePipe } from '../pipes/standard-date.pipe';
import { IExpenses } from '../models/accounts.model';
import { Membership } from '../models/member.model';
import { FreePrivateTrainingFilters } from '../models/extra.model';
@Injectable()
export class ReportsService extends APIService {

  constructor(private http: HttpClient, translate: TranslateService, private utcDate: StandardDatePipe) {
    super(translate);
  }

  printReportTable(name: string,) {
    let printContents = document.getElementById('printableTable')?.innerHTML;
    let newWindow = window.open('', '', 'width=1000,height=700');
    let styles = `
      body{font-family: Roboto}
      h1,h2,h3,h4,h5,h6{margin:0;padding:0}
      .actions,button{display:none}
      thead{background: #3b82f6;color: #FFF;}
      td:even{background:#f0f0f0}
      tr{text-align:center}
      tfoot tr{background: #d6d6d6}
      ul, li{list-style:none; margin:0; padding:0}
      ul {display:flex; gap:20px}
      p{margin:0;padding:0}
      a{color:#000; text-decoration:none}
    `

    newWindow?.document.write(`<html><head><title>${name}</title><style>${styles}</style></head><body>`);
    newWindow?.document.write(printContents || '');
    newWindow?.document.write('</body></html>');
    newWindow?.print();
    newWindow?.document.close();

  }

  getUsers(): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/User/GetUsers?IsActive=true`, {
      headers: this.makeHeaders()
    });
  }

  generateProfitReport(props: ProfitFilters): Observable<HttpResponseDTO<ProfitReport>> {
    props = { ...props };
    props.toDate = this.utcDate.transform(props.toDate, DateType.TO_UTC);
    props.fromDate = this.utcDate.transform(props.fromDate, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<ProfitReport>>(this.api() + `api/Report/GetProfitReport?FinalApprovedOnly=${props.finalApprovedOnly}`, props, {
      headers: this.makeHeaders()
    });
  }

  generateProfitReceiptsSummaryReport(props: ProfitFilters): Observable<HttpResponseDTO<ProfitReport>> {
    props = { ...props };
    props.toDate = this.utcDate.transform(props.toDate, DateType.TO_UTC);
    props.fromDate = this.utcDate.transform(props.fromDate, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<ProfitReport>>(this.api() + `api/Report/GetProfitReceiptsSummary?FinalApprovedOnly=${props.finalApprovedOnly}`, props, {
      headers: this.makeHeaders()
    });
  }

  generateMembershipsIncomeReport(props: MembershipsIncomeFilters): Observable<HttpResponseDTO<ProfitReport>> {
    props = { ...props };
    props.toDate = this.utcDate.transform(props.toDate, DateType.TO_UTC);
    props.fromDate = this.utcDate.transform(props.fromDate, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<ProfitReport>>(this.api() + `api/Report/GetGymMembershipsIncome?FinalApprovedOnly=${props.finalApprovedOnly}`, props, {
      headers: this.makeHeaders()
    });
  }

  generatePrivateMembershipsIncomeReport(props: PrivateMembershipsIncomeFilters): Observable<HttpResponseDTO<ProfitReport>> {
    props = { ...props };
    props.toDate = this.utcDate.transform(props.toDate, DateType.TO_UTC);
    props.fromDate = this.utcDate.transform(props.fromDate, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<ProfitReport>>(this.api() + `api/Report/GetPrivateMembershipsIncome?FinalApprovedOnly=${props.finalApprovedOnly}`, props, {
      headers: this.makeHeaders()
    });
  }

  getMedicalMembershipsIncomeReport(props: MedicalMembershipsIncomeFilters): Observable<HttpResponseDTO<ProfitReport>> {
    props = { ...props };
    props.toDate = this.utcDate.transform(props.toDate, DateType.TO_UTC);
    props.fromDate = this.utcDate.transform(props.fromDate, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<ProfitReport>>(this.api() + `api/Report/GetMedicalMembershipsIncome?FinalApprovedOnly=${props.finalApprovedOnly}`, props, {
      headers: this.makeHeaders()
    });
  }

  generateNotRenewedMembershipsReport(props: NewNotRenewedMembershipsReportFilter): Observable<HttpResponseDTO<any>> {
    props = { ...props };
    props.toDate = this.utcDate.transform(props.toDate, DateType.TO_UTC);
    props.fromDate = this.utcDate.transform(props.fromDate, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Membership/GetRecentUnrenewedMemberships`, props, {
      headers: this.makeHeaders()
    });
  }

  generateNewRenewedMembershipsReport(props: NewNotRenewedMembershipsReportFilter): Observable<HttpResponseDTO<any>> {
    props = { ...props };
    props.toDate = this.utcDate.transform(props.toDate, DateType.TO_UTC);
    props.fromDate = this.utcDate.transform(props.fromDate, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Report/GetNewRenewMemberships`, props, {
      headers: this.makeHeaders()
    });
  }

  generateMembershipsLogReport(props: MembershipsLogReportFilter): Observable<HttpResponseDTO<any>> {
    props = { ...props };
    props.toDate = this.utcDate.transform(props.toDate, DateType.TO_UTC);
    props.fromDate = this.utcDate.transform(props.fromDate, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Membership/GetMembershipLogs`, props, {
      headers: this.makeHeaders()
    });
  }

  generatePackagesUntilReport(props: PackagesUtilReport): Observable<HttpResponseDTO<IPackageUtilizationReport[]>> {
    props = { ...props };
    props.toDate = this.utcDate.transform(props.toDate, DateType.TO_UTC);
    props.fromDate = this.utcDate.transform(props.fromDate, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<IPackageUtilizationReport[]>>(this.api() + `api/Accountant/GetPackagesUtilizationReport?IsMonitoringMemberships=${props.isMonitoring}`, props, {
      headers: this.makeHeaders()
    });
  }
  generateSinglePackageUntilReport(props: SinglePackageUtilReport): Observable<HttpResponseDTO<any>> {
    const _props = { ...props };
    _props.toDate = this.utcDate.transform(props.toDate, DateType.TO_UTC);
    _props.fromDate = this.utcDate.transform(props.fromDate, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Accountant/GetPackagesUtilizationDetails?Gender=${_props.gender}&PackageCategory=${_props.packageCategory}&PackageId=${_props.packageId}`, _props, {
      headers: this.makeHeaders()
    });
  }

  generateDayByDayProfitReport(props: DayByDayProfitReport): Observable<HttpResponseDTO<any>> {
    props = { ...props };
    props.toDate = this.utcDate.transform(props.toDate, DateType.TO_UTC);
    props.fromDate = this.utcDate.transform(props.fromDate, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Report/GetDailyProfitReport?FinalApprovedOnly=${props.finalApprovedOnly}`, props, {
      headers: this.makeHeaders()
    });
  }
  generateEndOfDayTnxsProfitReport(props: DayByDayProfitReport): Observable<HttpResponseDTO<any>> {
    props = { ...props };
    props.toDate = this.utcDate.transform(props.toDate, DateType.TO_UTC);
    props.fromDate = this.utcDate.transform(props.fromDate, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Report/GetEndOfDayTransactionProfit?FinalApprovedOnly=${props.finalApprovedOnly}`, props, {
      headers: this.makeHeaders()
    });
  }

  generateBirthdaysReport(props: BirthdaysReport): Observable<HttpResponseDTO<any>> {
    props = { ...props };
    props.birthDateFrom = this.utcDate.transform(props.birthDateFrom, DateType.TO_UTC);
    props.birthDateTo = this.utcDate.transform(props.birthDateTo, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Report/GetBirthDays`, props, {
      headers: this.makeHeaders()
    });
  }

  generateCallsSummaryReport(props: CallsSummaryReport): Observable<HttpResponseDTO<any>> {
    props = { ...props };
    props.fromDate = this.utcDate.transform(props.fromDate, DateType.TO_UTC);
    props.toDate = this.utcDate.transform(props.toDate, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Call/GetCallsSummaryReport`, props, {
      headers: this.makeHeaders()
    });
  }

  generateLogsReport(props: LogsReport): Observable<HttpResponseDTO<any>> {
    props = { ...props };
    props.fromDate = this.utcDate.transform(props.fromDate, DateType.TO_UTC);
    props.toDate = this.utcDate.transform(props.toDate, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Report/GetLogsReport`, props, {
      headers: this.makeHeaders()
    });
  }

  generateAbsentMembersReport(props: AbsentMembersReport): Observable<HttpResponseDTO<any>> {
    props = { ...props };
    props.date = this.utcDate.transform(props.date, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Report/GetAbsentMembersReport`, props, {
      headers: this.makeHeaders()
    });
  }

  generateNotActiveMembersReport(props: NotActiveMembersReport): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Member/GetNotActiveMembers?rowsCount=${props.rowsCount}&LeastNoDays=${props.leastNoDays}&MaxNoDays=${props.maxNoDays}&&salesPersonId=${props.salesPersonId}`, {
      headers: this.makeHeaders()
    });
  }

  generateExpiredAttendReport(props: OverAttendanceReport): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Attendance/GetExpireAttendanceCount`, props, {
      headers: this.makeHeaders()
    });
  }
  generateNotPaidAttendReport(props: OverAttendanceReport): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Attendance/GetNotPaidAttendanceCount`, props, {
      headers: this.makeHeaders()
    });
  }

  generateSalesCommissionReport(props: SalesCommissionReport): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Report/GetSalesReport`, props, {
      headers: this.makeHeaders()
    });
  }

  generateTrainersAchievementReport(props: TrainersAchievementReport): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Report/GetTrainersAchievementReport`, props, {
      headers: this.makeHeaders()
    });
  }

  generateTrainerCommissionReport(type: string, props: TrainerCommissionReport): Observable<HttpResponseDTO<any>> {
    if (type === 'session') {
      return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Report/GetTrainerReport?Month=${props.month}&Year=${props.year}&CoachId=${props.coachId}&Status=${props.status}`, {
        headers: this.makeHeaders()
      });
    } else {
      return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Report/GetTrainerCommissionReportV3?Month=${props.month}&Year=${props.year}&CoachId=${props.coachId}&Status=${props.status}`, {
        headers: this.makeHeaders()
      });
    }
  }

  generatePackageCommissionReport(props: PackageCommissionReport): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Report/GetPackageCommissionReport`, props, {
      headers: this.makeHeaders()
    });
  }

  generateTrainerMemberRetentionReport(props: TrainerMemberRetentionReport): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Report/GetTrainerMemberRetentionDetails`, props, {
      headers: this.makeHeaders()
    });
  }

  getDeletedReceipts(props: DeletedReceiptsReportFilter): Observable<HttpResponseDTO<DeletedReceiptsReport>> {
    props = { ...props };
    props.paymentFromDate = this.utcDate.transform(props.paymentFromDate, DateType.TO_UTC);
    props.paymentToDate = this.utcDate.transform(props.paymentToDate, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<DeletedReceiptsReport>>(this.api() + `api/Utility/GetReceipts`, props, {
      headers: this.makeHeaders()
    });
  }

  getClassesTypes(props: ClassesReportFilters): Observable<HttpResponseDTO<ClassesTypesReport>> {
    props = { ...props };
    props.toDate = this.utcDate.transform(props.toDate, DateType.TO_UTC);
    props.fromDate = this.utcDate.transform(props.fromDate, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<ClassesTypesReport>>(this.api() + `api/Report/GetClassesTypesReport`, props, {
      headers: this.makeHeaders()
    });
  }

  getHeldClasses(props: ClassesReportFilters): Observable<HttpResponseDTO<HeldClassesReport>> {
    props = { ...props };
    props.toDate = this.utcDate.transform(props.toDate, DateType.TO_UTC);
    props.fromDate = this.utcDate.transform(props.fromDate, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<HeldClassesReport>>(this.api() + `api/Report/GetHeldClassesReport?instructorId=${props.instructorId}&BranchId=${props.branchId}`, props, {
      headers: this.makeHeaders()
    });
  }

  getInstructorDueAmountBasedOnAmount(props: InstructorDueAmountClassesReportFilters): Observable<HttpResponseDTO<InstructorDueAmountReport>> {
    props = { ...props };
    props.toDate = this.utcDate.transform(props.toDate, DateType.TO_UTC);
    props.fromDate = this.utcDate.transform(props.fromDate, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<InstructorDueAmountReport>>(this.api() + `api/Report/GetInstructorDueAmountDetails?classId=${props.classId}`, props, {
      headers: this.makeHeaders()
    });
  }

  getOtherEntitiesBookings(props: OtherEntitiesBookings): Observable<HttpResponseDTO<InstructorDueAmountReport>> {
    const _props = { ...props };
    _props.toDate = this.utcDate.transform(props.toDate, DateType.TO_UTC);
    _props.fromDate = this.utcDate.transform(props.fromDate, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<InstructorDueAmountReport>>(this.api() + `api/Report/GetOtherEntitiesBookingsDetails?instructorId=${_props.instructorId}`, _props, {
      headers: this.makeHeaders()
    });
  }

  // getInstructorDueAmountBasedOnPercentage(props: ClassesReportFilters): Observable<HttpResponseDTO<InstructorDueAmountReport>> {
  //   props = { ...props };
  //   props.toDate = this.utcDate.transform(props.toDate, DateType.TO_UTC);
  //   props.fromDate = this.utcDate.transform(props.fromDate, DateType.TO_UTC);
  //   return this.http.post<HttpResponseDTO<InstructorDueAmountReport>>(this.api() + `api/Report/GetInstructorDueAmountBasedOnPercentage?instructorId=${props.instructorId}`, props, {
  //     headers: this.makeHeaders()
  //   });
  // }

  getClassesPerInstructorAndTypeReport(props: ClassesReportFilters): Observable<HttpResponseDTO<ClassesPerInstructorAndTypeReport>> {
    props = { ...props };
    props.toDate = this.utcDate.transform(props.toDate, DateType.TO_UTC);
    props.fromDate = this.utcDate.transform(props.fromDate, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<ClassesPerInstructorAndTypeReport>>(this.api() + `api/Report/ClassesPerInstructorAndTypeReport?instructorId=${props.instructorId}`, props, {
      headers: this.makeHeaders()
    });
  }

  getClassesBookingListReport(props: ClassesReportFilters): Observable<HttpResponseDTO<ClassesBookingListReport>> {
    props = { ...props };
    props.toDate = this.utcDate.transform(props.toDate, DateType.TO_UTC);
    props.fromDate = this.utcDate.transform(props.fromDate, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<ClassesBookingListReport>>(this.api() + `api/Report/GetClassesBookingListReport`, props, {
      headers: this.makeHeaders()
    });
  }

  getCanceledClassesReport(props: ClassesReportFilters): Observable<HttpResponseDTO<CancelledClassesReport>> {
    props = { ...props };
    props.toDate = this.utcDate.transform(props.toDate, DateType.TO_UTC);
    props.fromDate = this.utcDate.transform(props.fromDate, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<CancelledClassesReport>>(this.api() + `api/Class/GetCancelledClasses`, props, {
      headers: this.makeHeaders()
    });
  }

  getMemberReservationsOnClassesReport(props: ClassesReportFilters): Observable<HttpResponseDTO<MemberReservationsOnClassesReport>> {
    props = { ...props };
    props.toDate = this.utcDate.transform(props.toDate, DateType.TO_UTC);
    props.fromDate = this.utcDate.transform(props.fromDate, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<MemberReservationsOnClassesReport>>(this.api() + `api/Report/GetMemberReservationsOnClassesReport`, props, {
      headers: this.makeHeaders()
    });
  }

  getMemberAttendanceReport(props: MemberAttendanceFilters): Observable<HttpResponseDTO<MemberAttendanceReport>> {
    props = { ...props };
    props.toDate = this.utcDate.transform(props.toDate, DateType.TO_UTC);
    props.fromDate = this.utcDate.transform(props.fromDate, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<MemberAttendanceReport>>(this.api() + `api/Report/GetAttendance`, props, {
      headers: this.makeHeaders()
    });
  }

  getBlockedMembersReport(props: BlockedMembersFilters): Observable<HttpResponseDTO<BlockedMembersReport>> {
    props = { ...props };
    props.toDate = this.utcDate.transform(props.toDate, DateType.TO_UTC);
    props.fromDate = this.utcDate.transform(props.fromDate, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<BlockedMembersReport>>(this.api() + `api/Report/BlockedMembersReport`, props, {
      headers: this.makeHeaders()
    });
  }

  getMembersReport(props: MembersFilters): Observable<HttpResponseDTO<MembersReport>> {
    props = { ...props };
    props.joiningDateTo = this.utcDate.transform(props.joiningDateTo, DateType.TO_UTC);
    props.joiningDateFrom = this.utcDate.transform(props.joiningDateFrom, DateType.TO_UTC);

    if (props.ageFrom != null)
      props.ageFrom = this.utcDate.transform(props.ageFrom, DateType.TO_UTC);
    if (props.ageTo != null)
      props.ageTo = this.utcDate.transform(props.ageTo, DateType.TO_UTC);

    return this.http.post<HttpResponseDTO<MembersReport>>(this.api() + `api/Member/GetMembers`, props, {
      headers: this.makeHeaders()
    });
  }

  getLostItemsReport(props: lostItemsReportFilter): Observable<HttpResponseDTO<lostItemsReport>> {
    props = { ...props };

    if (props.fromDate != null)
      props.fromDate = this.utcDate.transform(props.fromDate, DateType.TO_UTC);
    if (props.toDate != null)
      props.toDate = this.utcDate.transform(props.toDate, DateType.TO_UTC);

    return this.http.post<HttpResponseDTO<lostItemsReport>>(this.api() + `api/Report/GetLostItemsReport`, props, {
      headers: this.makeHeaders()
    });
  }

  getBenefitsConsumtionReport(props: BenefitsConsumptionReportFilter): Observable<HttpResponseDTO<BenefitsConsumptionReport>> {
    props = { ...props };
    props.endDate = this.utcDate.transform(props.endDate, DateType.TO_UTC);
    props.startDate = this.utcDate.transform(props.startDate, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<BenefitsConsumptionReport>>(this.api() + `api/Report/GetBenefitsConsumption`, props, {
      headers: this.makeHeaders()
    });
  }

  getInvitationCountReport(props: InvitationCountReportFilter): Observable<HttpResponseDTO<InvitationCountReport>> {
    props = { ...props };
    props.toDate = this.utcDate.transform(props.toDate, DateType.TO_UTC);
    props.fromDate = this.utcDate.transform(props.fromDate, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<InvitationCountReport>>(this.api() + `api/Report/GetInvitationCount`, props, {
      headers: this.makeHeaders()
    });
  }

  getFreeConsumedBenefitsReport(props: FreeConsumedBenefitsReportFilter): Observable<HttpResponseDTO<FreeConsumedBenefitsReport>> {
    props = { ...props };
    props.toDate = this.utcDate.transform(props.toDate, DateType.TO_UTC);
    props.fromDate = this.utcDate.transform(props.fromDate, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<FreeConsumedBenefitsReport>>(this.api() + `api/Report/GetFreeConsumedBenefitsReport`, props, {
      headers: this.makeHeaders()
    });
  }

  getEmployeePayrollReport(props: EmployeePayrollReportFilter): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Report/GetEmployeePayroll?EmployeeId=${props.employeeId}&Month=${props.month}&Year=${props.year}&FixedShift=${props.fixedShift}`, {
      headers: this.makeHeaders()
    });
  }

  getGymAttendanceCountReport(props: ClassesReportFilters): Observable<HttpResponseDTO<GymAttendanceCountReport>> {
    props = { ...props };
    props.toDate = this.utcDate.transform(props.toDate, DateType.TO_UTC);
    props.fromDate = this.utcDate.transform(props.fromDate, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<GymAttendanceCountReport>>(this.api() + `api/Report/GetGymAttendanceCount`, props, {
      headers: this.makeHeaders()
    });
  }

  getMembershipTransferReport(props: MembershipTransferReportFilter): Observable<HttpResponseDTO<MembershipTransferReport>> {
    props = { ...props };
    props.toDate = this.utcDate.transform(props.toDate, DateType.TO_UTC);
    props.fromDate = this.utcDate.transform(props.fromDate, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<MembershipTransferReport>>(this.api() + `api/Report/GetMembershipTransferDataReport`, props, {
      headers: this.makeHeaders()
    });
  }

  getTopActiveMembersReport(props: TopActiveMembersReportFilter): Observable<HttpResponseDTO<TopActiveMembersReport>> {
    props = { ...props };
    props.toDate = this.utcDate.transform(props.toDate, DateType.TO_UTC);
    props.fromDate = this.utcDate.transform(props.fromDate, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<TopActiveMembersReport>>(this.api() + `api/Report/GetTopActiveMembersReport`, props, {
      headers: this.makeHeaders()
    });
  }

  GetMembershipsHavingDiscount(props: MembershipsDiscountReportFilter): Observable<HttpResponseDTO<TopActiveMembersReport>> {
    props = { ...props };
    props.paymentDateTo = this.utcDate.transform(props.paymentDateTo, DateType.TO_UTC);
    props.paymentDateFrom = this.utcDate.transform(props.paymentDateFrom, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<TopActiveMembersReport>>(this.api() + `api/Membership/GetMembershipsHavingDiscount`, props, {
      headers: this.makeHeaders()
    });
  }

  getMaximumExpirationDateReport(props: MaximumExpirationDateReportFilter): Observable<HttpResponseDTO<MaximumExpirationDateReport>> {
    props = { ...props };
    return this.http.post<HttpResponseDTO<MaximumExpirationDateReport>>(this.api() + `api/Report/GetMaximumExpirationDateReport`, props, {
      headers: this.makeHeaders()
    });
  }

  getPackageUtilizationPerSalesPersonalReport(props: PackageUtilizationPerSalesPersonalReportFilter): Observable<HttpResponseDTO<any>> {
    props = { ...props };
    props.fromDate = this.utcDate.transform(props.fromDate, DateType.TO_UTC);
    props.toDate = this.utcDate.transform(props.toDate, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Report/GetPackageUtilizationPerSalesPersonalReport`, props, {
      headers: this.makeHeaders()
    });
  }

  getConsumedPTSessionsReport(props: ConsumedPTSessionsReportFilter): Observable<HttpResponseDTO<any>> {
    props = { ...props };
    props.fromDate = this.utcDate.transform(props.fromDate, DateType.TO_UTC);
    props.toDate = this.utcDate.transform(props.toDate, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Attendance/GetConsumedPTSessions`, props, {
      headers: this.makeHeaders()
    });
  }

  getConsumedPTSessionsPerMembershipReport(props: ConsumedPTSessionsPerMembershipReportFilter): Observable<HttpResponseDTO<ConsumedPTSessionsPerMembershipReport>> {
    props = { ...props };
    props.fromDate = this.utcDate.transform(props.fromDate, DateType.TO_UTC);
    props.toDate = this.utcDate.transform(props.toDate, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<ConsumedPTSessionsPerMembershipReport>>(this.api() + `api/Attendance/GetConsumedPTSessionsPerMembership`, props, {
      headers: this.makeHeaders()
    });
  }

  getConsumedPTSessionsPerTrainerReport(props: ConsumedPTSessionsPerTrainerReportFilter): Observable<HttpResponseDTO<ConsumedPTSessionsPerTrainerReport>> {
    props = { ...props };
    props.fromDate = this.utcDate.transform(props.fromDate, DateType.TO_UTC);
    props.toDate = this.utcDate.transform(props.toDate, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<ConsumedPTSessionsPerTrainerReport>>(this.api() + `api/Attendance/GetConsumedPTSessionsPerTrainer`, props, {
      headers: this.makeHeaders()
    });
  }

  getMembershipUpgradeReport(props: MembershipUpgradeReportFilter): Observable<HttpResponseDTO<MembershipUpgradeReport>> {
    props = { ...props };
    props.toDate = this.utcDate.transform(props.toDate, DateType.TO_UTC);
    props.fromDate = this.utcDate.transform(props.fromDate, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<MembershipUpgradeReport>>(this.api() + `api/Report/GetMembershipUpgradeReport`, props, {
      headers: this.makeHeaders()
    });
  }

  getExpensesReport(props: ExpensesReportFilter): Observable<HttpResponseDTO<IExpenses>> {
    props = { ...props };
    props.from = this.utcDate.transform(props.from, DateType.TO_UTC);
    props.to = this.utcDate.transform(props.to, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<IExpenses>>(this.api() + `api/Accountant/GetExpenses`, props, {
      headers: this.makeHeaders()
    });
  }

  getEmployeeFinancialReport(props: EmployeeFinancialReportFilter): Observable<HttpResponseDTO<EmployeeFinancialReport>> {
    props = { ...props };
    props.toDate = this.utcDate.transform(props.toDate, DateType.TO_UTC);
    props.fromDate = this.utcDate.transform(props.fromDate, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<EmployeeFinancialReport>>(this.api() + `api/Report/GetEmployeeFinancials`, props, {
      headers: this.makeHeaders()
    });
  }

  getTrainerClosingRatioDetails(props: TrainerClosingRatioDetailsReportFilter): Observable<HttpResponseDTO<TrainerClosingRatioDetailsReport>> {
    props = { ...props };
    props.membershipStartDateFrom = this.utcDate.transform(props.membershipStartDateFrom, DateType.TO_UTC);
    props.membershipStartDateTo = this.utcDate.transform(props.membershipStartDateTo, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<TrainerClosingRatioDetailsReport>>(this.api() + `api/Report/GetTrainerClosingRatioDetails`, props, {
      headers: this.makeHeaders()
    });
  }
  getTrainerClosingRatio(props: TrainerClosingRatioReportFilter): Observable<HttpResponseDTO<TrainerClosingRatioReport>> {
    props = { ...props };
    props.membershipStartDateFrom = this.utcDate.transform(props.membershipStartDateFrom, DateType.TO_UTC);
    props.membershipStartDateTo = this.utcDate.transform(props.membershipStartDateTo, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<TrainerClosingRatioReport>>(this.api() + `api/Report/GetTrainerClosingRatio`, props, {
      headers: this.makeHeaders()
    });
  }

  getSalesPersonClosingRatioDetails(props: SalesPersonClosingRatioDetailsReportFilter): Observable<HttpResponseDTO<SalesPersonClosingRatioDetailsReport>> {
    props = { ...props };
    props.fromDate = this.utcDate.transform(props.fromDate, DateType.TO_UTC);
    props.toDate = this.utcDate.transform(props.toDate, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<SalesPersonClosingRatioDetailsReport>>(this.api() + `api/Report/GetSalesPersonClosingRatioDetails`, props, {
      headers: this.makeHeaders()
    });
  }
  getSalesPersonClosingRatio(props: SalesPersonClosingRatioReportFilter): Observable<HttpResponseDTO<SalesPersonClosingRatioReport>> {
    props = { ...props };
    props.fromDate = this.utcDate.transform(props.fromDate, DateType.TO_UTC);
    props.toDate = this.utcDate.transform(props.toDate, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<SalesPersonClosingRatioReport>>(this.api() + `api/Report/GetSalesPersonClosingRatio`, props, {
      headers: this.makeHeaders()
    });
  }

  getMemberships(props: any): Observable<HttpResponseDTO<Membership[]>> {
    return this.http.post<HttpResponseDTO<Membership[]>>(
      this.api() + 'api/Report/GetMembershipsReport',
      props, {
      headers: this.makeHeaders(props.showToastr, props.showSpinner)
    });
  }

  getMultipleAttendancePerDayReport(props: MultipleAttendancePerDayReportFilter): Observable<HttpResponseDTO<MultipleAttendancePerDayReport>> {
    props = { ...props };
    props.fromDate = this.utcDate.transform(props.fromDate, DateType.TO_UTC);
    props.toDate = this.utcDate.transform(props.toDate, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<MultipleAttendancePerDayReport>>(this.api() + `api/Attendance/GetMultipleAttendancePerDay`, props, {
      headers: this.makeHeaders()
    });
  }

  getProfitSummaryReport(props: ProfitSummaryReportFilter): Observable<HttpResponseDTO<ProfitSummaryReport>> {
    props = { ...props };
    props.fromDate = this.utcDate.transform(props.fromDate, DateType.TO_UTC);
    props.toDate = this.utcDate.transform(props.toDate, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<ProfitSummaryReport>>(this.api() + `api/Report/GetProfitSummary`, props, {
      headers: this.makeHeaders()
    });
  }

  getFixedTrainerCommissionReport(props: FixedTrainerCommissionReportFilter): Observable<HttpResponseDTO<MultipleAttendancePerDayReport>> {
    props = { ...props };

    if (props.membershipPaymentDateFrom != null)
      props.membershipPaymentDateFrom = this.utcDate.transform(props.membershipPaymentDateFrom, DateType.TO_UTC);
    if (props.membershipPaymentDateTo != null)
      props.membershipPaymentDateTo = this.utcDate.transform(props.membershipPaymentDateTo, DateType.TO_UTC);

    if (props.membershipStartDateFrom != null)
      props.membershipStartDateFrom = this.utcDate.transform(props.membershipStartDateFrom, DateType.TO_UTC);
    if (props.membershipStartDateTo != null)
      props.membershipStartDateTo = this.utcDate.transform(props.membershipStartDateTo, DateType.TO_UTC);

    if (props.membershipEndDateFrom != null)
      props.membershipEndDateFrom = this.utcDate.transform(props.membershipEndDateFrom, DateType.TO_UTC);
    if (props.membershipEndDateTo != null)
      props.membershipEndDateTo = this.utcDate.transform(props.membershipEndDateTo, DateType.TO_UTC);

    return this.http.post<HttpResponseDTO<MultipleAttendancePerDayReport>>(this.api() + `api/Report/GetFixedTrainerCommissionReport`, props, {
      headers: this.makeHeaders()
    });
  }

  generateMembershipsIncomePerPackageTypeReportReport(props: MembershipsIncomePerPackageTypeReportFilters): Observable<HttpResponseDTO<ProfitReport>> {
    props = { ...props };
    props.toDate = this.utcDate.transform(props.toDate, DateType.TO_UTC);
    props.fromDate = this.utcDate.transform(props.fromDate, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<ProfitReport>>(this.api() + `api/Report/GetAllMembershipsIncome`, props, {
      headers: this.makeHeaders()
    });
  }

  getFreePrivateTrainingReport(props: FreePrivateTrainingFilters): Observable<HttpResponseDTO<FreePrivateTrainingReport>> {
    props = { ...props };
    props.startDateFrom = this.utcDate.transform(props.startDateFrom, DateType.TO_UTC);
    props.startDateTo = this.utcDate.transform(props.startDateTo, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<FreePrivateTrainingReport>>(this.api() + `api/Report/GetFreePrivateTrainingReport`, props, {
      headers: this.makeHeaders()
    });
  }

  getInstructorDueAmountGroupedByInstructor(props: InstructorDueAmountGrouped): Observable<HttpResponseDTO<IInstructorDueAmountGrouped[]>> {
    props = { ...props };
    props.fromDate = this.utcDate.transform(props.fromDate, DateType.TO_UTC);
    props.toDate = this.utcDate.transform(props.toDate, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<IInstructorDueAmountGrouped[]>>(this.api() + `api/Report/GetInstructorDueAmountGroupedByInstructor`, props, {
      headers: this.makeHeaders()
    });
  }

  getInstructorDueAmountGroupedByClass(props: InstructorDueAmountGrouped, instructorId: number): Observable<HttpResponseDTO<IInstructorDueAmountGroupedByClasses[]>> {
    props = { ...props };
    props.fromDate = this.utcDate.transform(props.fromDate, DateType.TO_UTC);
    props.toDate = this.utcDate.transform(props.toDate, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<IInstructorDueAmountGroupedByClasses[]>>(this.api() + `api/Report/GetInstructorDueAmountGroupedByClass?instructorId=${instructorId}`, props, {
      headers: this.makeHeaders()
    });
  }

  changeClassRate(data: IChangeClassRate): Observable<HttpResponseDTO<IInstructorDueAmountGroupedByClasses[]>> {
    return this.http.post<HttpResponseDTO<IInstructorDueAmountGroupedByClasses[]>>(this.api() + `api/Class/EditClassInstructorRate`, data, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.update', 'httpResponseMessages.elements.class')
    });
  }
}
