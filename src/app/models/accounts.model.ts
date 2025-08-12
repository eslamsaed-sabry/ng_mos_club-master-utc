import { ReceiptTypes } from "./enums";

export class OtherRevenueFilters {
  from: Date;
  to: Date;
  type: number;
  staffMemberId: number;
  userId: number;
  skipCount: number;
  takeCount: number;
}
export class ExpensesFilters {
  from: Date;
  to: Date;
  type: number;
  staffMemberId: number;
  userId: number;
  skipCount: number;
  takeCount: number;
}
export class FinancialFilters {
  from: Date;
  to: Date;
  type: number;
  staffMemberId: number;
  userId: number;
  skipCount: number;
  takeCount: number;

}
export interface IFinancial {
  id: number,
  typeId: number,
  typeName: string,
  actionDate: any,
  price: number,
  amountVisa: number,
  description: string,
  staffMemberId: number,
  staffMemberName: string,
  creationDate: Date,
  userId: number,
  userName: string,
  modifiedBy: string,
  modificationDate: Date,
  branchId: number,
  branchName: string,
  visaTypeId: number,
  isCash: boolean;
  receiptType: ReceiptTypes;

}

export interface IOtherRevenue {
  id: number,
  typeId: number,
  typeName: string,
  actionDate: any,
  price: number,
  amountVisa: number,
  description: string,
  staffMemberId: number,
  staffMemberName: string,
  creationDate: Date,
  userId: number,
  userName: string,
  modifiedBy: string,
  modificationDate: Date,
  branchId: number;
  branchName: string,
  visaTypeId: number;
  incomeTypeId: number;

}

export interface IExpenses {
  id: number,
  typeId: number,
  typeName: string,
  actionDate: any,
  price: number,
  amountVisa: number,
  description: string,
  staffMemberId: number,
  staffMemberName: string,
  creationDate: Date,
  userId: number,
  userName: string,
  modifiedBy: string,
  modificationDate: Date,
  receiptType: ReceiptTypes,
  branchId: number,
  visaTypeId: number,
  systemReceiptNo: number
}

export interface IExpense {
  id: number,
  nameEng: string,
  nameAR: string,
  name: string,
  viewOrder: number
}

export interface dialogRevenueData {
  type: string;
  revenue: IOtherRevenue
}
export interface dialogExpensesData {
  type: string;
  revenue: IExpenses
}

export interface dialogFinancialData {
  type: string;
  financial: IFinancial
}
