import { extend } from "lodash-es"
import { PageID, RangePercentageSymbol, StaffTypes } from "./enums"

export interface IAnnouncement {
  id: number,
  title: string,
  description: string,
  showDate: Date,
  usersIds: number[]
}

export interface dialogAnnouncementData {
  type: string,
  announcement: IAnnouncement
}

export interface dialogNewsData {
  type: string,
  news: INews,
  utilityType: PageID,
  pageName: string
}
export interface IRange {
  id: number,
  rangeFrom: number,
  rangeTo: number,
  range: string
}

export interface IDialogRange {
  actionType: string;
  range: IRange,
  symbol: RangePercentageSymbol
}

export interface ISessionType {
  id: number,
  englishName: string,
  arabicName: string,
  symbol: string,
  isActive: boolean,
  price: number,
  incomeTypeId: number,
}

export interface IGymRule {
  id: number,
  englishDescription: string,
  arabicDescription: string,
  showOnMobileApp: boolean,
  showOnReceipt: boolean,
  showOnPTReceipt: boolean,
  subRules: any[],
  title: string
}

export interface IExpensesType {
  id: number,
  nameEng: string,
  nameAR: string,
  viewOrder: number
}

export interface IBenefitsType {
  id: number,
  name: string,
  arabicName: string,
  symbol: string,
  count: number,
  consumedCount: number,
  showStaffList: boolean,
  showClassesList: boolean,
  monitoringTypeId: number,
  staffType: StaffTypes
}

export interface IRangePercentage {
  staffMemberId: number,
  staffMemberName: string,
  percentageMonth: number,
  percentageYear: number,
  percentages: IPercentage[],
  concatenatedPercentages: string;
  fullDate: Date;
}

export interface IPercentage {
  staffMemberId: number,
  percentageMonth: number,
  percentageYear: number,
  rangeFrom: number,
  rangeTo: number,
  range: string,
  duePercentage: number,
  renewDuePercentage: number;
}

export class RangePercentageFilter {
  staffMemberId: number;
  symbol: RangePercentageSymbol = RangePercentageSymbol.SALES_PERSON;
  month: number;
  year: number;
  fullDate: Date = new Date();
  skipCount: number;
  takeCount: number;
}

export interface dialogRangePercentageData {
  type: string;
  symbol: RangePercentageSymbol,
  percentage: IRangePercentage
}

export interface ITarget {
  id: number,
  staffMemberId?: number,
  staffMemberName: string,
  targetMonth: number,
  targetYear: number,
  targetValue: number,
  fullDate?: any
}

export interface IDialogTarget {
  actionType: string;
  target: ITarget,
  symbol: RangePercentageSymbol
}

export class newsFilters {
  typeId: number;
  skipCount: number;
  takeCount: number
}

export interface INews {
  id: number,
  typeId: number,
  typeNameEng: string,
  typeNameAr: string,
  newsTitle: string,
  newsDescription: string,
  imagePath: string,
  creationDate: Date,
  eventDate: Date,
  eventDateAsString: string,
  isImageChanged: boolean,
  imageBase64: string,
  imageName: string,
  enableBooking?: boolean
}
export interface INewsTypes {
  id: number,
  nameEng: string,
  nameAr: string,
  symbol: string,
}

export interface IPageField {
  id: number;
  pageId: number;
  fieldDevName: string;
  fieldEnglishName: string;
  fieldArabicName: string;
  displayName: string;
  isMandatory: boolean
}


export class MachinesFilters {
  machineId: number;
  machineName: string;
  locationId: number;
  modelId: number;
  skipCount: number;
  takeCount: number
}

export interface IMachine {
  id: number,
  machineName: string,
  locationId: number,
  locationName: string,
  modelId: number,
  modelName: string,
  isNew: boolean,
  purchaseDate: Date,
  purchasePrice: number
}

export interface dialogMachineData {
  machine?: IMachine;
  type: string;
}

export interface IFAQ {
  id: number,
  question: string,
  answer: string,
  viewOrder: number
}

export interface dialogFAQData {
  faq?: IFAQ;
  type: string;
}

export interface IExercise {
  id: number,
  exerciseName: string,
  workoutTypeId: number,
  workoutTypeName: string,
  imagePath: string,
  videoLink: string,
}

export interface dialogExerciseData {
  exercise?: IExercise;
  type: string;
}
export interface dialogWorkoutMemberData {
  workout: IWorkOut;
  type: string;
}
export interface dialogWorkoutExerciseData {
  workout: IWorkOut;
  exercise?: IWorkOutExercise;
  type: string;
}

export interface IWorkOut {
  id: number,
  workoutTitle: string,
  trainerId: number,
  trainerName: string,
  creationDate: string,
  createdBy: number,
  createdByName: string
}

export interface IWorkOutExercise {
  id: number,
  workoutId: number,
  workoutTitle: string,
  workoutTypeId: number,
  exerciseId: number,
  exerciseName: string,
  sets: number,
  reps: string,
  rest: number,
  isSeconds: boolean,
  notes: string
}

export interface IWorkOutMember {
  memberId: number,
  workoutId: number,
  assignedDate: string,
  assignedBy: number,
  assignedName: string,
  notes: string,
  memberContractNo: string,
  memberPhone: string,
  memberCode: string,
  memberName: string
}

export interface IWorkOutParams {
  id: number,
  workoutId: number,
  memberId: number,
  exerciseId: number,
  skipCount: number,
  takeCount: number
}

export interface IPackagesCommissionsMonths {
  month?: number,
  year?: number,
  name: string,
  userName: string,
  creationDate: string
  totalIncludedPackages: number,
  copyFromMonth?: number,
  copyFromYear?: number,
}

export interface dialogPackagesCommissionsMonthsData {
  packagesCommissionsMonths?: IPackagesCommissionsMonths;
  type: string;
}

export interface IpackagesCommissions {
  month?: number,
  year?: number,
  packageId: number,
  packageName: string,
  packageTypeId: number,
  salesPercentage: number
  trainerPercentage: number
  gymPercentage: number
  createdBy: number
  username: string,
  creationDate: string,
}

export interface dialogPackageCommissionData {
  packageCommission?: IpackagesCommissions;
  type: string;
}

export interface InstructorClassesPrice {
  classTypeId: number,
  classTypeName: string,
  instructorId: number,
  instructorName: number,
  rate: number,
  isPercentage: boolean
}

export interface dialogInstructorClassesPriceData {
  instructorId: number,
  classTypePrice: InstructorClassesPrice[];
}


export interface IClosingTransactions {
  id: number,
  startDate: string,
  endDate: string,
  totalCash: number,
  totalVisa: number,
  short_Over: number,
  creationDate: string,
  userName: string,
}

export interface IAddClosingTransactions {
  totalAmounts: number,
  amountInHand: number,
  to: string
}

export interface IAddClosingTransactionsData {
  fromDate: string,
  cashAmount: number,
  visaAmount: number,
  membershipsCount: number,
  monitoringMembershipsCount: number,
  sessionsCount: number,
  cafeteriaCount: number,
  debtsCount: number,
  upgradeCount: number,
  transferCount: number,
  freezeCount: number,
  reservationsCount: number,
  otherRevenuesCount: number,
  expensesCount: number,
  refundCount: number,
  downgradeCount: number,
  staffFinancialsCount: number
}

export interface dialogClosingTransactionsData {
  machine?: IClosingTransactions;
  type: string;
}

export interface ICallsFeedback {
  id: number,
  name: string,
  nameEng: string,
  showFollowUpDate: boolean,
  isSummaryMandatory: boolean,
  isActive: boolean,
  viewOrder: number,
  relatedMemberStatusId: string,
  relatedMemberStatusName: string,
}

export class CallsFeedbackFilters {
  skipCount: number;
  takeCount: number;

}

export interface IEventBooking extends INews {
  eventId: number,
  memberId: number,
  paymentDate: string,
  cashAmountPaid: number,
  visaAmountPaid: number,
  visaTypeId: number | null
}