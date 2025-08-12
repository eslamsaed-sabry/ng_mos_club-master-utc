import { ClassAttendanceStatus } from "./enums";
import { Shift } from "./staff.model";

export interface ISchedule {
  Id?: any,
  id: number,
  classTypeId: number,
  classTypeEnglishName: string,
  classTypeArabicName: string,
  roomId: number | null,
  roomEnglishName: string,
  roomArabicName: string,
  instructorId: number,
  instructorPrice: number,
  instructorEnglishName: string,
  instructorArabicName: string,
  startDate: any,
  endDate: any,
  maxAttendeesCount: number,
  maxWaitingListCount: number,
  enableOnlineBooking: boolean,
  enableForActiveMembershipOnly: boolean,
  bookingStartsAt: any,
  bookingEndsAt: any,
  minBookingCancellationMinutes: number,
  allowedGender: number,
  punishmentInDays: number,
  memberPrice: number,
  nonMemberPrice: number,
  showAttendeesToPublic: boolean,
  isCancelled: boolean,
  cancellationReasonId: number,
  cancellationReason: string,
  creationDate: string,
  createdBy: number,
  isPublished: boolean,
  publishedDate: Date,
  classTypeName: string,
  roomName: string,
  instructorName: string,
  userName: string,
  bookedCount: number,
  attendeesCount: number,
  memberClassStatus: number,
  memberClassStatusName: string,
  Subject: string,
  StartTime: Date,
  EndTime: Date,
  capacity: string,
  isShowCapacity: boolean,
  repeatCount: number,
  editAlsoRelatedClasses: boolean,
  programId: number,
  repeatTillDate: any,
  isRentRoom: boolean,
  isPrivateRoom: boolean,
  autoCancelDelay: number,
  autoCancelAttendeesLimit: number,
  allowDropIns: boolean
}

export interface IRentRoom {
  id: number;
  roomId: number | null;
  roomName: string;
  fromDate: string; // ISO date string
  toDate: string;   // ISO date string
  paymentDate: string; // ISO date string
  amountPaid: number;
  isCash: boolean;
  visaTypeId: number;
  visaTypeName: string;
  notes: string;
  repeatedFromRentId: number;
  creationDate: string; // ISO date string
  createdBy: number;
  createdByName: string;
  branchId: number;
  colorHex: string;
  repeatCount: number;
  isRentRoom: boolean
}

export interface IPrivateRoom {
  Id?: any,
  id: number,
  startDate: any,
  endDate: any,
  membershipId: number,
  instructorId: number,
  roomId: number | null,
  isRentRoom: boolean,
  isPrivateRoom: boolean,
  memberName?: string,
  memberId?: number
}


export class ScheduleFilters {
  id?: number;
  fromDate?: any;
  toDate?: any;
  instructorId?: number;
  classTypeId?: number;
  enabledOnline?: boolean;
  isCancelled?: boolean;
  gender?: number;
  forMemberId?: number;
  memberId?: number;
  skip?: number;
  take?: number;
  roomId?: number;
  classGenreId?: number;
  classProgramId?: number;
}

export interface IClassRoom {
  id: number,
  englishName: string,
  arabicName: string,
  roomDescription: string,
  viewOrder: number,
  isActive: boolean,
  name: string,
  checked: boolean,
  branchId: number
}

export interface IInstructor {
  id: number,
  code: string,
  englishName: string,
  arabicName: string,
  jobTitleId: number,
  jobTitle: string,
  managerName: string,
  managerId: number,
  isActive: boolean,
  salary: number,
  workingHours: number,
  targetToReach: string,
  phoneNo: string,
  staffAddress: string,
  birthDate: string,
  email: string,
  emergencyContactName: string,
  emergencyContactPhone: string,
  userId: number,
  userName: string,
  roleId: number,
  shiftId: number,
  shiftName: string,
  shift: Shift,
  photo: string,
  description: string,
  jobSymbol: string,
  monitoringTypeId: number,
  isTrainer: boolean,
  isSalesPerson: boolean,
  isInstructor: boolean,
  imageBase64: string,
  imagePath: string,
  nationalId: number
}

export interface IClassType {
  id: number,
  name: string,
  isActive: boolean,
  viewOrder: number
}

export interface dialogScheduleClassData {
  type: 'Add' | 'Save';
  scheduledClass: ISchedule;
  startTime: Date;
  hideBookingListLink?: boolean
}
export interface IDialogRentRoom {
  type: 'Add' | 'Save';
  scheduledClass: IRentRoom;
  startTime: Date;
}
export interface IDialogPrivateRoom {
  type: 'Add' | 'Save';
  scheduledClass: IPrivateRoom;
  startTime: Date;
}
export interface dialogBookingClassData {
  type: string;
  class: IClassBookingList;
}

export class ClassBookingListFilters {
  id: number;
  fromDate: any;
  toDate: any;
  instructorId: number;
  classTypeId: number;
  enabledOnline: boolean;
  isCancelled: boolean;
  gender: number;
  forMemberId: number;
  memberId: number;
  skip: number;
  take: number
}

export interface IClassBookingList extends ISchedule, IRentRoom, IPrivateRoom {
  timeAsString: string,
  durationInMinutes: number,
  imagePath: string,
  isValidToBook: boolean,
  bookingList: IBookedMember[],
  colorHex: string
}

export interface IBookedMember {
  memberId: number,
  memberContractNo: string,
  memberPhone: string,
  memberName: string,
  classId: number,
  membershipId?: number,
  className: string,
  classStartDate: Date,
  classEndtDate: Date,
  instructorId: number,
  instructorName: string,
  isAttended: boolean,
  isWaitingList: boolean,
  status: string,
  statusId: ClassAttendanceStatus
}

export class MemberClassNotification {
  classId: number;
  attendanceStatus: ClassAttendanceStatus = ClassAttendanceStatus.All;
  title: string;
  message: string;
  isSMS: boolean = true;
  isMobileApp: boolean = true;
  isWhatsApp: boolean = true
}

export interface IBookingListMember {
  classId: number,
  memberId: number,
  isWaitingList: boolean,
  isAttended: boolean,
  creationDate: string,
  userId: number,
  attendedBy: number,
  addedByUserName: string,
  attendedByUserName: string,
  memberAccessCode: string,
  memberContractNo: string,
  memberPhone: string,
  memberName: string,
  memberPhoto: string,
  memberPhotoPath: string,
  membershipId: number | null,
  package: string,
  status: ClassAttendanceStatus,
  statusName: string,
  anyLateDebts: string,
  debts: number,
  remainingSessionsAsText: string,
  invitationId: number | null,
  otherEntityId: number | null,
}


export interface IDefaultClassFormValues {
  defaultMaxWaitingListCount: number,
  defaultClassDuration: number,
  defaultClassBookingStartsAt: number,
  defaultClassBookingEndsAt: number,
  defaultClassBookingCancelationDuration: number,
  defaultClassMaxAttendees: number,
  defaultClassGender: number,
  defaultClassPunishment: number,
  defaultClassEnableForOnlineBooking: boolean,
  defaultClassForActiveMembershipOnly: boolean,
  defaultClassShowAttendeesToPublic: boolean,
  defaultClassShowCapacity: boolean,
  defaultClassAutoCancelAttendeesLimit: number,
  defaultClassAutoCancelDelay: number
}