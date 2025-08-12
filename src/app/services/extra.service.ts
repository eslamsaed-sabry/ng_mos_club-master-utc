import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ComplaintsFilters, FeedbacksFilters, FreeBenefitFilters, IApproveDecline, IBenefitReservation, ICafeteriaFilters, IComplaint, IFeedback, IFreeBenefit, ILostItem, IMachineMaintenance, IReceipt, IReminder, IRequest, LostItemsFilters, MachineMaintenanceFilters, Receipt, ReminderFilters, RequestsFilters } from '../models/extra.model';
import { APIService } from './api.service';
import { Observable } from 'rxjs';
import { HttpResponseDTO } from '../models/common.model';
import { TranslateService } from '@ngx-translate/core';
import { Freeze, IMembershipUpgrade, Installment, Session } from '../models/member.model';
import { IExercise, IWorkOut, IWorkOutExercise, IWorkOutMember, IWorkOutParams } from '../models/management.model';
import { DateType, StandardDatePipe } from '../pipes/standard-date.pipe';
@Injectable()
export class ExtraService extends APIService {

  standardDate = inject(StandardDatePipe);
  constructor(private http: HttpClient, translate: TranslateService) {
    super(translate);
  }

  uploadMemberPic(formData: FormData) {
    return this.http.post(
      this.api() + 'api/Utility/Upload?isProfilePicture=true',
      formData, {
      headers: this.makeHeaders()
    });
  }

  getCafeteriaItems(filters: ICafeteriaFilters): Observable<HttpResponseDTO<ICafeteriaFilters>> {
    return this.http.post<HttpResponseDTO<ICafeteriaFilters>>(this.api() + `api/Cafeteria/GetCafeteriaTransactions`, filters, {
      headers: this.makeHeaders()
    });
  }

  getReceipts(filters: Receipt): Observable<HttpResponseDTO<IReceipt[]>> {
    return this.http.post<HttpResponseDTO<IReceipt[]>>(this.api() + `api/Utility/GetReceipts`, filters, {
      headers: this.makeHeaders()
    });
  }

  getInstallmentById(id: number): Observable<HttpResponseDTO<Installment>> {
    return this.http.get<HttpResponseDTO<Installment>>(this.api() + `api/Payment/GetInstallmentById?Id=${id}`, {
      headers: this.makeHeaders()
    });
  }

  getFreezeById(id: number): Observable<HttpResponseDTO<Freeze>> {
    return this.http.get<HttpResponseDTO<Freeze>>(this.api() + `api/Membership/GetFreezeById?Id=${id}`, {
      headers: this.makeHeaders()
    });
  }

  getUpgradeById(id: number): Observable<HttpResponseDTO<IMembershipUpgrade>> {
    return this.http.get<HttpResponseDTO<IMembershipUpgrade>>(this.api() + `api/Membership/GetUpgrade?Id=${id}`, {
      headers: this.makeHeaders()
    });
  }

  getSessionById(id: number): Observable<HttpResponseDTO<Session>> {
    return this.http.get<HttpResponseDTO<Session>>(this.api() + `api/Session/GetSession?Id=${id}`, {
      headers: this.makeHeaders()
    });
  }

  getFreeBenefits(filters: FreeBenefitFilters): Observable<HttpResponseDTO<IFreeBenefit>> {
    return this.http.post<HttpResponseDTO<IFreeBenefit>>(this.api() + `api/Member/GetSessionAttendances`, filters, {
      headers: this.makeHeaders()
    });
  }

  getApproveDeclineList(filters: any): Observable<HttpResponseDTO<IApproveDecline[]>> {
    return this.http.post<HttpResponseDTO<IApproveDecline[]>>(this.api() + `api/Accountant/GetApproveDeclineList`, filters, {
      headers: this.makeHeaders()
    });
  }

  approve(ContextTypeId: number, ContextId: number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Accountant/Approve?ContextTypeId=${ContextTypeId}&ContextId=${ContextId}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.update', 'httpResponseMessages.elements.status')
    });
  }

  reject(ContextTypeId: number, ContextId: number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Accountant/Decline?ContextTypeId=${ContextTypeId}&ContextId=${ContextId}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.update', 'httpResponseMessages.elements.status')
    });
  }

  finalApprove(ContextTypeId: number, ContextId: number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Accountant/FinalApprove?ContextTypeId=${ContextTypeId}&ContextId=${ContextId}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.update', 'httpResponseMessages.elements.status')
    });
  }

  getComplaints(filters: ComplaintsFilters): Observable<HttpResponseDTO<IComplaint[]>> {
    return this.http.post<HttpResponseDTO<IComplaint[]>>(this.api() + `api/Complaint/GetComplaints`, filters, {
      headers: this.makeHeaders()
    });
  }

  getFeedbacks(filters: FeedbacksFilters): Observable<HttpResponseDTO<IFeedback[]>> {
    return this.http.post<HttpResponseDTO<IFeedback[]>>(this.api() + `api/Feedback/GetFeedbacks`, filters, {
      headers: this.makeHeaders()
    });
  }

  addComplaint(complaint: IComplaint): Observable<HttpResponseDTO<any>> {
    const props = { ...complaint };
    props.actionDate = this.standardDate.transform(props.actionDate, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Complaint/AddComplaintByUser`, props, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.add', 'httpResponseMessages.elements.complaint')
    });
  }

  editComplaint(complaint: IComplaint): Observable<HttpResponseDTO<any>> {
    const props = { ...complaint };
    props.actionDate = this.standardDate.transform(props.actionDate, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Complaint/EditComplaintByUser`, props, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.update', 'httpResponseMessages.elements.complaint')
    });
  }

  deleteComplaint(complaintId: number, memberId: number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Complaint/DeleteComplaintByUser?complaintId=${complaintId}&memberId=${memberId}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.delete', 'httpResponseMessages.elements.complaint')
    });
  }

  deleteFeedback(complaintId: number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Complaint/DeleteFeedbackByUser?complaintId=${complaintId}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.delete', 'httpResponseMessages.elements.feedbacks')
    });
  }

  resolveComplaint(props: any): Observable<HttpResponseDTO<IComplaint>> {
    return this.http.post<HttpResponseDTO<IComplaint>>(this.api() + `api/Complaint/ResolveComplaint`, props, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.resolve', 'httpResponseMessages.elements.complaint')
    });
  }

  addComplaintComment(props: any): Observable<HttpResponseDTO<IComplaint>> {
    return this.http.post<HttpResponseDTO<IComplaint>>(this.api() + `api/Complaint/AddComplaintCommentByUser`, props, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.add', 'httpResponseMessages.elements.comment')
    });
  }

  getComplaintComments(complaintId: number): Observable<HttpResponseDTO<IComplaint>> {
    return this.http.get<HttpResponseDTO<IComplaint>>(this.api() + `api/Complaint/GetComplaintComments?complaintId=${complaintId}`, {
      headers: this.makeHeaders()
    });
  }

  getRequests(filters: RequestsFilters): Observable<HttpResponseDTO<IRequest[]>> {
    return this.http.post<HttpResponseDTO<IRequest[]>>(this.api() + `api/Request/GetRequests`, filters, {
      headers: this.makeHeaders()
    });
  }

  addRequest(request: IRequest): Observable<HttpResponseDTO<any>> {
    const props = { ...request };
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Request/AddRequestByUser`, props, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.add', 'httpResponseMessages.elements.request')
    });
  }

  editRequest(request: IRequest): Observable<HttpResponseDTO<any>> {
    const props = { ...request };
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Request/EditRequestByUser`, props, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.update', 'httpResponseMessages.elements.request')
    });
  }

  deleteRequest(requestId: number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Request/DeleteRequestByUser?requestId=${requestId}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.delete', 'httpResponseMessages.elements.request')
    });
  }

  addRequestComment(props: any): Observable<HttpResponseDTO<IRequest>> {
    return this.http.post<HttpResponseDTO<IRequest>>(this.api() + `api/Request/AddRequestCommentByUser`, props, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.add', 'httpResponseMessages.elements.comment')
    });
  }

  getRequestComments(requestId: number): Observable<HttpResponseDTO<IRequest>> {
    return this.http.get<HttpResponseDTO<IRequest>>(this.api() + `api/Request/GetRequestComments?requestId=${requestId}`, {
      headers: this.makeHeaders()
    });
  }

  getLostItems(filters: LostItemsFilters): Observable<HttpResponseDTO<ILostItem[]>> {
    return this.http.post<HttpResponseDTO<ILostItem[]>>(this.api() + `api/Utility/GetLostItems`, filters, {
      headers: this.makeHeaders()
    });
  }

  markItemDelivered(item: ILostItem): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Utility/MarkLostItemAsDelivered`, item, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.deliver', 'httpResponseMessages.elements.item')
    });
  }

  addLostItem(item: ILostItem): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Utility/AddLostItem`, item, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.add', 'httpResponseMessages.elements.item')
    });
  }

  editLostItem(item: ILostItem): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Utility/EditLostItem`, item, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.edit', 'httpResponseMessages.elements.item')
    });
  }


  getMachineMaintenanceTypes(): Observable<HttpResponseDTO<any[]>> {
    return this.http.get<HttpResponseDTO<any[]>>(this.api() + `api/Utility/GetMaintenanceTypes`, {
      headers: this.makeHeaders()
    });
  }

  getMachineMaintenance(filters: MachineMaintenanceFilters): Observable<HttpResponseDTO<IMachineMaintenance[]>> {
    return this.http.post<HttpResponseDTO<IMachineMaintenance[]>>(this.api() + `api/Utility/GetMaintenances`, filters, {
      headers: this.makeHeaders()
    });
  }

  addMachineMaintenance(maintenance: IMachineMaintenance): Observable<HttpResponseDTO<any>> {
    const props = { ...maintenance };
    props.maintenanceDate = this.standardDate.transform(props.maintenanceDate, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Utility/AddMaintenance`, props, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.add', 'httpResponseMessages.elements.maintenance')
    });
  }

  editMachineMaintenance(maintenance: IMachineMaintenance): Observable<HttpResponseDTO<any>> {
    const props = { ...maintenance };
    props.maintenanceDate = this.standardDate.transform(props.maintenanceDate, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Utility/EditMaintenance`, maintenance, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.edit', 'httpResponseMessages.elements.maintenance')
    });
  }

  deleteMachineMaintenance(maintenanceID: number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Utility/DeleteMaintenance?Id=${maintenanceID}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.delete', 'httpResponseMessages.elements.maintenance')
    });
  }

  getWorkouts(params: any): Observable<HttpResponseDTO<IWorkOut[]>> {
    return this.http.get<HttpResponseDTO<IWorkOut[]>>(this.api() + `api/Workout/GetWorkouts`, {
      headers: this.makeHeaders(),
      params: {
        Id: params.id,
        TrainerId: params.trainerId,
        skipCount: params.skipCount,
        takeCount: params.takeCount
      }
    });
  }

  addWorkout(workout: IWorkOut): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Workout/AddWorkout`, workout, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.add', 'httpResponseMessages.elements.workout')
    });
  }

  editWorkout(workout: IWorkOut): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Workout/EditWorkout`, workout, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.edit', 'httpResponseMessages.elements.workout')
    });
  }

  deleteWorkout(id: number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Workout/DeleteWorkout?Id=${id}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.delete', 'httpResponseMessages.elements.workout')
    });
  }

  getWorkoutExercises(params: IWorkOutParams): Observable<HttpResponseDTO<IWorkOutExercise[]>> {
    return this.http.get<HttpResponseDTO<IWorkOutExercise[]>>(this.api() + `api/Workout/GetWorkoutExercises`, {
      headers: this.makeHeaders(),
      params: {
        Id: params.id,
        WorkoutId: params.workoutId,
        ExerciseId: params.exerciseId,
        skipCount: params.skipCount,
        takeCount: params.takeCount
      }
    });
  }

  addWorkoutExercise(exercise: IWorkOutExercise): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Workout/AddWorkoutExercise`, exercise, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.add', 'httpResponseMessages.elements.exercise')
    });
  }

  editWorkoutExercise(exercise: IWorkOutExercise): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Workout/EditWorkoutExercise`, exercise, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.edit', 'httpResponseMessages.elements.exercise')
    });
  }

  deleteWorkoutExercise(id: number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Workout/DeleteWorkoutExercise?Id=${id}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.delete', 'httpResponseMessages.elements.exercise')
    });
  }

  getWorkoutMembers(params: IWorkOutParams): Observable<HttpResponseDTO<IWorkOutMember[]>> {
    return this.http.get<HttpResponseDTO<IWorkOutMember[]>>(this.api() + `api/Workout/GetMembersWorkouts`, {
      headers: this.makeHeaders(),
      params: {
        memberId: params.memberId,
        workoutId: params.workoutId,
        skipCount: params.skipCount,
        takeCount: params.takeCount
      }
    });
  }

  addWorkoutMember(member: IWorkOutMember): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Workout/AddMemberWorkout`, member, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.add', 'httpResponseMessages.elements.member')
    });
  }

  editWorkoutMember(member: IWorkOutMember): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Workout/EditMemberWorkout`, member, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.edit', 'httpResponseMessages.elements.member')
    });
  }

  deleteWorkoutMember(memberId: number, workoutId: number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Workout/DeleteMemberWorkout?memberId=${memberId}&workoutId=${workoutId}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.delete', 'httpResponseMessages.elements.member')
    });
  }

  getExercises(params: any) {
    return this.http.get<HttpResponseDTO<IExercise[]>>(this.api() + `api/Workout/GetExercises`, {
      headers: this.makeHeaders(),
      params: {
        Id: params.id,
        TypeId: params.typeId,
        skipCount: params.skipCount,
        takeCount: params.takeCount
      }
    });
  }

  getReminders(filters: ReminderFilters): Observable<HttpResponseDTO<IReminder[]>> {
    return this.http.post<HttpResponseDTO<IReminder[]>>(this.api() + `api/Reminder/GetReminders`, filters, {
      headers: this.makeHeaders()
    });
  }

  dismissReminder(reminderId: number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Reminder/DismissReminder?reminderId=${reminderId}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.dismiss', 'httpResponseMessages.elements.reminder')
    });
  }

  getBenefitsReservations(filters: FreeBenefitFilters): Observable<HttpResponseDTO<IBenefitReservation[]>> {
    const props = { ...filters };
    props.sessionDateFrom = this.standardDate.transform(props.sessionDateFrom, DateType.TO_UTC);
    props.sessionDateTo = this.standardDate.transform(props.sessionDateTo, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<IBenefitReservation[]>>(this.api() + `api/Member/GetReservedBenefits`, filters, {
      headers: this.makeHeaders()
    });
  }

  confirmBenefitReservation(reservationId: number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(`${this.api()}api/Member/ConfirmBenefitReservation?ReservationId=${reservationId}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.confirm', 'httpResponseMessages.elements.reservation')
    })
  }

  deleteBenefitReservation(reservationId: number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(`${this.api()}api/Attendance/DeleteMonitoringAttendance?Id=${reservationId}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.remove', 'httpResponseMessages.elements.reservation')
    })
  }


}
