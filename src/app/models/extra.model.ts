import moment from "moment";
import { ContextType, ReceiptTypes } from "./enums";
import { Member, Note } from "./member.model";

export interface ICafeteriaFilters {
  transactionId: number,
  memberID: number,
  fromDate: Date,
  toDate: Date
}

export interface ICafeteriaItem {
  id: number,
  memberId: number,
  memberCode: string,
  memberPhone: string,
  memberName: string,
  transactionDate: Date,
  creationDate: Date,
  createdBy: number,
  totalItems: number,
  totalPrice: number
}

export class Receipt {
  id: number;
  serialNo: number;
  manualNo: string;
  contextId: number;
  contextTypeId: number;
  includeReleatedReceipts: boolean;
  paymentFromDate: any;
  paymentToDate: any;
  skip: number;
  take: number;
  memberContractNo: string;
}

export interface IReceipt {
  id: number,
  serialNo: number,
  manualNo: number,
  contextId: number,
  contextTypeId: number,
  cashAmount: number,
  visaAmount: number,
  membershipId: number,
  contextType: string,
  paymentDate: Date,
  visaTypeName: string,
  isDeleted: boolean
}

export class FreeBenefitFilters {
  sessionAttendanceId: number;
  trainerId: number;
  benfitId: number;
  memberName: string;
  sessionDateFrom: any;
  sessionDateTo: any;
  takeCount: number;
  skipCount: number;
  searchKeyWord?:string;
  constructor() {
    this.sessionDateFrom = new Date();
    this.sessionDateTo = moment().add(24, 'hours').toDate();
    this.takeCount = 12;
    this.skipCount = 0;
  }
}

export interface IFreeBenefit {
  id: number,
  sessionDate: Date,
  trainerId: number,
  trainerName: string,
  membershipId: number,
  monitoringTypeId: number,
  monitoringTypeName: string,
  benfitId: number,
  benfitName: string,
  rateId: number,
  rateName: string,
  isReviewed: boolean,
  isApproved: boolean,
  athleticId: null,
  memberName: string,
  memberPhone: string,
  memberContractNo: string,
  receiptType: ReceiptTypes
}

export interface IBenefitReservation {
  id: number,
  sessionDate: string,
  trainerId: number,
  trainerName: string,
  staffMemberId: number,
  staffMemberName: number,
  membershipId: number,
  monitoringTypeId: number,
  monitoringTypeName: number,
  benfitId: number,
  benfitName: string,
  rateId: number,
  rateName: number,
  isReviewed: boolean,
  isApproved: boolean,
  approvedStatus: number,
  approvedDate: number,
  athleticId: number,
  memberName: string,
  memberPhone: string,
  memberId: number,
  memberContractNo: string,
  count: number,
  note: number,
  sessionDateAsString: number,
  creationDate: string,
  canDelete: boolean,
  isConfirmed: boolean,
  memberPhoto: string
}

export interface IDialogReceiptModal {
  contextTypeId: ContextType;
  contextId: number;
  approveStatus: number;
}

export interface IApproveDecline {
  id: number,
  contextType: number,
  membershipId: number,
  isApproved: boolean,
  isFinalApproved: boolean,
  approveStatus: number,
  price: number,
  cashAmount: number,
  visaAmount: number,
  username: string,
  creationDate: Date,
  notes: string
}

export class ComplaintsFilters {
  id: number;
  statusId: number;
  priorityId: number;
  sectionId: number;
  keyword: string;
  fromDate: Date;
  toDate: Date;
  isResolved: true;
  memberId: number;
  skipCount: number;
  takeCount: number;
  memberContractNo: string;
  memberPhone: string;
  memberName: string;
  memberAccessCode: string;
}

export interface IComplaint {
  id: number,
  statusId: number,
  priorityId: number,
  sectionId: number,
  complaintSubject: string,
  complaintDescription: string,
  actionDate: any,
  actionDateAsString: string,
  parentId: number,
  resolutionDate: Date,
  resolutionDateAsString: string,
  resolutionSummary: string,
  resolvedBy: string,
  creationDate: Date,
  creationDateAsString: string,
  memberId: number,
  memberContractNo: string,
  memberPhone: string,
  memberName: string,
  memberCode: string,
  priorityName: string,
  userName: string,
  sectionName: string,
  statusName: string,
  totalComments: number,
  subject: string,
  description: string
}

export interface IComplaintComment {
  id: number,
  complaintId: number,
  comment: string,
  creationDate: string,
  creationDateAsString: string,
  userId: number,
  memberId: number,
  memberName: string,
  userName: string,
  commenterName: string
}

export interface dialogComplaintData {
  complaint?: IComplaint;
  type: string;
  memberData?: any;
  showSearch: boolean;
}

export class RequestsFilters {
  id: number;
  typeId: number;
  keyword: string;
  fromDate: Date;
  toDate: Date;
  memberId: number;
  skipCount: number;
  takeCount: number;
  memberContractNo: string;
  memberPhone: string;
  memberName: string;
  memberAccessCode: string;
}
export interface IRequest {
  id: number,
  typeId: number,
  description: string,
  requestDescription: string,
  creationDate: Date,
  memberId: number,
  memberContractNo: string,
  memberPhone: string,
  memberName: string,
  memberAccessCode: string,
  typeName: string,
  totalComments: number,
}

export interface IRequestComment {
  id: number,
  requestId: number,
  comment: string,
  creationDate: string,
  creationDateAsString: string,
  userId: number,
  memberId: number,
  memberName: string,
  userName: string,
  commenterName: string
}

export interface dialogRequestData {
  request?: IRequest;
  type: string;
  memberData?: any;
  showSearch: boolean;
}









export class FeedbacksFilters {
  id: number;
  statusId: number;
  priorityId: number;
  sectionId: number;
  keyword: string;
  fromDate: Date;
  toDate: Date;
  isResolved: true;
  memberId: number;
  skipCount: number;
  takeCount: number;
  memberContractNo: string;
  memberPhone: string;
  memberName: string;
  memberAccessCode: string;
}

export interface IFeedback {
  id: number,
  feedbackSubject: string,
  feedbackDescription: string,
  creationDate: Date,
  memberId: number,
  memberContractNo: string,
  memberPhone: string,
  memberName: string,
  memberAccessCode: string,
}


export class LostItemsFilters {
  id: number;
  finderMemberId: number;
  finderEmployeeId: number;
  recipientMemberId: number;
  recipientEmployeeId: number;
  locationId: number;
  categoryId: number;
  isDeliverd: boolean;
  deliveryDateFrom: Date;
  deliveryDateTo: Date;
  creationDateFrom: Date;
  creationDateTo: Date;
  skipCount: number;
  takeCount: number;
}

export interface ILostItem {
  id: number,
  itemDescription: string,
  finderMemberId: number | null,
  finderEmployeeId: number | null,
  locationId: number,
  locationName: string,
  categoryId: number,
  categoryName: string,
  isDeliverd: boolean,
  deliveredDate: Date,
  recipientMemberId: number | null,
  recipientEmployeeId: number | null,
  recipientEmployeeName: string,
  recipientMemberName: string,
  recipientName: string,
  isImageChanged: boolean,
  imageBase64: string | null,
  imageName: string,
  notes: string,
  status: string,
  creationDate: Date,
  createdBy: number,
  createdByName: string,
  finderName: string
}

export interface dialogLostItemData {
  item?: ILostItem;
  type: string;
}

export interface IDialogFoundByData {
  item?: ILostItem;
  dialogType: 'FOUND_BY' | 'DELIVER';
}

export class MachineMaintenanceFilters {
  machineId: number;
  machineName: string;
  locationId: number;
  modelId: number;
  typeId: number;
  skipCount: number;
  takeCount: number
}

export interface IMachineMaintenance {
  id: number,
  machineId: number,
  machineName: string,
  locationId: number,
  locationName: string,
  modelId: number,
  modelName: string,
  typeId: number,
  typeName: string,
  maintenanceDate: any,
  cost: number,
  notes: string
}

export interface dialogMachineMaintenanceData {
  machineMaintenance?: IMachineMaintenance;
  type: string;
}

export class TasksFilters {
  fromDate: string;
  toDate: string;
  employeeId: number;
  memberName?: string;
  memberId?: number | null;
  phoneNumber: string;
  notOverwritedOnly: boolean = false;
  skipCount: number;
  takeCount: number;
  notAccomplishedOnly: boolean = true;
  notes: string;
  sourceId: number;
}

export interface ITasks {
  id: number,
  creationDate: string;
  memberId: number,
  memberName: string;
  phoneNumber: string;
  gender: number,
  memberSalesPersonId: number;
  memberSalesPerson: string;
  employeeId: number;
  employeeName: string;
  notes: string;
  createdBy: number;
  createdByName: string;
  lastCall: string;
  statusName: string;
  source: string;
  isOverwrite: boolean;
  isAccomplished: boolean;
}

export interface dialogTasksData {
  task?: ITasks;
  memberData: Member;
  type: string;
  showSearch: boolean;
}

export interface IFreePrivateTraining {
  contractNo: string,
  memberName: string,
  gender: number,
  trainerName: string,
  startDate: any,
  ptSessionsCount: number,
  ptSessionsConsumedCount: number,
  membershipId: number,
  memberId: number,
  phoneNumber: string,
  packageName: string,
  status: string,
  notes: string,
  trainerComment: string,
  salesPerson: string,
  trainerId: number,
  ptBenefitId: number,
  paymentDate: any,
  isReferralForPTRotation: boolean,
}

export interface dialogFreePrivateTrainingData {
  freePrivateTraining?: IFreePrivateTraining;
  type: string;
}

export class FreePrivateTrainingFilters {
  memberId: number;
  membershipId: number;
  memberName: string;
  phoneNumber: string;
  contractNo: string;
  gender: string;
  trainerId: number;
  startDateFrom: any = new Date();
  startDateTo: any = new Date();
  unassignedOnly: boolean;
  includeHidden: boolean;
  skipCount: number;
  takeCount: number;
  searchKeyWord: string;

  constructor() {
    const format1 = "YYYY-MM-DD";
    const today = new Date();
    const firstDayInMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    this.startDateFrom = moment(firstDayInMonth).format(format1) + 'T00:00';
    this.startDateTo = moment(lastDayInMonth).format(format1) + 'T23:59';
  }
}
export interface ITrainingNotes {
  memberId?: number | null,
  skipCount: number,
  takeCount: number
}

export class ReminderFilters {
  reminderDateFrom?: any = new Date();
  reminderDateTo?: any = new Date();
  notDismissedOnly: boolean;
  skipCount: number;
  takeCount: number;
  memberId: number;
  id?: number;
  salesPersonId?: number;

  constructor() {
    const today = new Date();
    this.reminderDateFrom = new Date(today.setDate(today.getDate() - 1));
    this.reminderDateTo = new Date(today.setDate(today.getDate() + 10));
  }
}

export interface IReminder {
  id: number,
  memberId: number,
  memberName: string,
  reminderDate: Date,
  notes: string
  isDismissed: boolean,
  creationDate: Date,
  createdBy: number,
  username: string,
  createdTo: number,
  createdToUsername: string,
  isTrainer: boolean,
  isSalesPerson: boolean,
}

export interface dialogMembersTrainingNotesData {
  membersTrainingNotes?: Note,
  type: string,
  memberId?: number
}
