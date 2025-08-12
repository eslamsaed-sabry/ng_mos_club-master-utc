import { Redirection, Theme } from "./enums";
import moment from 'moment';
export interface HttpResponseDTO<T> {
  data: T[] | any;
  message: string;
  statusCode: number;
  totalCount: number;
}


export interface SearchConfig {
  placeholder: string;
  redirectionType: Redirection;
  theme: Theme;
  parentClass?: string;
}



export interface IPermission {
  isAllowed: boolean
  pageID: number;
  ctrlID: number;
  controlName: string;
  controlDevName: string;
  pageName: string;
  devName: string;
  roleID: number;
}

export interface IRole {
  id: number,
  nameEng: string,
  nameAr: string
}

export interface IGymImage {
  id: number,
  symobl: string,
  displayName: string,
  imagePath: string,
  redirectUrl: string,
  showOrder: number,
}

export interface IMemberPhotoDialog {
  confirmedPhoto: string,
  newPhoto: string,
  memberId: number;
}

export interface ICountryCode {
  id: number,
  displayName: string,
  startWith: string,
  lengths: number
}

export interface ILookUp {
  id: number,
  name: string,
  isActive: boolean,
  viewOrder: number,
  colorHex: string,
  moreDetailsLink?:string,
  imagePath: string,
  description: string,
  isReferral: boolean,
  programId?:number,
  genreId?:number,
}


export interface Task {
  name: string;
  completed: boolean;
  color: any;
  subtasks?: Task[];
  value?: any;
}

export interface WeekDayPlanner {
  id: number,
  key: string,
  status: boolean,
  startTime: string | null,
  endTime: string | null,
  isStartTime: boolean,
  isEndTime: boolean
}

export interface WeekPlanner {
  isSaturday: boolean,
  saturdayStartTime: string | null,
  saturdayEndTime: string | null,
  isSunday: boolean,
  sundayStartTime: string | null,
  sundayEndTime: string | null,
  isMonday: boolean,
  mondayStartTime: string | null,
  mondayEndTime: string | null,
  isTuesday: boolean,
  tuesdayStartTime: string | null,
  tuesdayEndTime: string | null,
  isWednesday: boolean,
  wednesdayStartTime: string | null,
  wednesdayEndTime: string | null,
  isThursday: boolean,
  thursdayStartTime: string | null,
  thursdayEndTime: string | null,
  isFriday: boolean,
  fridayStartTime: string | null,
  fridayEndTime: string | null,
}

export interface UserNotificationFilters {
  userId: number,
  isSeen?: boolean | null,
  isVisited?: boolean | null,
  skipCount: number,
  takeCount: number
}

export interface IUserNotification {
  id: number,
  userId: number,
  userName: string,
  typeId: number,
  typeName: string,
  contextId: number,
  details: number,
  creationDate: Date,
  isSeen: boolean,
  isVisited: boolean,
  batchId: number
}

export interface IUserNotificationType {
  icon: string,
  url: string,
  textColorClass: string
}

export class UserRemindersFilters {
  memberId: number;
  reminderDateFrom: string;
  reminderDateTo: string;
  createdTo: number;
  skipCount: number;
  takeCount: number;
  includeReminders: boolean;
  notDismissedOnly: boolean;
  includeExpired: boolean;
  includeDebtors: boolean;
  includeNotActive: boolean;
  includePeriodicalFollowUp: boolean;
  includeBirthdays: boolean;
}
export class SalesScheduleFilters {
  forUserId: number;
  trainerId: number;
  fromDate: any;
  toDate: any;
  memberId: number;
  includeReminders: boolean = true;
  notDismissedOnly: boolean = true;
  includeExpired: boolean = true;
  includeDebtors: boolean = true;
  includeNotActive: boolean = true;
  includePeriodicalFollowUp: boolean = true;
  includeBirthdays: boolean = true;
  includePTSessions: boolean = true;
  constructor() {
    this.fromDate = moment().clone().startOf('month').format();
    this.toDate = moment().clone().endOf('month').format();
  }
}
export class TrainerScheduleFilters {
  forUserId: number;
  trainerId: number;
  fromDate: any;
  toDate: any;
  memberId: number;
  includeReminders: boolean = true;
  notDismissedOnly: boolean = true;
  includeExpired: boolean = true;
  includeDebtors: boolean = true;
  // includeNotActive: boolean = true;
  includePeriodicalFollowUp: boolean = true;
  // includeBirthdays: boolean = true;
  includePTSessions: boolean = true;
  constructor() {
    this.fromDate = moment().clone().startOf('month').format();
    this.toDate = moment().clone().endOf('month').format();
  }
}

export class TrainerTimeTableFilters {
  fromDate: any;
  toDate: any;
  employeeId?: number;
  constructor() {
    this.fromDate = moment().clone().startOf('month').format();
    this.toDate = moment().clone().endOf('month').format();
  }
}

export interface ISalesSchedule {
  contextId: number,
  contextTypeId: number,
  happeningDate: Date,
  summary: string,
  memberId: number,
  memberName: string,
  colorHex: string
}
export interface ITrainerSchedule {
  contextId: number,
  contextTypeId: number,
  happeningDate: Date,
  summary: string,
  memberId: number,
  memberName: string,
  colorHex: string,
  trainerId: number
}

export interface ITrainerTimeTableSchedule {
  id: number,
  startDate: Date,
  endDate: Date,
  employeeId: number
  employeeName: string,
  typeId: number
  typeName: string,
  memberId: number,
  memberName: string,
  colorHex: string,
}

export interface IDeleteAvailableSlots {
  fromDate: any,
  toDate: any,
  trainerId: number,
  isForDoctors: boolean,
}

export interface IUserReminder {
  id: number,
  memberId: number,
  memberName: string,
  reminderDate: any,
  notes: string,
  isDismissed: boolean,
  creationDate: Date,
  createdBy: number,
  username: string,
  createdTo: number,
  createdToUsername: string
}

export class TrainerSlotForm {
  id: number;
  startDate: any;
  endDate: any;
  happeningDate: any;
  durationInMinutes: number;
  trainerId: number;
  contextId: number;
  capacity: number;
  minBookingCancellationMinutes: number;
  repeatCount: number;
}

export class TrainersTimeTableSlotForm {
  id: number;
  startDate: any;
  durationInMinutes: number;
  employeeId: number;
  typeId: number;
  memberId: number;
  memberName: string;
}

export interface ISalesDashboard {
  wholeTarget: ISalesWholeTarget,
  salesSummary: ISalesSummary[]
}

export interface ITrainerDashboard {
  wholeTarget: ISalesWholeTarget,
  summary: ISalesSummary[]
}

export interface ISalesDayByDay {
  employeeId: number,
  atDate: string,
  actualValue: number,
  salesPerOperation: string,
  salesPerPackage: string,
  membershipsCount: number,
  debtsCount: number,
  studioMembershipsCount: number,
  upgradeCount: number,
  sessionsCount: number,
  downgradeCount: number,
  refundCount: number
}

export interface ISalesWholeTarget {
  actualValue: number,
  target: number,
  reachedPercentage: number
}

export interface ISalesSummary extends ISalesWholeTarget, ITrainerSummary {
  salesPersonId: number,
  salesPersonName: string,
  periodId: number,
  periodName: string,
  count: number,
  newActualValue: number,
  renewActualValue: number,
  duePercentage: number,
  renewDuePercentage: number,
  fullPercentages: string,
  dueValue: number,
  atDate: string,
  salesDayByDay: ISalesDayByDay[],
  totalSalesPerOperation: string,
  totalSalesPerPackage: string
}

export interface ITrainerSummary {
  employeeId: number,
  employeeName: string
}
export interface INotificationTemplate {
  id: number,
  symbol: string,
  englishDescription: string,
  arabicDescription: string,
  template: string,
  isActive: boolean,
  isWhatsUp: boolean,
  isMobileApp: boolean,
  isSMS: boolean,
  availableData: string,
}

export interface ISalesDashboardFilters {
  fromDate: any,
  toDate: any,
  salesIds: number[],
  isNewRenewCalculations: boolean,
  finalApprovedOnly: boolean
}

export interface IDashboardChartFilters extends ISalesDashboardFilters {
  trainersIds: number[]
}
export interface IBrand {
  darkLogoPath: string,
  lightLogoPath: string,
  name: string,
  shortLogo: string,
  reportLogo: string,
  syncfusionLicenseKey: string
}

export interface IBranch {
  id: number,
  isActive: boolean,
  name: string,
  viewOrder: number,
  colorHex: string,
  showFollowUpDate: string,
  imagePath: string,
  description: string
}

export interface IAllowedBranche {
  id: number,
  isActive: boolean,
  name: string,
  viewOrder: number,
  colorHex: string,
  showFollowUpDate: string,
  imagePath: string,
  description: string,
  isAllowed: boolean;
}

export interface IMemberVisit {
  memberId: number;
  memberName: string;
  phoneNo: string;
  photo: string;
  confirmedPhoto: string;
  gender: number;
  genderName: string;
  membershipId: number;
  packageId: number;
  packageName: string;
  startDate: string;
  expirationDate: string;
  color: string;
  statusCode: number;
  status: string;
  colorHex: string;
  visits: IVisit;
}

export interface IVisit {
  id: number;
  name: string;
  arabicName: string;
  symbol: string;
  count: number;
  consumedCount: number;
  showClassesList: boolean;
  monitoringTypeId: number | null;
  staffType: number;
  showCount: boolean;
  isBookingEnabled: boolean;
}

export interface IBenefitSession {
  id?: number,
  attendanceDate: string | Date,
  monitoringMembershipId?:number,
  staffMemberId?: number,
  rateId?: number,
  membershipId: number,
  monitoringTypeId?: number,
  benfitId?: number,
  isReviewed?: boolean,
  count?: number,
  note?: string
}

export interface IAddVisit {
  id: number;
  sessionDate: string;
  trainerId: number | null;
  trainerName: string | null;
  staffMemberId: number | null;
  staffMemberName: string | null;
  membershipId: number;
  monitoringTypeId: number | null;
  monitoringTypeName: string | null;
  benfitId: number;
  benfitName: string | null;
  rateId: number | null;
  rateName: string | null;
  isReviewed: boolean;
  isApproved: boolean;
  approvedStatus: string;
  approvedDate: string | null;
  athleticId: number | null;
  memberName: string | null;
  memberPhone: string | null;
  memberContractNo: string | null;
  count: number;
  note: string | null;
  sessionDateAsString: string;
  creationDate: string;
  canDelete: boolean;
}
