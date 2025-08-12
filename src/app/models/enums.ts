import { IMedicalProblem } from "./member.model";

export enum AttachmentContextTypeId {
  MEMBERS = 1,
  EXPENSES = 2,
  STAFF = 3,
  INVITATION = 4,
  TrainerTransformations = 5,
  TASKS = 6,
}

export enum ContextType {
  MEMBERSHIP = 1,
  ATTENDANCE = 2,
  SESSION = 3,
  DRINK_FOOD = 4,
  INSTALLMENT = 5,
  UPGRADE = 6,
  RESERVATION = 7,
  TRANSFER = 8,
  DOWNGRADE = 9,
  FREEZE = 10,
  PRIVATE = 11,
  REFUND = 12,
  OTHERREVENUE = 13,
  EXPENSE = 14,
  STAFFFINANCIAL = 15,
}

export enum CardStyle {
  standard = 'STANDARD',
  horizontal = 'HORIZONTAL',
  compact = 'COMPACT'
}

export enum Gender {
  MALE = 1,
  FEMALE = 0
}

export enum DebtStatus {
  NOT_PAID = 0,
  PAYMENT_DONE = 1
}

export enum ReceiptTypes {
  SM_AR = 'Small_Arabic',
  SM_EN = 'Small_English',
  W_F = 'Wide_3',
  W_F_AR = 'Wide_3_Arabic'
}

export const RECEIPTS_TYPES = [
  { label: 'receipts.smallAR', value: ReceiptTypes.SM_AR },
  { label: 'receipts.smallEN', value: ReceiptTypes.SM_EN },
  { label: 'receipts.wideAR', value: ReceiptTypes.W_F_AR },
  { label: 'receipts.wideEN', value: ReceiptTypes.W_F }
]

export enum Redirection {
  Profile = 'PROFILE',
  Monitoring = 'MONITORING'
}

export enum Theme {
  Header = 'HEADER',
  Page = 'PAGE',
  Fixed = 'FIXED'
}

export enum LookupType {
  Nationalities = 1,
  Regions = 2,
  SourceOfKnowledge = 3,
  MembershipStatus = 4,
  Owners = 5,
  TreasuryTransactionTypes = 6,
  ComplaintStatus = 7,
  Priorities = 8,
  GymSections = 9,
  VisaTypes = 10,
  ClassesTypes = 11,
  JobTitle = 12,
  Sales = 13,
  Trainers = 14,
  Users = 15,
  Instructors = 16,
  CallFeedback = 17,
  ClassRoom = 18,
  ClassCancellationReasons = 19,
  MembershipCancellationReasons = 20,
  InterestPercentage = 21,
  Staff = 22,
  LocationsInsideGym = 24,
  LostCategory = 25,
  ExpensesTypes = 26,
  MachineModels = 27,
  PackageType = 28,
  Branches = 29,
  MemberLevel = 30,
  SuitSize = 31,
  MemberGoals = 32,
  WorkOutTypes = 33,
  MaintenanceTypes = 35,
  Doctors = 36,
  RelatedMemberStatus = 37,
  NumberOfDays = 38,
  PreferredShift = 39,
  ReservationTypes = 40,
  AccessAreas = 41,
  RequestType = 42,
  ClassGenres = 43,
  ClassPrograms = 44,
  RequestsTypes = 45,
  Teams = 46,
  IncomeType = 47,
}

export enum PackageTypes {
  ALL = -1,
  GYM = 1,
  PRIVATE = 2,
  OTHER = 3,
  MEDICAL = 4
}

export enum Accounts {
  DEDUCTIONS = 1,
  ADVANCES = 2,
  BONUS = 3,
  SALARIES = 4,
  EMPLOYEES_COMMISSIONS = 5,
}

export enum PageNames {
  MEMBER_FORM = 'MemberProfile',
  POTENTIAL_MEMBER = 'PossibleMembers'
}

export enum MembershipLogType {
  Create = 0,
  Edit = 1,
  Freeze = 2,
  Unfreeze = 3,
  Upgrade = 4,
  Downgrade = 5,
  Transfer = 6,
  Suspend = 7,
  Resume = 8,
  Cancel = 9,
  ChangeMoney = 10,
  DeleteAttempt = 11
}

export enum RangePercentageSymbol {
  SALES_PERSON = 'SalesPerson',
  COACH = 'Coach'
}

export enum PageID {
  NEWS = 1,
  EVENTS = 2,
  OFFERS = 3,
  DAILY_SCHEDULE = 4,
}

export enum RequiredFieldPage {
  POSSIBLE_MEMBERS = 'PossibleMembers',
  MEMBER_PROFILE = 'MemberProfile'
}

export enum DataListTypeName {
  CLASSES_TYPES = 'CLASSES_TYPES',
  GYM_SECTIONS = 'GYM_SECTIONS',
  SOURCES_OF_KNOWLEDGE = 'SOURCES_OF_KNOWLEDGE',
  OWNERS = 'OWNERS',
  NATIONALITIES = 'NATIONALITIES',
  REGIONS = 'REGIONS',
  VISA_TYPES = 'VISA_TYPES',
  JOB_TITLES = 'JOB_TITLES',
  CALL_FEEDBACKS = 'CALL_FEEDBACKS',
  CLASS_ROOMS = 'CLASS_ROOMS',
  CLASS_CANCELLATION_REASONS = 'CLASS_CANCELLATION_REASONS',
  MEMBERSHIP_CANCELLATION_REASONS = 'MEMBERSHIP_CANCELLATION_REASONS',
  INTEREST_PERCENTAGES = 'INTEREST_PERCENTAGES',
  LOST_CATEGORY = 'LOST_CATEGORY',
  LOCATIONS_INSIDE_GYM = 'LOCATIONS_INSIDE_GYM',
  MACHINE_MODELS = 'MACHINE_MODELS',
  EXPENSES_TYPES = 'EXPENSES_TYPES',
  PACKAGE_TYPE = 'PACKAGE_TYPE',
  MEMBER_LEVEL = 'MEMBER_LEVEL',
  MEMBER_GOALS = 'MEMBER_GOALS',
  SUIT_SIZE = 'SUIT_SIZE',
  WORKOUT_TYPES = 'WORKOUT_TYPES',
  MAINTENANCE_TYPES = "MAINTENANCE_TYPES",
  RESERVATION_TYPES = "RESERVATION_TYPES",
  CLASS_GENRES = "CLASSES_GENRES",
  CLASS_PROGRAMS = "CLASSES_PROGRAMS"
}

export enum ClassAttendanceStatus {
  All = 0,
  Booked = 1,
  WaitingList = 2,
  Attended = 3
}

export enum MemberGroup {
  NotRenewed = 1,
  WillExpire = 2,
  Debtors = 3,
  NotActive = 4
}

export enum GymConfig {
  gender = 'DefaultGender',
  contractNo = 'AutoGetNextMemberContractNo',
  receiptType = 'ReceiptType',
  receiptEndMsg = 'ReceiptEndMessage',
  AllowMultipleMembersBySamePhone = 'AllowMultipleMembersBySamePhone',
  AllowMultipleGymAttendancePerDay = 'AllowMultipleGymAttendancePerDay',
  AutoGetNextMemberContractNo = 'AutoGetNextMemberContractNo',
  DatabaseBackupPath = 'DatabaseBackupPath',
  SalesCommissionStartDay = 'SalesCommissionStartDay',
  AboutDescription = 'AboutDescription',
  GymAddress = 'GymAddress',
  GymPhoneNumbers = 'GymPhoneNumbers',
  ContactUsMapLocation = 'ContactUsMapLocation',
  LockersCount = 'LockersCount',
  ContactUsImagePath = 'ContactUsImagePath',
  AboutImagePath = 'AboutImagePath',
  AccessControlAPI = 'AccessControlAPI',
  DefaultMaxWaitingListCount = 'DefaultMaxWaitingListCount',
  PereferedTimeZone = 'PereferedTimeZone',
  MembershipReceiptDisplayedFields = 'MembershipReceiptDisplayedFields',
  RotateInvitation = 'RotateInvitation',
  EnableManualReceipts = 'EnableManualReceipts',
}

export const customEmojis = [
  {
    name: "grin",
    shortNames: ['custom'],
    text: ':-D',
    imageUrl: "assets/images/emoji/grinning-face.png",
  },
  {
    name: "smile",
    shortNames: ['custom'],
    text: ':-)',
    imageUrl: "assets/images/emoji/slightly-smiling-face.png",
  },
  {
    name: "thumbsUp",
    shortNames: ['custom'],
    text: '(y)',
    imageUrl: "assets/images/emoji/thumbs-up.png",
  },
  {
    name: "thumbsDown",
    shortNames: ['custom'],
    text: '(n)',
    imageUrl: "assets/images/emoji/thumbs-down.png",
  },
  {
    name: "kiss",
    shortNames: ['custom'],
    text: ':-*',
    imageUrl: "assets/images/emoji/face-blowing-a-kiss.png",
  },
  {
    name: "cry",
    shortNames: ['custom'],
    text: ":'(",
    imageUrl: "assets/images/emoji/crying-face.png",
  },
  {
    name: "dyLaughing",
    shortNames: ['custom'],
    text: '>_<',
    imageUrl: "assets/images/emoji/grinning-squinting-face.png",
  },
  {
    name: "wink",
    shortNames: ['custom'],
    text: ';-)',
    imageUrl: "assets/images/emoji/winking-face.png",
  },
  {
    name: "heart",
    shortNames: ['custom'],
    text: '<3',
    imageUrl: "assets/images/emoji/red-heart.png",
  }
];

export enum StaffTypes {
  NoShowStaffList = -1,
  AllStaff = 0,
  SalesPerson = 1,
  Trainer = 2,
  Doctor = 3,
}

export enum ClassesReports {
  CLASSES_TYPES_REPORT = 'classesTypesReport',
  HELD_CLASSES_REPORT = 'heldClassesReport',
  CLASSES_PER_INS_AND_TYPE_REPORT = 'classesPerInstructorAndTypeReport',
  CLASSES_BOOKING_LIST_REPORT = 'classesBookingListReport',
  CANCELED_CLASSES_REPORT = 'canceledClassesReport',
  MEMBER_RESERVATIONS_ON_CLASSES_REPORT = 'memberReservationsOnClassesReport',
  GYM_ATTENDACE_COUNT = 'GymAttendanceCount',
  INSTRUCTOR_DUE_AMOUNT = 'instructorDueAmount',
  OTHER_ENTITIES_BOOKINGS_REPORT = 'otherEntitiesBookings'
}



export enum MemberProfileTabs {
  ONE_PASS_SERVICE = 'ONE_PASS_SERVICE',
  MEMBERSHIP = 'MEMBERSHIP',
  UPGRADE = 'UPGRADE',
  FREEZE = 'FREEZE',
  DEBTS = 'DEBTS',
  CALLS = 'CALLS',
  INVITEES = 'INVITEES',
  INVITED_BY = 'INVITED_BY',
  TRAINING_NOTES = 'TRAINING_NOTES',
  NOTES = 'NOTES',
  ATTENDANCE = 'ATTENDANCE',
  NOTIFICATIONS = 'NOTIFICATIONS',
  CLASSES = 'CLASSES',
  ATTACHMENTS = 'ATTACHMENTS',
  PT_SESSIONS = 'PT_SESSIONS',
  MEMBER_REFERRALS = 'MEMBER_REFERRALS',
  MEMBER_Wallet = 'MEMBER_Wallet',
  PAYMENTS = 'PAYMENTS',
}

// export const MEDICAL_HISTORY_LIST: IMedicalProblem[] = [
//   { problemId: 1, isMemberHaveThisProblem: false, problemName: 'medicalHistory.problem1' },
//   { problemId: 2, isMemberHaveThisProblem: false, problemName: 'medicalHistory.problem2' },
//   { problemId: 3, isMemberHaveThisProblem: false, problemName: 'medicalHistory.problem3' },
//   { problemId: 4, isMemberHaveThisProblem: false, problemName: 'medicalHistory.problem4' },
//   { problemId: 5, isMemberHaveThisProblem: false, problemName: 'medicalHistory.problem5' },
//   { problemId: 6, isMemberHaveThisProblem: false, problemName: 'medicalHistory.problem6' },
//   { problemId: 7, isMemberHaveThisProblem: false, problemName: 'medicalHistory.problem7' },
//   { problemId: 8, isMemberHaveThisProblem: false, problemName: 'medicalHistory.problem8' },
//   { problemId: 9, isMemberHaveThisProblem: false, problemName: 'medicalHistory.problem9' }
// ]

export enum MemberFormTypes {
  ADD_MEMBER = 'ADD_MEMBER',
  EDIT_MEMBER = 'EDIT_MEMBER',
  ADD_MEMBERSHIP = 'ADD_MEMBERSHIP',
  EDIT_MEMBERSHIP = 'EDIT_MEMBERSHIP'
}

export enum ScheduleType {
  trainerSchedule = 'TRAINERS_SCHEDULE',
  DoctorsSchedule = 'DOCTORS_SCHEDULE',
}

export enum InstructorDueAmountBasedOn {
  percentage = 'PERCENTAGE',
  amount = 'AMOUNT',
}

export enum MembershipActionType {
  ChangeStartDate = 1,
  ChangeSalesPerson = 2,
}

export enum ImageTypes {
  GymImage = 'GymImage',
  ClassesScheduleImage = 'ClassesScheduleImage',
}

export enum ImageTypesName {
  gymImages = 'gymImages',
  classesScheduleImages = 'classesScheduleImages',
}
