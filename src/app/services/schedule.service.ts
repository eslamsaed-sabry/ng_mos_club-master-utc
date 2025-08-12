import { Injectable, inject } from '@angular/core';
import { APIService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ClassBookingListFilters, IBookingListMember, IClassBookingList, IClassRoom, IDefaultClassFormValues, IPrivateRoom, IRentRoom, ISchedule, MemberClassNotification, ScheduleFilters } from '../models/schedule.model';
import { HttpResponseDTO } from '../models/common.model';
import { TranslateService } from '@ngx-translate/core';
import { DateType, StandardDatePipe } from '../pipes/standard-date.pipe';
import { Member, Membership } from '../models/member.model';
@Injectable()
export class ScheduleService extends APIService {

  standardDate = inject(StandardDatePipe);

  constructor(private http: HttpClient, translate: TranslateService) {
    super(translate);
  }


  getClassesSchedule(props: ScheduleFilters): Observable<HttpResponseDTO<ISchedule[]>> {
    return this.http.post<HttpResponseDTO<ISchedule[]>>(this.api() + `api/Class/GetClassesSchedule`, props, {
      headers: this.makeHeaders()
    })
  }

  getRentRoomsSchedule(props: ScheduleFilters): Observable<HttpResponseDTO<IRentRoom[]>> {
    return this.http.post<HttpResponseDTO<IRentRoom[]>>(this.api() + `api/Class/GetClassRoomRents`, props, {
      headers: this.makeHeaders()
    })
  }

  addScheduleClass(scheduleClass: ISchedule): Observable<ISchedule[]> {
    const props = { ...scheduleClass };
    props.startDate = this.standardDate.transform(props.startDate, DateType.TO_UTC);
    props.endDate = this.standardDate.transform(props.endDate, DateType.TO_UTC);
    props.bookingStartsAt = this.standardDate.transform(props.bookingStartsAt, DateType.TO_UTC);
    props.bookingEndsAt = this.standardDate.transform(props.bookingEndsAt, DateType.TO_UTC);
    props.repeatTillDate = this.standardDate.transform(props.repeatTillDate, DateType.TO_UTC);
    return this.http.post<ISchedule[]>(this.api() + `api/Class/ScheduleClass`, props, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.add', 'httpResponseMessages.elements.class')
    })
  }
  editScheduleClass(scheduleClass: ISchedule): Observable<ISchedule[]> {
    const props = { ...scheduleClass };
    props.startDate = this.standardDate.transform(props.startDate, DateType.TO_UTC);
    props.endDate = this.standardDate.transform(props.endDate, DateType.TO_UTC);
    props.bookingStartsAt = this.standardDate.transform(props.bookingStartsAt, DateType.TO_UTC);
    props.bookingEndsAt = this.standardDate.transform(props.bookingEndsAt, DateType.TO_UTC);
    props.repeatTillDate = this.standardDate.transform(props.repeatTillDate, DateType.TO_UTC);
    return this.http.post<ISchedule[]>(this.api() + `api/Class/EditClassSchedule`, props, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.edit', 'httpResponseMessages.elements.class')
    })
  }

  getClassRooms(): Observable<HttpResponseDTO<IClassRoom[]>> {
    return this.http.get<HttpResponseDTO<IClassRoom[]>>(this.api() + `api/Class/GetClassRooms`, {
      headers: this.makeHeaders()
    })
  }

  getAssignedClasses(staffMemberId: number): Observable<HttpResponseDTO<number[]>> {
    return this.http.get<HttpResponseDTO<number[]>>(this.api() + `api/Staff/GetAssignedClasses?StaffMemberId=${staffMemberId}`, {
      headers: this.makeHeaders()
    })
  }

  publishClass(classID: number): Observable<any> {
    return this.http.get<any>(this.api() + `api/Class/PublishClass?ClassId=${classID}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.publish', 'httpResponseMessages.elements.class')
    });
  }

  publishAllClass(data: any): Observable<any> {
    return this.http.post<any>(this.api() + `api/Class/PublishClasses`, data, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.publish', 'httpResponseMessages.elements.class')
    });
  }

  getClassCancellationReasons(): Observable<any> {
    return this.http.get<any>(this.api() + `api/Class/GetClassCancellationReasons`, {
      headers: this.makeHeaders()
    });
  }


  deleteScheduleClass(classID: number): Observable<any> {
    return this.http.get<any>(this.api() + `api/Class/DeleteScheduleClass?ClassId=${classID}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.delete', 'httpResponseMessages.elements.class')
    });
  }

  cancelClass(props: any): Observable<any> {
    return this.http.post<any>(this.api() + `api/Class/CancelClass`, props, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.cancel', 'httpResponseMessages.elements.class')
    })
  }

  getMatchedInstructors(id: number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Staff/GetInstructorsByMonitoringTypes?monitoringTypeId=${id}`, {
      headers: this.makeHeaders()
    });
  }

  getBookings(props: any): Observable<any> {
    // {
    //   "classId": 10,
    //   "memberContractNo": "string",
    //   "memberAccessCode": "string",
    //   "memberName": "string",
    //   "memberPhone": "string"
    // }
    return this.http.post<any>(this.api() + `api/Class/GetBookings`, props, {
      headers: this.makeHeaders()
    })
  }

  bookClass(classId: number, memberId: number, membershipId?: number): Observable<HttpResponseDTO<any>> {
    let _params: any = {
      "ClassId": classId,
      "MemberId": memberId,
      "MembershipId": membershipId
    };
    if (!membershipId) {
      delete _params.MembershipId
    }
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Class/BookClass`, {
      params: { ..._params },
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.book', 'httpResponseMessages.elements.class')
    });
  }

  getClassBookingListFilters(props: ClassBookingListFilters): Observable<HttpResponseDTO<IClassBookingList[]>> {
    return this.http.post<HttpResponseDTO<IClassBookingList[]>>(this.api() + `api/Class/GetBookingsPerEachClass`, props, {
      headers: this.makeHeaders()
    });
  }

  getBookingFullDetails(classId: number): Observable<HttpResponseDTO<IBookingListMember[]>> {
    return this.http.get<HttpResponseDTO<IBookingListMember[]>>(this.api() + `api/Class/GetBookingsFullDetails?ClassId=${classId}`, {
      headers: this.makeHeaders()
    });
  }

  sendMemberClassNotification(props: MemberClassNotification): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Class/AddMembersNotification`, props, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.send', 'httpResponseMessages.elements.notification')
    });
  }

  removeClassBooking(memberId: number, classId: number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Class/RemoveBooking?MemberId=${memberId}&ClassId=${classId}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.remove', 'httpResponseMessages.elements.member')
    });
  }

  attendMemberClass(memberId: number, classId: number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Class/AttendClass?MemberId=${memberId}&ClassId=${classId}`, {
      headers: this.makeHeaders()
    });
  }

  unAttendMemberClass(memberId: number, classId: number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Class/UnattendClass?MemberId=${memberId}&ClassId=${classId}`, {
      headers: this.makeHeaders()
    });
  }

  selectSubscription(memberId: number, includeExpired = false): Observable<HttpResponseDTO<Membership[]>> {
    const _params = includeExpired ? `MemberId=${memberId}&IncludeExpired=true` : `MemberId=${memberId}`
    return this.http.get<HttpResponseDTO<Membership[]>>(this.api() + `api/Membership/GetMemberValidMembershipsForClasses?${_params}`, {
      headers: this.makeHeaders()
    });
  }

  linkMembership(MemberId: number, ClassId: number, MembershipId: number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Class/LinkBookingToMembership?MemberId=${MemberId}&ClassId=${ClassId}&MembershipId=${MembershipId}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.link', 'httpResponseMessages.elements.membership')
    });
  }

  repeatClass(data: { classId: number, repeatTillDate: any }): Observable<HttpResponseDTO<any>> {
    const props = { ...data };
    props.repeatTillDate = this.standardDate.transform(props.repeatTillDate, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Class/RepeatClassTillDate`, props, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.update', 'httpResponseMessages.elements.classRepeatCount')
    });
  }

  getClassDefaults(): Observable<IDefaultClassFormValues> {
    return this.http.get<HttpResponseDTO<IDefaultClassFormValues>>(this.api() + `api/Class/GetDefaultValuesForClassFields`, {
      headers: this.makeHeaders()
    }).pipe(map(res => res.data));
  }

  getInstructorPrice(instructorId: number, classTypeId: number, classId?: number): Observable<HttpResponseDTO<number>> {
    let params: any = {
      InstructorId: instructorId,
      ClassTypeId: classTypeId
    };

    if (classId) {
      params = { ...params, ClassId: classId }
    }

    return this.http.get<HttpResponseDTO<number>>(this.api() + `api/Class/GetInstructorPrice`, {
      headers: this.makeHeaders(),
      params: { ...params }
    });
  }


  addRentRoom(scheduleClass: IRentRoom): Observable<any> {
    const props = { ...scheduleClass };
    props.fromDate = this.standardDate.transform(props.fromDate, DateType.TO_UTC);
    props.toDate = this.standardDate.transform(props.toDate, DateType.TO_UTC);
    props.paymentDate = this.standardDate.transform(props.paymentDate, DateType.TO_UTC);
    return this.http.post<any>(this.api() + `api/Class/AddClassRoomRent`, props, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.add', 'httpResponseMessages.elements.class')
    })
  }


  editRentRoom(scheduleClass: IRentRoom): Observable<any> {
    const props = { ...scheduleClass };
    props.fromDate = this.standardDate.transform(props.fromDate, DateType.TO_UTC);
    props.toDate = this.standardDate.transform(props.toDate, DateType.TO_UTC);
    props.paymentDate = this.standardDate.transform(props.paymentDate, DateType.TO_UTC);
    return this.http.post<any>(this.api() + `api/Class/EditClassRoomRent`, props, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.edit', 'httpResponseMessages.elements.class')
    })
  }

  deleteRentRoom(rentId: number): Observable<any> {
    return this.http.get<any>(this.api() + `api/Class/DeleteClassRoomRent?RentId=${rentId}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.delete', 'httpResponseMessages.elements.class')
    });
  }

  getClassesNames(classProgramId: number): Observable<HttpResponseDTO<any[]>> {
    return this.http.get<HttpResponseDTO<any[]>>(this.api() + `api/Class/GetClassesNames?ProgramId=${classProgramId}`, {
      headers: this.makeHeaders()
    });
  }

  getPrivateRoomsSchedule(props: ScheduleFilters): Observable<HttpResponseDTO<IPrivateRoom[]>> {
    return this.http.post<HttpResponseDTO<IPrivateRoom[]>>(this.api() + `api/Class/GetPrivateClassesAttendnace`, props, {
      headers: this.makeHeaders()
    })
  }

  addPrivateRoom(scheduleClass: IPrivateRoom): Observable<any> {
    const props = { ...scheduleClass };
    props.startDate = this.standardDate.transform(props.startDate, DateType.TO_UTC);
    props.endDate = this.standardDate.transform(props.endDate, DateType.TO_UTC);
    return this.http.post<any>(this.api() + `api/Attendance/AddPrivateClassAttendnace`, props, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.add', 'httpResponseMessages.elements.privateClass')
    })
  }


  editPrivateRoom(scheduleClass: IPrivateRoom): Observable<any> {
    const props = { ...scheduleClass };
    props.startDate = this.standardDate.transform(props.startDate, DateType.TO_UTC);
    props.endDate = this.standardDate.transform(props.endDate, DateType.TO_UTC);
    return this.http.post<any>(this.api() + `api/Attendance/EditPrivateClassAttendnace`, props, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.edit', 'httpResponseMessages.elements.privateClass')
    })
  }

  deletePrivateRoom(id: number): Observable<any> {
    return this.http.get<any>(this.api() + `api/Attendance/DeletePrivateClassAttendnace?Id=${id}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.delete', 'httpResponseMessages.elements.privateClass')
    });
  }

}
