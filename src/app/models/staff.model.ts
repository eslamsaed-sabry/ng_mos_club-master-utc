import moment from 'moment';
import { ILookUp } from './common.model';
import { LookupType } from './enums';
import { IClassRoom } from './schedule.model';

export class StaffFilters {
  id: number;
  code: string;
  phone: string;
  name: string;
  jobTitleId: number;
  nationalId: string;
  isActive: boolean | null;
  isInstructor: boolean | null;
  isTrainer: boolean | null;
  jobSymbol: string;
  monitoringTypeId: number;
  includeImageBase64: boolean;
  skipCount: number;
  takeCount: number;
  mainBranchId: number;
}

export interface IStaff {
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
  birthDate: Date,
  email: string,
  emergencyContactName: string,
  emergencyContactPhone: string,
  userId: number,
  userName: string,
  password: string,
  roleId: number,
  shiftId: number,
  teamId: number;
  mainBranchId: number;
  shiftName: string,
  shift: Shift,
  photo: string,
  description: string,
  jobSymbol: string,
  monitoringTypeId: string,
  isTrainer: boolean,
  isSalesPerson: boolean,
  isInstructor: boolean,
  isDoctor: boolean,
  imageBase64: string | null,
  imagePath: string,
  nationalId: string,
  classPrice: number,
  classes: number[],
  programs: number[],
  branches: number[],
  isImageChanged: boolean;
  phoneFormatId: number;
  userCommand: UserCommand
  instgramUrl: string;
  viewOrder: number;
  isOutsider: boolean;
  isNotifyForPtRotation: boolean;
  isFitnessManager: boolean;
}

interface UserCommand {
  id?: number,
  nameEng: string,
  nameAR: string,
  userName: string,
  password: string,
  roleId: number,
  branchesIds: number[],

}

export class StaffPOST {
  code: string;
  nameEng: string;
  nameAR: string;
  jobTitleId: number;
  managerId: number;
  salary: number;
  shiftId: number;
  phoneNo: string;
  address: string;
  birthday: Date;
  mail: string;
  emergencyContact: string;
  emergencyPhone: string;
  classes: [];
  oldPhoto: string;
  isImageChanged: boolean;
  imageBase64: string;
  description: string;
  nationalId: string;
  isTrainer: boolean;
  isSalesPerson: boolean;
  isInstructor: boolean
}

export interface dialogShiftData {
  type: string;
  shift: Shift;
}
export interface dialogLookupData {
  type: string;
  lookup: ILookUp,
  lookupName: string,
  lookupTypeId: LookupType
}

export class Shift {
  id: number;
  nameEng: string;
  nameAR: string;
  startTime: string;
  endTime: string;
  allowedDelay: string;
  firstDeductAmount: string;
  secondDeductAmount: string;
  thirdDeductAmount: string;
  fourthDeductAmount: string;
  sat_CheckInTime: string = moment(new Date()).format('HH:mm');
  sat_CheckOutTime: string = moment(new Date()).format('HH:mm');
  sun_CheckInTime: string = moment(new Date()).format('HH:mm');
  sun_CheckOutTime: string = moment(new Date()).format('HH:mm');
  mon_CheckInTime: string = moment(new Date()).format('HH:mm');
  mon_CheckOutTime: string = moment(new Date()).format('HH:mm');
  tus_CheckInTime: string = moment(new Date()).format('HH:mm');
  tus_CheckOutTime: string = moment(new Date()).format('HH:mm');
  wed_CheckInTime: string = moment(new Date()).format('HH:mm');
  wed_CheckOutTime: string = moment(new Date()).format('HH:mm');
  thu_CheckInTime: string = moment(new Date()).format('HH:mm');
  thu_CheckOutTime: string = moment(new Date()).format('HH:mm');
  fri_CheckInTime: string = moment(new Date()).format('HH:mm');
  fri_CheckOutTime: string = moment(new Date()).format('HH:mm');
  sat_IsVacation: boolean;
  sun_IsVacation: boolean;
  mon_IsVacation: boolean;
  tus_IsVacation: boolean;
  wed_IsVacation: boolean;
  thu_IsVacation: boolean;
  fri_IsVacation: boolean
}

export interface dialogStaffData {
  type: string;
  staff: IStaff;
  isInstructor: boolean;
  isTrainer: boolean;
}
export interface dialogAttachmentData {
  name: string;
  contextId: number;
  contextTypeId: number;
}

export interface IStaffJob {
  id: number,
  nameENG: string,
  nameAR: string,
  symbol: string,
  canGiveClass: boolean
}

export interface Attachment {
  id: number,
  memberId: number,
  attachmentName: string,
  storedName: string,
  creationDate: Date,
  createdBy: number,
  contextTypeId: number,
  contextId: number,
  isImage: boolean,
  path: string
}


export class StaffAttendanceFilters {
  fromDate: any;
  toDate: any;
  skipCount: number;
  takeCount: number;
  staffMemberId: number
  constructor() {
    const today = new Date();
    this.fromDate = new Date(today.setDate(today.getDate() - 30));
    this.toDate = new Date();
  }
}

export interface IStaffAttendance {
  id: number,
  staffMemberId: number,
  staffMemberName: string,
  punchDate: any,
  operation: number,
  notes: any
}

export class ChangeSalesForm {
  salesId: number;
  count: number;
  isRandom: boolean;
  isPotential: boolean = false;
  joiningDateFrom: Date;
  joiningDateTo: Date;
  gender: number;
  newSalesId: number;
  changeLatestMembership: boolean
}

export interface dialogClassRoomData {
  type: string;
  classRoom: IClassRoom
}

export interface IEmployeeRequest {
  id: number,
  requestTypeId: number,
  requestTypeName: string,
  startDate: Date,
  endDate: Date,
  notes: string,
  userId: number,
  employeeId: number,
  employeeName: string,
  employeeJobTitle: string,
  creationDate: Date,
  isApproved: boolean,
  approvedDeclinedDate: Date,
  approvedDeclinedBy: any,
  approvedDeclinedByName: string,
  isFinalApproved: boolean,
  finalApprovedDeclinedDate: Date,
  finalApprovedDeclinedBy: string,
  finalApprovedDeclinedByName: string,
  managerNotes: string,
  status: string,
  statusColor: string,
  moreInfo: string,
  moreInfoDetails: string[],
  isValidToApprove: boolean,
  isValidToFinalApprove: boolean,
  isValidToDecline: boolean,
  isValidToFinalDecline: boolean
}

export class EmployeeRequestFilters {
  employeeId: number;
  requestTypeId: number;
  fromDate: Date;
  toDate: Date;
  skipCount: number;
  takeCount: number;
}

export interface dialogEmployeeRequestData {
  type: string;
  employeeRequest: IEmployeeRequest;
}

export interface EmployeeRequest {
  requestTypeId: number,
  startDate: any,
  endDate: any,
  notes: string,
}

export interface ApproveDeclineEmployeeRequest {
  requestId: number,
  isApprove: boolean,
  notes: string,
  forFinal: boolean,
}
