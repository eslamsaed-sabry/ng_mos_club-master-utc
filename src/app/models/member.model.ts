import { IRole, ITrainerSchedule, ITrainerTimeTableSchedule, TrainerSlotForm, TrainersTimeTableSlotForm, WeekPlanner } from "./common.model";
import { Gender, MemberProfileTabs, PackageTypes, ReceiptTypes } from "./enums";
import { IMemberNotification, IMemberReferral } from "./reports.model";
import { ISchedule } from "./schedule.model";
import { IAuthorizedUser } from "./user.model";

export interface Member {
  id: any,
  countryCode: number,
  code: string,
  codePrefix: string,
  nameEng: string,
  nameAR: string,
  phoneNo: string,
  photo: string,
  currentPhotoName: string,
  photoFullPath: string,
  oldPhoto: string,
  isImageChanged: boolean,
  imagesFolderPath: string,
  gender: number,
  birthDate: any,
  isPossibleMember: boolean,
  assignedTo: number,
  email: string,
  joiningDate: Date,
  contactName: string,
  contactPhone: string,
  homeNumber: string,
  jobTitle: string,
  nationalityId: number,
  nationalityName: string,
  regionId: number,
  regionName: string,
  sourceOfKnowledgeId: number,
  preferredShiftId: number,
  preferredShiftName: string,
  teamId: number,
  nationalId: string,
  applicationNo: string,
  salesPersonId: number,
  salesName: string,
  comment: string,
  imageBase64: string | null,
  fingerprintTemplate: string,
  fingerprintTemplate_v1number: string,
  referralMemberId?: number,
  referralMemberName: string,
  referralStaffMemberId: number,
  isIncompleteData: boolean,
  isBlocked: boolean,
  history: string,
  membership: Membership,
  imagePath: string,
  sourceName: string,
  emergencyContactPhone: string,
  emergencyContactName: string,
  athleticAddress: string,
  isPhotoCaptured: boolean,
  isMemberChangedThePhoto: boolean,
  confirmedPhoto: string,
  phoneFormatId: number,
  mainBranchName: string,
  mainBranchId: number,
  levelId: number,
  goals: number[],
  suitSizeId: number,
  trainerId: number,
  trainerName: string,
  isOutsider: boolean
  creationDate: string;
  isHighPotential: boolean,
  attachmentsCount: number
}

export interface FullMember {
  membershipMatchedData: MembershipMatchedData;
  memberships: Membership[];
  monitoringMemberships: any[];
  notes: Note[];
  personalData: Member;
  show: boolean;
}

export interface MembershipMatchedData {
  membershipId: any,
  packageName: string,
  startDate: string,
  expirationDate: string,
  startDateAsString: string,
  expirationDateAsString: string,
  debts: number,
  anyLateDebts: boolean,
  color: string,
  statusCode: number,
  status: string,
  isAllowedToEnter: boolean,
  message: string,
  messageType: number,
  messageColor: string,
  isTodayTheBirthdate: boolean,
  warning: string,
  remainingDays: number,
  benfits: Benefit[],
  classMessage: string,
  memberMessage: string,
  ptMessage: string
}

export class IMembershipFilters {
  id?: number;
  memberId?: number;
  sourceOfKnowledgeId?: number;
  paymentDateFrom?: string;
  paymentDateTo?: string;
  endFromDate?: string;
  endToDate?: string;
  excludeExpired?: boolean;
  startFromDate?: string;
  startToDate?: string;
  installmentId?: number;
  debtFromDueDate?: string;
  debtToDueDate?: string;
  settlementFrom?: string;
  settlementTo?: string;
  paymentStatus?: number;
  packageType?: number;
  upgradeDeadlineFromDate?: string;
  upgradeDeadlineToDate?: string;
  includeDiscountOnly?: boolean
}
export class MemberFilters extends IMembershipFilters {
  applicationNo?: string;
  code?: string;
  name?: string;
  phoneNo: string;
  BirthDateFrom?: string;
  BirthDateTo?: string;
  LastTransferDateFrom?: string;
  LastTransferDateTo?: string;
  fromDate?: string;
  toDate?: string;
  gender: string;
  salesPersonId: string;
  coachId: number;
  packageId: number;
  packageCategory: number;
  status: string;
  memberName: string;
  accessCode: string;
  contractNo: string;
  isPossibleMember: boolean;
  StartFromDate?: string;
  StartToDate?: string;
  skipCount?: number;
  takeCount?: number;
  photoChangedOnly: boolean;
  showSuccessToastr?: string;
  showSpinner?: string;
  searchKeyWord: string;
}

export class PotentialMemberFilters {
  id: number;
  salesPersonId: number;
  name: string;
  nationalId: string;
  guestCardNumber: string;
  phone: string;
  fromDate: Date;
  toDate: Date;
  lastTransferDateFrom: Date;
  lastTransferDateTo: Date;
  comment: string;
  sourceId: number;
  skipCount?: number;
  takeCount?: number;
  isPossibleMember: boolean = true;
  isHighPotentialOnly: boolean;
}

export interface IPossibleMember {
  id: number,
  nameEng: string,
  nameAR: string,
  phoneNo: string,
  athleticAddress: string,
  gender: number,
  birthDate: any,
  salesPersonId: number,
  salesPerson: string,
  sourceOfKnowledgeId: number,
  sourceName: string,
  lastCall: string,
  joiningDate: any,
  comment: string,
  referralMemberId?: number,
  referralMemberName?: string,
  referralStaffMemberId: number,
  nationalId: string,
  userName: string,
  guestCardNumber: string,
  history: string,
  address: string,
  email: string,
  isPossibleMember: boolean,
  phoneFormatId: number,
  isHighPotential: boolean,
}

export class FullMemberInfo implements IProfileCounts {
  totalMembershipsCount: number;
  totalSessionsCount: number;
  totalCallsCount: number;
  totalInvitationsCount: number;
  totalInviteesCount: number;
  totalTrainingNotes: number;
  totalNotesCount: number;
  totalAttendanceCount: number;
  totalCommunications: number;
  totalAttachments: number;
  totalClasses: number;
  totalConsumedPTSessions: number;
  totalReferrals: number;
  totalWallet: number;
  totalPayments: number;
  calls: any[] = [];
  invitations: any[] = [];
  invitees: Invitee[] = [];
  memberships: Membership[] = [];
  communications: IMemberNotification[] = [];
  referral: IMemberReferral[] = [];
  notes: Note[] = [];
  trainingNotes: Note[] = [];
  personalData: Member;
  sessions: any[] = [];
  attendance: any[] = [];
  classes: ISchedule[] = [];
  ptSessions: IPTSession[];
  wallet: IWallet[];
  walletBalance: number;
  payments: IPayments[];

}

export interface IProfileCounts {
  totalMembershipsCount: number,
  totalSessionsCount: number,
  totalCallsCount: number,
  totalInvitationsCount: number,
  totalInviteesCount: number,
  totalTrainingNotes: number,
  totalNotesCount: number,
  totalAttendanceCount: number,
  totalCommunications: number,
  totalAttachments: number,
  totalClasses: number,
  totalConsumedPTSessions: number,
  totalReferrals: number,
  totalWallet: number,
  totalPayments: number,
}
export interface ISessionPrint {
  attendance: ISessionAttendance[],
  membership: Membership
}

interface ISessionAttendance {
  attendanceDate: Date
}
export class Membership implements WeekPlanner {
  accessCode: string;
  additionalDays: number;
  amountPaid: number;
  amountPaidVisa: number;
  anyLateDebts: boolean;
  attendance: string;
  attendanceCount: number;
  attendedTimes: number;
  birthDate: string;
  coachId: number;
  coachName: string;
  contractNo: string;
  creationDate: string;
  debts: number;
  discount: number;
  enteranceFrom: string;
  enteranceTo: string;
  expirationDate?: Date;
  expirationDateAsString: string;
  gender: number;
  id: number;
  imageName: string;
  isDiscountPercentage: boolean;
  discountByAmount: number;
  isExceededDurationForUpgrade: boolean;
  isFirstMembership: boolean;
  isTheMatchedMembership: boolean;
  isTransfered: string;
  memberArabicName: string;
  memberEnglishName: string;
  memberId: number;
  minFreeze: number;
  nextInstallmentDueDate: string;
  nextDueDate: Date;
  notes: string;
  offerName: string;
  overDays: number;
  packageId: number;
  periodId: number;
  packageImagePath: string;
  packageName: string;
  packageCategory: number = 0;
  packageTypeId: number;
  paymentDate: any;
  paymentDateAsString: string;
  phoneNo: string;
  price: number;
  priceBeforeDiscount: number;
  receiptNo: string;
  remainingMoney: number;
  remark: string;
  salesName: string;
  salesPersonId: any;
  sourceOfKnowledgeId: number;
  startDate: string;
  startDateAsString: string;
  status: number;
  statusName: string;
  totalAmountPaid: number;
  totalAmountRemaining: number;
  totalFreezedDays: number;
  upgradeDeadline: string;
  userName: string;
  validDurationForUpgrade: string;
  visaNo: number;
  visaTypeId: number;
  wholeAmountPaid: number;
  benfitList: Benefit[];
  history: any;
  receiptType: ReceiptTypes;
  nationalId: string;
  systemReceiptNoWithLetters: string;
  comment: string;
  sessionsCount: number;
  isSaturday: boolean;
  saturdayStartTime: string | null;
  saturdayEndTime: string | null;
  isSunday: boolean;
  sundayStartTime: string | null;
  sundayEndTime: string | null;
  isMonday: boolean;
  mondayStartTime: string | null;
  mondayEndTime: string | null;
  isTuesday: boolean;
  tuesdayStartTime: string | null;
  tuesdayEndTime: string | null;
  isWednesday: boolean;
  wednesdayStartTime: string | null;
  wednesdayEndTime: string | null;
  isThursday: boolean;
  thursdayStartTime: string | null;
  thursdayEndTime: string | null;
  isFriday: boolean;
  fridayStartTime: string | null;
  fridayEndTime: string | null;
  branchId: number;
  doctorId: number;
  trainerFixedPercentage: number;
  trainerDueAmountForFixedPercentage: number;
}

export interface Benefit {
  id: number;
  name: string;
  arabicName: string;
  symbol: string;
  count: number;
  consumedCount: number;
  showStaffList: boolean;
  showClassesList: boolean;
  monitoringTypeId: number;
  staffType: number;
}


export const PackageTypesArray = [
  { label: 'members.regular', value: PackageTypes.GYM },
  { label: 'members.private', value: PackageTypes.PRIVATE },
  { label: 'members.medical', value: PackageTypes.MEDICAL },
  { label: 'members.other', value: PackageTypes.OTHER }
]

export interface IPackage extends WeekPlanner {
  attendanceCount: number;
  duration: number;
  enteranceFrom: string;
  enteranceTo: string;
  externalId: number;
  id: number;
  imagePath: string;
  isActive: boolean;
  isDays: boolean;
  isSystemPackage: boolean;
  minFreeze: number;
  nameAR: string;
  nameEng: string;
  packageCategory: number;
  packageTypeId: number;
  incomeTypeId: number;
  price: number;
  minPrice: number;
  showToMembers: boolean;
  validDurationForUpgrade: number;
  benfitList: Benefit[];
  imagePath1: string,
  classes: number[],
  programs: number[],
  availabilityFrom: any,
  availabilityTo: any,
  maxClassesReservationPerDay: number,
  branchesIds: number[],
  areasIds: number[],
  description: string,
}
// export interface PackageBenefit {
//   invitations: number;
//   freeze: number;
//   fitness: number;
//   pt: number;
//   nutrition: number;
//   freeDays: number;
//   massage: number;
//   inBody: number;
// }

export interface CallMember {
  id: number,
  memberId: number,
  memberPhoneNo: string,
  memberName: string,
  source: number,
  sourceName: string,
  callDate: any,
  reasonId: number,
  reasonName: string,
  feedbackId: number,
  feedbackName: string,
  followUpDate: any,
  summary: string,
  createdBy: number,
  userName: string,
  creationDate: string,
  modificationDate: string,
  snoozeMinutes: number,
  isHighPotential: boolean,
}

export interface Invitee {
  id: number;
  membershipId: number;
  inviteeId: number;
  inviteeNameEng: string;
  inviteeNameAR: string;
  inviteePhone: string;
  inviteeNationalId: string;
  salesPersonId: number;
  gender: number;
  memberId: number;
  memberContractNo: string;
  memberAccessCode: string;
  memberPhoneNumber: string;
  memberName: string;
  guestId: number;
  guestGender: number;
  guestEnglishName: string;
  guestArabicName: string;
  guestPhoneNumber: string;
  creationDate: string;
  username: string;
  salesName: string;
  phoneFormatId: number;
  numberOfDays: number;
  isConfirmedByGym: boolean;
}

export interface Note {
  id: number;
  note: string;
  memberId: number;
  memberName: string;
  importanceTypeId: number;
  importanceTypeName: string;
  isDismissed: boolean;
  dismisseBy: number;
  dismisseByUserName: string;
  creationDate: string;
  createdBy: number;
  createdByUserName: string;
  isDeleted: boolean;
  deletedBy: number;
  deletedByUserName: string;
  deletionDate: string;
  isTrainingNote: boolean;
  reminderDate: any;
}

export interface dialogMemberData {
  type: string;
  memberData: Member;
  selectedTab: string;
}
export interface dialogRoleData {
  type: string;
  role: IRole;
}
export interface dialogUserData {
  type: string;
  user: IAuthorizedUser;
}
export interface dialogPossibleMemberData {
  type: string;
  memberData: IPossibleMember | Member;
}
export interface dialogMemberReminder {
  type: string;
  memberData: IPossibleMember | Member;
  dataType: 'MEMBER' | 'POSSIBLE_MEMBER';
  showSearch: boolean;
  reminderDate: any
}
export interface dialogTrainerSlot {
  type: string;
  scheduleType: string;
  slotData?: TrainerSlotForm;
  slotDate: any,
  trainerId?: number
}
export interface dialogTrainersTimeTableSlot {
  type: string;
  slotData?: TrainersTimeTableSlotForm;
  employeeId?: number
}
export interface dialogTrainerSlotMember {
  slotData: ITrainerSchedule
}
export interface dialogMembershipData {
  type: string;
  membership: Membership;
}
export interface IChangeSalesDialog {
  type: 'salesPerson' | 'trainer';
  id: number;
  membershipId?: number;
  isBulk?: boolean;
  entityType?: 'member' | 'potential';
  membersID?: number[]
}

export interface dialogMemberCallData {
  call: CallMember;
  type: string;
  memberData: Member;
  showSearch: boolean;
}

export interface dialogMemberInvitationData extends dialogMemberData {
  membershipId: number,
  invitation: Invitee,
  hideSales: boolean,
  rotateInvitation: boolean,
}
export interface dialogMemberFreezeData extends dialogMemberData {
  membership: Membership;
  freeze: Freeze;

}

export interface dialogMemberAttendanceData extends dialogMemberData {
  attendance: Attendance;
  membership: Membership;
  memberData: Member
}
export interface dialogMemberSessionData extends dialogMemberData {
  session: Session;
  membership: Membership;
  memberData: Member;
}
export interface dialogPackageData {
  type: string;
  package: IPackage
}
export interface dialogMemberBenefitsSessionData extends dialogMemberData {
  session: BenefitSession;
  membershipId: number,
  benefit: Benefit
}


export interface dialogMemberNoteData extends dialogMemberData {
  note: Note
}

export interface dialogMemberInstallmentData extends dialogMemberData {
  installment: Installment
}

export interface Attendance {
  id: number,
  attendanceDate: any,
  creationDate: any,
  attendanceApprovedDate: any,
  membershipId: number,
  attendanceDateAsString: string,
  memberId: number,
  contractNo: string,
  accessCode: string,
  phoneNumber: string,
  gender: number,
  englishName: string,
  arabicName: string,
  userName: string,
  startDate: string,
  endDate: string,
  package: string,
  packageCategory: number,
  isDeleted: boolean,
  salesPersonId: number,
  debts: number,
  salesPersonName: string,
  packageImagePath: string,
  imageName: string,
  status: number,
  statusName: string,
  anyLateDebts: boolean,
  isUpcomingReservation: boolean,
  checkOutDate: string,
  rateName: string
  attendanceApproveStatus: string
}

export class AttendanceFilters {
  fromDate?: Date;
  toDate?: Date;
  memberId?: number;
  memberContractNo?: string;
  memberCode?: string;
  memberPhone?: string;
  memberName?: string;
  membershipId?: number;
  includeDeleted?: boolean;
  gender?: number;
  salesPersonId?: number;
  skipCount?: number;
  takeCount?: number;
  userId?: number;
  id?: number
}

export interface Session {
  sessionId: number;
  memberId: number;
  memberContractNo: string;
  memberCode: string;
  gender: number;
  memberName: string;
  name: string;
  phone: string;
  type?: string;
  sessionDate: any;
  price: number;
  cashAmount: number;
  visaAmount: number;
  systemReceiptNo: number;
  systemReceiptNoWithLetters: string;
  receiptNo: string;
  salesPersonName: string;
  userId: number;
  userName: string;
  typeId: number;
  isCash: boolean;
  isDeleted: boolean;
  salesPersonId: number;
  visaTypeId?: number;
  isApproved: boolean;
  isFinalApproved: boolean;
  approveStatus: number;
  receiptType: ReceiptTypes;
  phoneFormatId: number;
  branchId: number;
}
export interface BenefitSession {
  benfitId: number;
  id: number;
  isReviewed: boolean;
  membershipId: number;
  monitoringTypeId: number;
  monitoringTypeName: string;
  rateId: number;
  rateName: string;
  sessionDate: Date;
  trainerId: number;
  trainerName: string;
  staffMemberId: any;
  salesPersonId: number;
  approvedStatus: string;
  creationDate: Date;
  approvedDate: Date;
}

export interface IPTSession {
  sessionId: number,
  isPrePaid: boolean,
  type: number,
  typeName: string,
  sessionDate: string,
  isApproved: boolean,
  approvedDate: string,
  statusName: string,
  statusColor: string,
  membershipId: number,
  packageId: number,
  packageName: string,
  startDate: string,
  expirationDate: string,
  memberId: number,
  contractNo: string,
  memberName: string,
  trainerId: number,
  trainerName: string,
  isValidToApprove: boolean,
  isValidToDelete: boolean,
  creationDate: string
}

export interface IWallet {
  amountAsString: string,
  notes: string,
  creationDate: string,
  createdByName: string,
}

export interface IPayments {
  paymentDate: string,
  cashAmount: number,
  nonCashAmount: number,
  totalAmount: number,
  details: string,
}

export interface DepositWithdrawIntoWallet {
  memberId: number,
  amount: number,
}



export interface Installment {
  id: number;
  membershipId: number;
  dueDate: any;
  dueDateAsString: string;
  amount: number;
  memberId: number;
  memberApplicationNo: string;
  memberCode: any;
  memberPhone: string;
  gender: number;
  memberName: string;
  creationDate: Date;
  createdBy: number;
  settlementDate: any;
  settlementDateAsString: string;
  paymentDate: any;
  paymentCreationDate: Date;
  isCash: boolean;
  paidBy: string;
  systemReceiptNo: string;
  systemReceiptNoWithLetters: string;
  receiptNo: string;
  periodId: number;
  periodName: string;
  packageId: number;
  packageName: string;
  membershipPaymentDate: Date;
  startDate: Date;
  endDate: Date;
  startDateAsString: string;
  endDateAsString: string;
  totalMembershipPrice: number;
  membershipAmountPaid: number;
  salesPersonId: number;
  salesPersonName: string;
  username: string;
  overAttendance: number;
  totalAttendance: number;
  lastAttendanceDate: Date;
  isMonitoringMembership: false;
  packageCategory: number;
  packageDuration: number;
  packageIsDays: boolean;
  prevData: any;
  isHeigherPackage: boolean;
  isApproved: boolean;
  isFinalApproved: boolean;
  approveStatus: number;
  nextDueDate: any;
  remainingAmount: number;
  visaTypeId: number;
  status: string;
  colorHex: string,
  receiptType: ReceiptTypes;
  coachName: string;
  branchId: number;

}

export interface Freeze {
  membershipId: number;
  noDays: number;
  atDate: string;
  amountPaid: number;
  paymentDate: string;
  comment: string
  createdBy: number;
  createdByMemberId: number;
  createdByMemberName: string;
  creationDate: string;
  freezeDate: string;
  freezeDateAsString: string;
  freezedDays: number;
  gender: number;
  id: number;
  memberAccessCode: string;
  memberContractNo: string;
  memberId: number;
  memberName: string;
  packageId: number;
  packageName: string;
  packageCategory: number;
  releaseDate: string;
  releaseDateAsString: string;
  userName: string;
  branchId: number;
  isMedical: boolean;
}

export interface CancelMembership {
  membershipId: number,
  amount: number,
  comment: string,
  refundDate: string,
  isCash: boolean,
  visaTypeId: number,
  reasonId: number,
  branchId: number,
}
export interface TransferMembership {
  membershipId: number,
  newMemberId: number,
  cashAmount: number,
  visaAmount: number,
  startDate: string,
  paymentDate: string,
  receiptNo: string,
  isTransferTheWholeMembership: boolean,
  visaTypeId: number,
  branchId: number,
}

export interface ChangeMoney {
  membershipId: number,
  price: number,
  cashAmountPaid: number,
  visaAmountPaid: number,
  visaTypeId: number
}


export class CallsFilters {
  memberId?: number;
  memberName?: string;
  phoneNo?: string;
  reasonId?: number;
  from?: Date;
  to?: Date;
  followUpFromDate: Date | string;
  followUpToDate: Date | string;
  userId: number;
  feedbackId?: number;
  isReminder: boolean;
  salesPersonId?: number;
  lastCallOnly?: boolean;
  source?: number;
  skipCount?: number;
  takeCount?: number;
}

export class DebtsTableFilters {
  id?: number;
  memberId?: number;
  contractNo?: string;
  accessCode?: string;
  phoneNo?: string;
  memberName?: string;
  gender?: number;
  sourceOfKnowledgeId?: number;
  packageId?: number;
  paymentDateFrom?: Date;
  paymentDateTo?: Date;
  endFromDate?: Date;
  endToDate?: Date;
  excludeExpired?: boolean;
  startFromDate?: Date;
  startToDate?: Date;
  installmentId?: number;
  salesPersonId?: number;
  debtFromDueDate?: Date;
  debtToDueDate?: Date;
  settlementFrom?: Date;
  settlementTo?: Date;
  paymentStatus?: number;
  status?: number;
  skipCount?: number;
  takeCount?: number;
  packageCategory?: number;
  coachId?: number;
  upgradeDeadlineFromDate?: Date;
  upgradeDeadlineToDate?: Date
}

export interface IMembershipUpgrade {
  id: number,
  membershipId: number,
  totalDifferance: number,
  amount: number,
  amountVisa: number,
  paymentDate: any,
  creationDate: Date,
  createdBy: number,
  memberId: number,
  memberContractNo: string,
  memberCode: string,
  memberName: string,
  memberPhoneNumber: string,
  gender: number,
  systemReceiptNo: number,
  systemReceiptNoWithLetters: string,
  receiptNo: string,
  salesPersonId: number,
  salesPersonName: string,
  username: string,
  packageId: number,
  packageName: string,
  prevPackageName: string,
  newPackageName: string,
  packageCategory: number,
  packageDuration: number,
  packageIsDays: boolean,
  prevData: string,
  isHeigherPackage: boolean,
  totalMembershipPrice: number,
  isApproved: boolean,
  isFinalApproved: boolean,
  approvedBy: string,
  finalApprovedBy: number,
  approvedDate: string,
  finalApprovedDate: Date,
  approveStatus: number,
  approvedByName: string,
  finalApprovedByName: string;
  receiptType: ReceiptTypes;
  branchId: number;
}

export interface IMembershipChangeStartDate {
  id: number,
  membershipId: number,
  newValue: any,
  notes: string,
  approvedDate: any,
  finalApprovedDate: any,
  approvedByUserName: string,
  finalApprovedByUserName: string,
  createdByUserName: string,
  status: string,
}

export interface dialogMembershipChangeStartDate {
  type: string;
  membership: Membership;
}

export class InvitationFilter {
  memberId?: number;
  memberCode?: string;
  memberPhone?: string;
  memberName?: string;
  fromDate?: Date;
  toDate?: Date;
  membershipId?: number;
  salesPersonId?: number;
  notMembersOnly?: boolean;
  memberContractNo?: string;
  inviteePhoneNo?: string;
  gender?: number;
  skipCount?: number;
  takeCount?: number;
  inviteeId: number;
}

export class CheckedInMembersFilters {
  memberContractNo: string;
  memberCode: string;
  memberPhone: string;
  memberName: string;
  gender: Gender;
  skipCount: number;
  takeCount: number
}

export interface MembershipPayment {
  cashAmount: number,
  contextId: number,
  contextTypeId: number,
  createdBy: number,
  createdByName: string,
  creationDate: string,
  description: string,
  paymentDate: string,
  visaAmount: number
}

export interface styleMemberAction {
  isButton: boolean;
  styleClass: string;
  color: string;
  iconName: string;
  mainTitle: string;
}

export interface ChangeEmployee {
  trainerId: number,
  salesPersonId: number,
  membershipId: number,
}

export interface dialogUpgradeData {
  type: string;
  upgrade: IMembershipUpgrade;
}

export interface UpgradeData {
  upgradeId: number;
  paymentDate: any;
}

export interface IProfileTabs {
  id: MemberProfileTabs,
  title: string,
  countKey: keyof IProfileCounts,
  isDisabled?: boolean,
  showTitle?: boolean,
}

export interface ChangeMembershipBranche {
  membershipId: number;
  branchesIds: number[];
}

export interface dialogChangePaymentBranchData {
  contextTypeId: number;
  contextId: number;
  branchId: number;
}

export interface ChangePaymentBranchData {
  contextTypeId: number;
  contextId: number;
  branchId: number;
}

export interface IMembershipReceipt {
  membershipId: number,
  memberId: number,
  memberContractNo: string,
  memberAccessCode: string,
  memberName: string,
  memberPhone: string,
  nationalID: string,
  packageId: number,
  packageName: string,
  paymentDate: string,
  startDate: string,
  expirationDate: string,
  discountAmount: number | null,
  price: number,
  amountPaidCash: number,
  amountPaidVisa: number,
  remainingAmount: number,
  visaTypeId: number | null,
  visaTypeName: string,
  nextDueDate: string | null,
  creationDate: string,
  createdBy: string,
  salesPersonName: string,
  systemReceiptNo: number,
  systemReceiptNoWithLetters: string,
  receiptNo: string | null,
  comment: string | null,
  coachName: string | null,
  benfitsInEnglish: string,
  benfitsInArabic: string,
  isDeleted: boolean,
  tax: number,
  priceAfterSubtractTax: number,
  receiptType: ReceiptTypes,
  receiptEndMessage: string,
  displayedFields: string,
  rules: IGymRule[]
}

export interface IGymRule {
  id: number,
  englishDescription: string,
  arabicDescription: string,
  title: string,
  showOnReceipt: boolean,
  showOnPTReceipt: boolean,
  showOnMobileApp: boolean,
  subRules: any
}

export interface IMedicalHistory {
  memberId: number,
  medicalHistory: IMedicalProblem[],
  notes: string
}

export interface IMedicalProblem {
  problemId: number,
  problemName: string,
  isMemberHaveThisProblem: boolean
}

export interface IBulkPotentialMembersUploadForm {
  phoneFormatId: number,
  sourceOfKnowledgeId: number,
  salesPersonId: number,
  gender: Gender,
  file: File | null,
  fileName: string | null
}
