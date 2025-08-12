import moment from 'moment';
import { Gender, InstructorDueAmountBasedOn, MembershipLogType, PackageTypes } from './enums';
import { ISalesDashboardFilters } from './common.model';
import { IFreePrivateTraining } from './extra.model';
export class ProfitFilters {
  fromDate: string;
  toDate: string;
  userId: number | null;
  includeMemberships: boolean = true;
  includeMonitoringMemberships: boolean = true;
  includeMedicalMemberships: boolean = true;
  includeOtherMemberships: boolean = true;
  includeSessions: boolean = true;
  includeCafeteria: boolean = true;
  includeDebts: boolean = true;
  includeUpgrade: boolean = true;
  includeDowngrade: boolean = true;
  includeTransfer: boolean = true;
  includeFreeze: boolean = true;
  includeReservations: boolean = true;
  includeExpenses: boolean = true;
  includeRefunds: boolean = true;
  includeOtherRevenue: boolean = true;
  includeStaffFinancial: boolean = true;
  includeMembersFinancialTransactions: boolean = true;
  finalApprovedOnly: boolean = true;
  isGroupByCat: boolean = true;
  branchesIds: number[] = [];
  paymentTypeId: number;
  constructor() {
    const format1 = "YYYY-MM-DD";
    const today = new Date();
    this.fromDate = moment(today).format(format1) + 'T00:00';
    this.toDate = moment(today).format(format1) + 'T23:59';
    this.userId = null;
  }
}

export class MembershipsIncomeFilters {
  fromDate: string;
  toDate: string;
  branchesIds: number[] = [];
  userId: number | null;
  isGroupByCat: boolean = true;
  finalApprovedOnly: boolean = true;
  includeMemberships: boolean = true;
  includeDebts: boolean = true;
  includeUpgrade: boolean = true;
  includeDowngrade: boolean = true;
  includeRefunds: boolean = true;
  constructor() {
    const format1 = "YYYY-MM-DD";
    const today = new Date();
    this.fromDate = moment(today).format(format1) + 'T00:00';
    this.toDate = moment(today).format(format1) + 'T23:59';
    this.userId = null;
  }
}

export class PrivateMembershipsIncomeFilters {
  fromDate: string;
  toDate: string;
  branchesIds: number[] = [];
  userId: number | null;
  isGroupByCat: boolean = true;
  finalApprovedOnly: boolean = true;
  includeMemberships: boolean = true;
  includeDebts: boolean = true;
  includeUpgrade: boolean = true;
  includeDowngrade: boolean = true;
  includeRefunds: boolean = true;
  constructor() {
    const format1 = "YYYY-MM-DD";
    const today = new Date();
    this.fromDate = moment(today).format(format1) + 'T00:00';
    this.toDate = moment(today).format(format1) + 'T23:59';
    this.userId = null;
  }
}

export class MedicalMembershipsIncomeFilters {
  fromDate: string;
  toDate: string;
  branchesIds: number[] = [];
  userId: number | null;
  isGroupByCat: boolean = true;
  finalApprovedOnly: boolean = true;
  includeMedicalMemberships: boolean = true;
  includeDebts: boolean = true;
  includeUpgrade: boolean = true;
  includeDowngrade: boolean = true;
  includeRefunds: boolean = true;
  constructor() {
    const format1 = "YYYY-MM-DD";
    const today = new Date();
    this.fromDate = moment(today).format(format1) + 'T00:00';
    this.toDate = moment(today).format(format1) + 'T23:59';
    this.userId = null;
  }
}

export class MembershipsReportFilter {
  contractNo: string;
  accessCode: string;
  phoneNo: string;
  memberName: string;
  gender: number;
  sourceOfKnowledgeId: number;
  packageType: number;
  packageCategory: number;
  packageId: number;
  paymentDateFrom: Date;
  paymentDateTo: Date;
  startFromDate: any;
  startToDate: any;
  endFromDate: any;
  endToDate: any;
  upgradeDeadlineFromDate: any;
  upgradeDeadlineToDate: any;
  salesPersonId: number;
  status: number;
  coachId: number;
}
export class NewNotRenewedMembershipsReportFilter {
  fromDate: string;
  toDate: string;
  gender: number;
  packageId: number;
  packagesIds: number[] = [];
  salesPersonId: number;
  constructor() {
    const format1 = "YYYY-MM-DD";
    const today = new Date();
    this.fromDate = moment(today).format(format1) + 'T00:00';
    this.toDate = moment(today).format(format1) + 'T11:59';
  }
}
export class MembershipsLogReportFilter {
  fromDate: any;
  toDate: any;
  userId: number;
  logTypeId: number;
  membershipId: number;
  includedText: string;
}

export interface ProfitReport {
  cafeteria: any[];
  debts: any[];
  downgrade: any[];
  expenses: any[];
  freeze: any[];
  memberships: any[];
  monitoringMemberships: any[];
  medicalMemberships: any[];
  otherMemberships: any[];
  otherRevenue: any;
  otherRevenues: any[];
  refund: any[];
  reservations: any[];
  sessions: any[];
  staffFinancials: any[];
  transfer: any[];
  upgrade: any[];
  membersFinancialTransactions: any[];
  visaTypesAmount: any[];
  receipts: any[];
  outcomeList: any[];
  summary: any;
}



export const MembershipLogTypes = [
  { name: 'Create', value: MembershipLogType.Create },
  { name: 'Edit', value: MembershipLogType.Edit },
  { name: 'Freeze', value: MembershipLogType.Freeze },
  { name: 'Unfreeze', value: MembershipLogType.Unfreeze },
  { name: 'Upgrade', value: MembershipLogType.Upgrade },
  { name: 'Downgrade', value: MembershipLogType.Downgrade },
  { name: 'Transfer', value: MembershipLogType.Transfer },
  { name: 'Suspend', value: MembershipLogType.Suspend },
  { name: 'Resume', value: MembershipLogType.Resume },
  { name: 'Cancel', value: MembershipLogType.Cancel },
  { name: 'ChangeMoney', value: MembershipLogType.ChangeMoney },
  { name: 'DeleteAttempt', value: MembershipLogType.DeleteAttempt },
]

export class PackagesUtilReport {
  fromDate: string;
  toDate: string;
  skipCount: number;
  takeCount: number;
  userId: number;
  isMonitoring: boolean = false;
  gender: Gender;
  packageCategory: PackageTypes;
  constructor() {
    const format1 = "YYYY-MM-DD";
    const today = new Date();
    this.fromDate = moment(today).format(format1) + 'T00:00';
    this.toDate = moment(today).format(format1) + 'T11:59';
  }
}
export class SinglePackageUtilReport {
  packageId: number;
  fromDate: string;
  toDate: string;
  skipCount: number;
  takeCount: number;
  userId: number;
  gender: Gender;
  packageCategory: PackageTypes;
  packageName: string;
  constructor() {
    const format1 = "YYYY-MM-DD";
    const today = new Date();
    this.fromDate = moment(today).format(format1) + 'T00:00';
    this.toDate = moment(today).format(format1) + 'T11:59';
  }
}
export class DayByDayProfitReport {
  fromDate: string;
  toDate: string;
  skipCount: number;
  takeCount: number;
  userId: number;
  finalApprovedOnly: boolean = true;
  onClosing: boolean = false;
  constructor() {
    const format1 = "YYYY-MM-DD";
    const today = new Date();
    this.fromDate = moment(today).format(format1) + 'T00:00';
    this.toDate = moment(today).format(format1) + 'T11:59';
  }
}

export class BirthdaysReport {
  birthDateFrom: any;
  birthDateTo: any;
  isPossibleMember: boolean = false;
  salesPersonId: number;
  excludeBlocked: boolean;
  constructor() {
    const today = new Date();
    this.birthDateFrom = new Date(today.setDate(today.getDate() - 5));
    this.birthDateTo = new Date();
  }
}
export class CallsSummaryReport {
  fromDate: any;
  toDate: any;
  skipCount: number;
  takeCount: number;
  userId: number;
  constructor() {
    const format1 = "YYYY-MM-DD";
    const today = new Date();
    this.fromDate = moment(today).format(format1) + 'T00:00';
    this.toDate = moment(today).format(format1) + 'T23:59';
  }
}
export class LogsReport {
  fromDate: any;
  toDate: any;
  skipCount: number;
  takeCount: number;
  userId: number;
  searchLogData: string;
  constructor() {
    const format1 = "YYYY-MM-DD";
    const today = new Date();
    this.fromDate = moment(today).format(format1) + 'T00:00';
    this.toDate = moment(today).format(format1) + 'T23:59';
  }
}
export class AbsentMembersReport {
  date: any = new Date();
  packageId: number;
}

export class NotActiveMembersReport {
  rowsCount: number = 1000;
  leastNoDays: number = 7;
  maxNoDays: number | null = null;
  salesPersonId: number | null = null;
}

export class OverAttendanceReport {
  fromDate: any = new Date();
  toDate: any = new Date();
  skipCount: number;
  takeCount: number;
  userId: number;
  onRemaining: boolean = false;
  constructor() {
    const today = new Date();
    this.fromDate = new Date(today.setDate(today.getDate() - 10));
  }
}

export class DebtsReport {
  memberApplicationNo: string;
  memberCode: number;
  memberPhone: string;
  memberName: string;
  gender: number;
  debtFromDueDate: Date;
  debtToDueDate: Date;
  paymentStatus: number = 0;
  salesPersonId: number;
  startFromDate: any;
  startToDate: any;
  endFromDate: any;
  endToDate: any;
  settlementFrom: Date;
  settlementTo: Date;
}

export class DebtsReportFilters {
  id: number;
  memberId: number;
  contractNo: string;
  accessCode: string;
  phoneNo: string;
  memberName: string;
  gender: number;
  sourceOfKnowledgeId: number;
  packageId: number;
  paymentDateFrom: Date;
  paymentDateTo: Date;
  endFromDate: any;
  endToDate: any;
  excludeExpired: boolean;
  startFromDate: any;
  startToDate: any;
  installmentId: number;
  salesPersonId: number;
  debtFromDueDate: Date;
  debtToDueDate: Date;
  settlementFrom: Date;
  settlementTo: Date;
  paymentStatus: number = 0;
  status: number;
  skipCount: number;
  takeCount: number;
  packageType: number;
  coachId: number;
  upgradeDeadlineFromDate: any;
  upgradeDeadlineToDate: any;
  packageCategory: number = 0;
}
export class SalesCommissionReport implements ISalesDashboardFilters {
  fromDate: any = new Date();
  toDate: any = new Date();
  salesIds: number[] = [];
  isNewRenewCalculations: boolean = false;
  finalApprovedOnly: boolean = true;
}
export class TrainerCommissionReport {
  month: number;
  year: number;
  coachId: number;
  status: number | null = null;
  isCommissionVersion3: boolean = false;
  type: 'session' | 'membership' = 'membership';
}

export class TrainerMemberRetentionReport {
  trainerId: number;
  memberContractNo: string;
  paymentDateFrom: string;
  paymentDateTo: string;
  constructor() {
    const format1 = "YYYY-MM-DD";
    const today = new Date();
    const firstDayInMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    this.paymentDateFrom = moment(firstDayInMonth).format(format1) + 'T00:00';
    this.paymentDateTo = moment(today).format(format1) + 'T23:59';
  }
}

export type TTrainerMemberSession = {
  paymentDate: string;
  coachName: string;
  contractNo: string;
  memberEnglishName: string;
  packageName: string;
  attendedTimes: number | null;
  coachId: number;
  memberId: number;
};

export type TTrainerMemberGroupedSessions = {
  memberId: number;
  coachName: string;
  memberName: string;
  coachId: number;
  sessions: TTrainerMemberSession[];
};

export class MembershipsIncomePerPackageTypeReportFilters {
  fromDate: string;
  toDate: string;
  finalApprovedOnly: boolean = true;
  constructor() {
    const format1 = "YYYY-MM-DD";
    const today = new Date();
    this.fromDate = moment(today).format(format1) + 'T00:00';
    this.toDate = moment(today).format(format1) + 'T23:59';
  }
}

export interface MembershipsIncomePerPackageTypeReportReport {
  memberships: any[];
  monitoringMemberships: any[];
}

export type MembershipGroupedPackage = {
  packageTypeId: number;
  packageTypeName: string;
  memberships: any[];
};

export type MonitoringMembershipGroupedPackage = {
  packageTypeId: number;
  packageTypeName: string;
  monitoringMemberships: any[];
};

export class PackageCommissionReport {
  month: number;
  year: number;
  employeesIds: number[];
  finalApprovedOnly: boolean = true;
}

export class MatchedMemberNotification {
  memberGroup: number;
  skipCount: number;
  takeCount: number;
  memberGetCommand: CommonFilter = new CommonFilter();
  additionalFilters: NotRenewedFilter | NotActiveMemberFilter | DebtorsFilter | null
}

export class AddMemberNotification extends MatchedMemberNotification {
  title: string;
  message: string;
  isSMS: boolean;
  isMobileApp: boolean;
  isWhatsApp: boolean;
  excludedMembersIds: number[];
  imageName: string;
}



export class MemberNotificationFilters {
  notificationId: number;
  athleticName: string;
  contractNumber: string;
  reasonName: string;
  phoneNumber: string;
  notificationMessage: string;
  creationDate: Date;
  fromCreationDate: any;
  toCreationDate: any;
  isSMSSent: boolean;
  isWhatsAppSent: boolean;
  isMobileAppSent: boolean;
  isSMS: boolean;
  isWhatsApp: boolean;
  isMobileApp: boolean;
  skipCount: number;
  takeCount: number;

  // constructor() {
  //     this.fromCreationDate = moment().subtract(15, 'days');
  //     this.toCreationDate = moment().subtract(1, 'days');
  // }
}
export interface IMemberNotification extends INotification {
  athleticName: string,
  contractNumber: string,
  reasonName: string,
  phoneNumber: string,
  fromCreationDate: Date,
  toCreationDate: Date,
  isSMSSent: boolean;
  isWhatsAppSent: boolean;
  isMobileAppSent: boolean;
  response: string
}

export interface IMemberReferral {
  creationDate: Date,
  contractNumber: string,
  name: string,
  phoneNumber: string,
  salesPersonName: string
}

export interface INotification {
  id: number,
  title: string,
  notificationMessage: string,
  isSMS: boolean,
  isWhatsApp: boolean,
  isMobileApp: boolean,
  reasonId: number,
  reasonName: string,
  creationDate: string,
  createdBy: number,
  userName: string,
  totalMembers: number,
  response: string
}

export class SingleMemberNotification {
  id: number;
  memberId: number;
  memberPhone: string;
  reasonId: number;
  notificationTitle: string;
  notificationMessage: string;
  isSeen: boolean;
  creationDate: Date;
  creationDateAsString: string;
  seenDate: Date;
  isSMS: boolean;
  isMobileApp: boolean;
  isWhatsApp: boolean;
  isSmssent: boolean;
  isMobileAppSent: boolean;
  isWhatsUpSent: boolean;
  response: string;
  contextId: number;
  isNeedApprove: boolean;
}
export class CommonFilter {
  id: number;
  applicationNo: string;
  code: string;
  name: string;
  gender: number;
  sourceOfKnowledgeId: number;
  phoneNo: string;
  nationalId: string;
  birthDateFrom: Date;
  birthDateTo: Date;
  isPossibleMember: boolean;
  salesPersonId: number;
  endDate: Date;
  hasAccessCodeOnly: boolean;
  joiningDateFrom: Date;
  joiningDateTo: Date;
  nationalityId: number;
  regionId: number;
  isDataCompleted: boolean;
  isMemberLogedOnApplication: boolean;
  memberInterestPercentageId: number;
  phoneFormatId: number;
  skipCount: number;
  takeCount: number;
}

export class NotRenewedFilter {
  fromDate: any;
  toDate: any;
  gender: Gender;
  packageId: number;
  salesPersonId: number;
  packageCategory: number;
}

export class NotActiveMemberFilter {
  rowsCount: number;
  leastNoDays: number;
  maxNoDays: number;
  callDaysLimit: number;
  salesPersonId: number;
}

export class DebtorsFilter {
  id: number;
  memberId: number;
  contractNo: string;
  accessCode: string;
  phoneNo: string;
  memberName: string;
  gender: number;
  sourceOfKnowledgeId: number;
  packageId: number;
  paymentDateFrom: Date;
  paymentDateTo: Date;
  endFromDate: any;
  endToDate: any;
  excludeExpired: boolean;
  startFromDate: any;
  startToDate: any;
  installmentId: number;
  salesPersonId: number;
  debtFromDueDate: Date;
  debtToDueDate: Date;
  settlementFrom: Date;
  settlementTo: Date;
  paymentStatus: number;
  status: number;
  skipCount: number;
  takeCount: number;
  packageType: PackageTypes;
  coachId: number;
  upgradeDeadlineFromDate: any;
  upgradeDeadlineToDate: any;
}

export class DeletedReceiptsReportFilter {
  paymentFromDate: string;
  paymentToDate: string;
  isDeletedOnly: boolean = true;
  constructor() {
    const format1 = "YYYY-MM-DD";
    const today = new Date();
    this.paymentFromDate = moment(today).format(format1) + 'T00:00';
    this.paymentToDate = moment(today).format(format1) + 'T23:59';
  }
}

export class DeletedReceiptsReport {
  serialNo: number;
  manualNo: string;
  contextType: string;
  paymentDate: Date;
  cashAmount: number;
  visaAmount: number;
  visaTypeName: string;
  memberId: number;
  contractNo: string;
  memberName: string;
}

export class ClassesTypesReport {
  className: string;
  classCount: number;
  memberCount: number;
}


export class HeldClassesReport {
  instructorName: string;
  className: string;
  classStartDate: Date;
  classEndtDate: Date;
  classBranch: string;
  attendanceCount: number;
}

export class InstructorDueAmountReport {
  instructorName: string;
  className: string;
  classTypeName: string;
  memberContractNo: string;
  memberName: string;
  bookingStatusName: string;
  package: string;
  memberId: number;
  membershipPrice: number;
  sessionsCount: number;
  sessionPrice: number;
  instructorRate: number;
  instructorDueAmount: number;
  classStartDate: Date;
  classEndDate: Date;
  attendanceCount: number;
  bookedCount: number;
  waitingListCount: number;
  membershipPriceAfterTax: number;
  instructorPrice: number;
  isWithoutMembership: boolean;
  status?: string;
  acceptedEntityMemberId?: number;
  acceptedEntityName?: string;
  dueAmount?: number;
}

export class ClassesPerInstructorAndTypeReport {
  instructorName: string;
  className: string;
  classCount: number;
  attendedCount: number;
  bookingCount: number;
  watingListCount: number;
  memberCount: number;
}

export class ClassesBookingListReport {
  bookingDate: string;
  memberContractNo: string;
  memberPhone: string;
  memberName: string;
  className: string;
  instructorName: string;
  classStartDate: Date;
  classEndtDate: Date;
  status: string;
}
export class CancelledClassesReport {
  classTypeName: string;
  instructorName: string;
  startDate: Date;
  endDate: Date;
  bookingStartsAt: Date;
  bookingEndsAt: Date;
  creationDate: Date;
  publishedDate: Date;
  cancellationReasonName: string;
  cancellationReason: string;
}
export class MemberReservationsOnClassesReport {
  memberContractNo: string;
  memberPhone: string;
  memberName: string;
  januaryCount1: number;
  februaryCount2: number;
  marchCount3: number;
  aprilCount4: number;
  mayCount5: number;
  juneCount6: number;
  julyCount7: number;
  augustCount8: number;
  septemberCount9: number;
  octoberCount10: number;
  novemberCount11: number;
  decemberCount12: number;
}

export class ClassesReportFilters {
  fromDate: string;
  toDate: string;
  instructorId?: number;
  classId?: number;
  statusId?: number;
  isCancelled: boolean;
  branchId: number;
  basedOn: string = InstructorDueAmountBasedOn.percentage;

  constructor() {
    const format1 = "YYYY-MM-DD";
    const today = new Date();
    this.fromDate = moment(today).format(format1) + 'T00:00';
    this.toDate = moment(today).format(format1) + 'T23:59';
  }
}

export class OtherEntitiesBookings implements Partial<ClassesReportFilters> {
  fromDate: string;
  toDate: string;
  instructorId: number;
  classId?: number;
  statusId?: number;
  isCancelled?: boolean;
  branchId?: number;
  basedOn?: string;
  constructor() {
    const format1 = "YYYY-MM-DD";
    const today = new Date();
    this.fromDate = moment(today).format(format1) + 'T00:00';
    this.toDate = moment(today).format(format1) + 'T23:59';
  }

}
export class InstructorDueAmountClassesReportFilters {
  fromDate: string;
  toDate: string;
  instructorId?: number;
  classId: number;
}

export class MemberAttendanceFilters {
  fromDate: string;
  toDate: string;
  memberContractNo: string;
  memberCode: string;
  memberPhone: string;
  memberName: string;
  includeDeleted: boolean;
  gender: 0;
  salesPersonId: 0;
  constructor() {
    const format1 = "YYYY-MM-DD";
    const today = new Date();
    this.fromDate = moment(today).format(format1) + 'T00:00';
    this.toDate = moment(today).format(format1) + 'T23:59';
  }
}

export class MemberAttendanceReport {
  attendanceDate: string;
  checkOutDate: string;
  contractNo: string;
  phoneNumber: string;
  englishName: string;
  package: string;
  startDate: string;
  endDate: string;
  branchName: string;
  salesPersonName: string;
  userName: string;
}

export class BlockedMembersFilters {
  fromDate: string;
  toDate: string;
  constructor() {
    const format1 = "YYYY-MM-DD";
    const today = new Date();
    this.fromDate = moment(today).format(format1) + 'T00:00';
    this.toDate = moment(today).format(format1) + 'T23:59';
  }
}

export class BlockedMembersReport {
  blockedDate: string;
  applicationNo: string;
  phoneNo: string;
  nameEng: string;
  blockReason: string;
  blockedBy: string;
}

export class MembersFilters {
  applicationNo: string;
  phoneNo: string;
  code: string;
  name: string;
  gender: string;
  salesPersonId: string;
  nationalityId: string;
  regionId: string;
  levelId: string;
  sourceOfKnowledgeId: string;
  joiningDateFrom: string;
  joiningDateTo: string;
  ageFrom: string;
  ageTo: string;
  isPossibleMember: boolean;
  constructor() {
    const format1 = "YYYY-MM-DD";
    const today = new Date();
    const firstDayInMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    this.joiningDateFrom = moment(firstDayInMonth).format(format1) + 'T00:00';
    this.joiningDateTo = moment(today).format(format1) + 'T23:59';
  }
}

export class MembersReport {
  applicationNo: string;
  code: string;
  nameEng: string;
  phoneNo: string;
  birthDate: string;
  joiningDate: string;
  genderName: string;
  salesName: string;
  sourceName: string;
  username: string;
}


export class lostItemsReportFilter {
  fromDate: string;
  toDate: string;
  locationId: number;
  categoryId: number;
  isDeliverd: any;
  isFinderMember: any;
  isFinderEmplyee: any;
  isRecipientMember: any;
  isRecipientEmployee: any;
}

export class InvitationCountReportFilter {
  fromDate: string;
  toDate: string;

  constructor() {
    const format1 = "YYYY-MM-DD";
    const today = new Date();
    this.fromDate = moment(today).format(format1) + 'T00:00';
    this.toDate = moment(today).format(format1) + 'T23:59';
  }
}


export class lostItemsReport {
  creationDate: Date;
  categoryName: string;
  locationName: string;
  itemDescription: string;
  notes: string;
  status: string;
  deliveredDate: Date;
}


export class FreeConsumedBenefitsReport {
  sessionDate: Date;
  memberContractNo: string;
  memberName: string;
  memberPhone: string;
  benfitName: string;
  trainerName: string;
}


export class BenefitsConsumptionReportFilter {
  startDate: string;
  endDate: string;
  constructor() {
    const format1 = "YYYY-MM-DD";
    const today = new Date();
    this.startDate = moment(today).format(format1) + 'T00:00';
    this.endDate = moment(today).format(format1) + 'T23:59';
  }
}

export class FreeConsumedBenefitsReportFilter {
  fromDate: string;
  toDate: string;
  constructor() {
    const format1 = "YYYY-MM-DD";
    const today = new Date();
    this.fromDate = moment(today).format(format1) + 'T00:00';
    this.toDate = moment(today).format(format1) + 'T23:59';
  }
}

export class InvitationCountReport {
  date: Date;
  maleInvitation: number;
  femaleInvitation: number;
  membersCount: number;
}


export class BenefitsConsumptionReport {
  benefitName: string;
  totalBenefits: number;
  consumed: number;
  unConsumed: number;
}

export class EmployeePayrollReportFilter {
  employeeId: number;
  month: number;
  year: number;
  fixedShift: boolean = true;
}

export class PersonalData {
  code: string;
  phoneNo: string;
  jobTitle: string;
  englishName: string;
  arabicName: string;
  managerName: string;
  shiftName: string;
  salary: number;
}

export class WorkingDays {
  dayName: string;
  dayDate: Date;
  shiftTimes: string;
  checkIn: Date;
  checkOut: Date;
  shortageInMinutes: number;
  overTimeInMinutes: number;
  lateDeductionsInMinutes: number;
  notes: string;
}

export class Accounts {
  actionDate: Date;
  typeName: string;
  price: number;
  description: string;
}

export class EmployeePayrollReport {
  personalData: PersonalData;
  workingDays: WorkingDays[];
  accounts: Accounts[];
}

export class GymAttendanceCountReport {
  date: Date;
  maleAttendance: number;
  femaleAttendance: number;
  membersCount: number;
}

export class MembershipTransferReportFilter {
  fromDate: string;
  toDate: string;
  constructor() {
    const format1 = "YYYY-MM-DD";
    const today = new Date();
    this.fromDate = moment(today).format(format1) + 'T00:00';
    this.toDate = moment(today).format(format1) + 'T23:59';
  }
}

export class MembershipTransferReport {
  transferDate: Date;
  transferedFrom: string;
  transferedTo: string;
  periodName: string;
  createdByName: string;
  cashAmount: number;
  visaAmount: number;
}

export class TopActiveMembersReportFilter {
  fromDate: string;
  toDate: string;
  constructor() {
    const format1 = "YYYY-MM-DD";
    const today = new Date();
    const firstDayInMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    this.fromDate = moment(firstDayInMonth).format(format1) + 'T00:00';
    this.toDate = moment(today).format(format1) + 'T23:59';
  }
}

export class TopActiveMembersReport {
  memberContractNo: string;
  memberPhone: string;
  memberName: string;
  count: number;
  memberCode: string;
}

export class MembershipsDiscountReportFilter {
  paymentDateFrom: string;
  paymentDateTo: string;
  constructor() {
    const format1 = "YYYY-MM-DD";
    const today = new Date();
    const firstDayInMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    this.paymentDateFrom = moment(firstDayInMonth).format(format1) + 'T00:00';
    this.paymentDateTo = moment(today).format(format1) + 'T23:59';
  }
}

export class TrainersAchievementReport {
  fromDate: any = new Date();
  toDate: any = new Date();
  trainersIds: number[] = [];
  finalApprovedOnly: boolean = true;
}

export class MaximumExpirationDateReportFilter {
  packageCategory: number = 0;
  packageId: number;
}

export class MaximumExpirationDateReport {
  packageName: string;
  maxExpirationDate: string;
}

export class PackageUtilizationPerSalesPersonalReportFilter {
  fromDate: any = new Date();
  toDate: any = new Date();
  salesIds: number[];
  isNewRenewCalculations: boolean = true;
  finalApprovedOnly: boolean = true;
  constructor() {
    const format1 = "YYYY-MM-DD";
    const today = new Date();
    const firstDayInMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    this.fromDate = moment(firstDayInMonth).format(format1) + 'T00:00';
    this.toDate = moment(today).format(format1) + 'T23:59';
  }
}

export class PackageUtilizationPerSalesPersonalReport {
  salesPersonName: string;
  periodName: string;
  count: number;
  actualValue: number;
}

export class ConsumedPTSessionsReportFilter {
  fromDate: any = new Date();
  toDate: any = new Date();
  type: number;
  status: number;
  trainerId: number;
  constructor() {
    const format1 = "YYYY-MM-DD";
    const today = new Date();
    const firstDayInMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    this.fromDate = moment(firstDayInMonth).format(format1) + 'T00:00';
    this.toDate = moment(today).format(format1) + 'T23:59';
  }
}

export class ConsumedPTSessionsReport {
  sessionDate: string;
  memberName: string;
  trainerName: string;
  typeName: string;
  statusName: string;
  packageName: string;
  startDate: string;
  approvedDate: string;
  creationDate: string;
  expirationDate: string;
}

export class MembershipUpgradeReportFilter {
  fromDate: string;
  toDate: string;
  userId: number;
  constructor() {
    const format1 = "YYYY-MM-DD";
    const today = new Date();
    this.fromDate = moment(today).format(format1) + 'T00:00';
    this.toDate = moment(today).format(format1) + 'T23:59';
  }
}

export class MembershipUpgradeReport {
  paymentDate: Date;
  memberContractNo: string;
  memberPhoneNumber: string;
  memberName: string;
  prevPackageName: string;
  newPackageName: string;
  totalAmountPaid: number;
  username: string;
}

export class ExpensesReportFilter {
  from: any = new Date();
  to: any = new Date();
  type: number;
  constructor() {
    const format1 = "YYYY-MM-DD";
    const today = new Date();
    const firstDayInMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    this.from = moment(firstDayInMonth).format(format1) + 'T00:00';
    this.to = moment(today).format(format1) + 'T23:59';
  }
}

export class EmployeeFinancialReportFilter {
  fromDate: any = new Date();
  toDate: any = new Date();
  employeeId: number;

  constructor() {
    const format1 = "YYYY-MM-DD";
    const today = new Date();
    const firstDayInMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    this.fromDate = moment(firstDayInMonth).format(format1) + 'T00:00';
    this.toDate = moment(today).format(format1) + 'T23:59';
  }
}

export class EmployeeFinancialReport {
  employeeData: EmployeeData;
  financials: Financial[];
}

export class EmployeeData {
  code: string;
  englishName: string;
  arabicName: string;
  phoneNo: string;
  jobTitle: string;
  managerName: string;
  salary: string;
  birthDate: string;
}

export class Financial {
  actionDate: string;
  amountPlusAndMinus: number;
  typeName: string;
  description: string;
}

export class ConsumedPTSessionsPerMembershipReportFilter {
  fromDate: any = new Date();
  toDate: any = new Date();
  type: number;
  status: number;
  trainerId: number;
  constructor() {
    const format1 = "YYYY-MM-DD";
    const today = new Date();
    const firstDayInMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    this.fromDate = moment(firstDayInMonth).format(format1) + 'T00:00';
    this.toDate = moment(today).format(format1) + 'T23:59';
  }
}

export class ConsumedPTSessionsPerMembershipReport {
  contractNo: string;
  packageName: string;
  startDate: string;
  expirationDate: string;
  trainerName: string;
  approvedSessionsCount: number;
  notApprovedSessionsCount: number;
  totalSessionsCount: number;
}

export class ConsumedPTSessionsPerTrainerReportFilter {
  fromDate: any = new Date();
  toDate: any = new Date();
  type: number;
  status: number;
  trainerId: number;
  constructor() {
    const format1 = "YYYY-MM-DD";
    const today = new Date();
    const firstDayInMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    this.fromDate = moment(firstDayInMonth).format(format1) + 'T00:00';
    this.toDate = moment(today).format(format1) + 'T23:59';
  }
}

export class ConsumedPTSessionsPerTrainerReport {
  trainerName: string;
  approvedSessionsCount: number;
  notApprovedSessionsCount: number;
  totalSessionsCount: number;
}

export class TrainerClosingRatioDetailsReportFilter {
  membershipStartDateFrom: any = new Date();
  membershipStartDateTo: any = new Date();
  trainerId: number;
  constructor() {
    const format1 = "YYYY-MM-DD";
    const today = new Date();
    const firstDayInMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    this.membershipStartDateFrom = moment(firstDayInMonth).format(format1) + 'T00:00';
    this.membershipStartDateTo = moment(today).format(format1) + 'T23:59';
  }
}

export class TrainerClosingRatioDetailsReport {
  closingRatio: TrainerClosingRatioReport;
  details: TrainerClosingRatioDetails[];
}

export class TrainerClosingRatioDetails {
  trainerName: string;
  contractNo: string;
  memberName: string;
  startDate: string;
  packageName: string;
  ptSessionsCount: number;
  ptPackageName: string;
  ptStartDate: string;
}

export class TrainerClosingRatioReportFilter {
  membershipStartDateFrom: any = new Date();
  membershipStartDateTo: any = new Date();
  trainerId: number;
  constructor() {
    const format1 = "YYYY-MM-DD";
    const today = new Date();
    const firstDayInMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    this.membershipStartDateFrom = moment(firstDayInMonth).format(format1) + 'T00:00';
    this.membershipStartDateTo = moment(today).format(format1) + 'T23:59';
  }
}

export class TrainerClosingRatioReport {
  trainerName: string;
  successfulSales: number;
  totalOpportunities: number;
  ratio: number;
}

export class SalesPersonClosingRatioDetailsReportFilter {
  fromDate: any = new Date();
  toDate: any = new Date();
  salesPersonId: number;
  constructor() {
    const format1 = "YYYY-MM-DD";
    const today = new Date();
    const firstDayInMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    this.fromDate = moment(firstDayInMonth).format(format1) + 'T00:00';
    this.toDate = moment(today).format(format1) + 'T23:59';
  }
}

export class SalesPersonClosingRatioDetailsReport {
  closingRatio: SalesPersonClosingRatioReport;
  details: SalesPersonClosingRatioDetails[];
}

export class SalesPersonClosingRatioDetails {
  salesPerson: string;
  contractNo: string;
  memberName: string;
  packageName: string;
  membershipPaymentDate: string;
}

export class SalesPersonClosingRatioReportFilter {
  fromDate: any = new Date();
  toDate: any = new Date();
  salesPersonId: number;
  constructor() {
    const format1 = "YYYY-MM-DD";
    const today = new Date();
    const firstDayInMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    this.fromDate = moment(firstDayInMonth).format(format1) + 'T00:00';
    this.toDate = moment(today).format(format1) + 'T23:59';
  }
}

export class SalesPersonClosingRatioReport {
  salesPersonName: string;
  successfulSales: number;
  totalOpportunities: number;
  ratio: number;
}




export class MultipleAttendancePerDayReportFilter {
  fromDate: any = new Date();
  toDate: any = new Date();
  constructor() {
    const format1 = "YYYY-MM-DD";
    const today = new Date();
    const firstDayInMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    this.fromDate = moment(firstDayInMonth).format(format1) + 'T00:00';
    this.toDate = moment(today).format(format1) + 'T23:59';
  }
}

export interface MultipleAttendancePerDayReport {
  id: number,
  day: any,
  contractNo: string,
  phoneNumber: number,
  memberName: number,
  attendanceCount: number,
}


export class ProfitSummaryReportFilter {
  fromDate: any = new Date();
  toDate: any = new Date();


  constructor() {
    const format1 = "YYYY-MM-DD";
    const today = new Date();
    const firstDayInMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    this.fromDate = moment(firstDayInMonth).format(format1) + 'T00:00';
    this.toDate = moment(lastDayInMonth).format(format1) + 'T23:59';
  }
}

export interface ProfitSummaryIncomeExpensesReport {
  type: string,
  amount: number,
}

export interface ProfitSummaryOwnersReport {
  id: number,
  name: string,
  percentage: number,
  amount: number,
}



export interface ProfitSummaryReport {
  income: ProfitSummaryIncomeExpensesReport[];
  expenses: ProfitSummaryIncomeExpensesReport[];
  owners: ProfitSummaryOwnersReport[];
}
export class FixedTrainerCommissionReportFilter {
  membershipPaymentDateFrom: string;
  membershipPaymentDateTo: string;
  membershipStartDateFrom: string;
  membershipStartDateTo: string;
  membershipEndDateFrom: string;
  membershipEndDateTo: string;
  trainerId: number;
  fixedPercentage: number;

  constructor() {
    const format1 = "YYYY-MM-DD";
    const today = new Date();
    const firstDayInMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    this.membershipPaymentDateFrom = moment(firstDayInMonth).format(format1) + 'T00:00';
    this.membershipPaymentDateTo = moment(lastDayInMonth).format(format1) + 'T23:59';

    // this.membershipEndDateFrom = moment(firstDayInMonth).format(format1) + 'T00:00';
    // this.membershipEndDateTo = moment(lastDayInMonth).format(format1) + 'T23:59';
  }
}

export class FreePrivateTrainingReport {
  freePrivateTrainingSummary: freePrivateTrainingSummary[];
  freePrivateTraining: IFreePrivateTraining[];
}

export class freePrivateTrainingSummary {
  trainerName: string;
  totalAssigned: number;
  newCount: number;
  renewCount: number;
  referralCount: number
}

export class InstructorDueAmountGrouped {
  fromDate: any;
  toDate: any;
  skipCount?: number;
  takeCount?: number;
  instructorId?: number;
  constructor(fromDate: any, toDate: any) {
    this.fromDate = fromDate;
    this.toDate = toDate;
  }
}

export interface IInstructorDueAmountGrouped {
  instructorId: number,
  instructorName: string,
  classesCount: number,
  instructorDueAmount: number,
  isWithoutMembership: boolean
}
export interface IInstructorDueAmountGroupedByClasses {
  classId: number;
  classTypeId: number;
  classTypeName: string;
  classStartDate: string; // Consider using Date if you plan to work with Date objects
  classEndDate: string;   // Consider using Date if needed
  instructorRate: number;
  isPercentage: boolean;
  membersCount: number;
  instructorId: number;
  instructorName: string;
  instructorDueAmount: number;
  isWithoutMembership: boolean;
}

export interface IChangeClassRate {
  classId: number,
  rate: number,
  isPercentage: boolean
}

export interface IPackageUtilizationReport {
  gender: number;
  genderName: string | null;
  packageId: number;
  periodEnglishName: string;
  periodArabicName: string | null;
  utilization: number;
  totalCashAmount: number;
  totalVisaAmount: number;
}
