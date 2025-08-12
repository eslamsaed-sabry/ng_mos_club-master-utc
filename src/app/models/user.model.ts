import { Gender, GymConfig, ReceiptTypes } from "./enums";

export interface User {
  username: string;
  password: string;
  clientId: string;
}

export interface IAuthorizedUser {
  id: number,
  englishName: string,
  arabicName: string,
  userName: string,
  roleId: number,
  role: string,
  isActive: boolean,
  staffMemberId: string,
  permissions: string,
  permissionsList: string[],
  isAdmin: boolean,
  gateUrl: string,
  timezone: string,
  imagePath: string
}

export interface IUser {
  id: number,
  nameEng: string,
  nameAR: string,
  userName: string,
  password: string,
  roleId: number,
  branchesIds: number[],
}

export interface IResetPassword {
  branchId: number;
  email: string,
  token: string,
  password: string;
}

export interface IGymSetting {
  id: number,
  nameEng: string,
  nameAr: string,
  symbol: GymConfig,
  value: string
}

export interface ICustomGymSetting {
  AllowMultipleMembersBySamePhone: string,
  ReceiptType: ReceiptTypes,
  AllowMultipleGymAttendancePerDay: string,
  AutoGetNextMemberContractNo: string,
  DatabaseBackupPath: string,
  SalesCommissionStartDay: string,
  AboutDescription: string,
  GymAddress: string,
  GymPhoneNumbers: string,
  ContactUsMapLocation: string,
  DefaultGender: Gender,
  LockersCount: string,
  ContactUsImagePath: string,
  AboutImagePath: string
}


export interface IBookingListSignal {
  memberId: number,
  classId: number
}
