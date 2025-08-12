import { Injectable, inject } from '@angular/core';
import { APIService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { HttpResponseDTO, IDeleteAvailableSlots, ISalesSchedule, ITrainerSchedule, ITrainerTimeTableSchedule, IUserReminder, SalesScheduleFilters, TrainerScheduleFilters, TrainerSlotForm, TrainerTimeTableFilters, TrainersTimeTableSlotForm, UserRemindersFilters } from '../models/common.model';
import { Observable } from 'rxjs';
import { Attendance } from '../models/member.model';
import { DateType, StandardDatePipe } from '../pipes/standard-date.pipe';

@Injectable({ providedIn: 'root' })
export class SalesScheduleService extends APIService {
  standardDate = inject(StandardDatePipe);
  constructor(private http: HttpClient, translate: TranslateService) {
    super(translate);
  }

  addUserReminder(params: IUserReminder): Observable<HttpResponseDTO<any>> {
    const props = { ...params };
    props.reminderDate = this.standardDate.transform(props.reminderDate, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<any>>(
      this.api() + `api/Reminder/AddReminder`, params, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.add', 'httpResponseMessages.elements.reminder')
    });
  }

  editUserReminder(params: IUserReminder): Observable<HttpResponseDTO<any>> {
    const props = { ...params };
    props.reminderDate = this.standardDate.transform(props.reminderDate, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<any>>(
      this.api() + `api/Reminder/AddReminder`, params, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.add', 'httpResponseMessages.elements.reminder')
    });
  }

  removeUserReminder(params: IUserReminder): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(
      this.api() + `api/Reminder/AddReminder`, params, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.add', 'httpResponseMessages.elements.reminder')
    });
  }

  getUserReminders(params: UserRemindersFilters): Observable<HttpResponseDTO<IUserReminder[]>> {
    return this.http.post<HttpResponseDTO<IUserReminder[]>>(
      this.api() + `api/Reminder/GetReminders`, params, { headers: this.makeHeaders('false', 'false') }
    );
  }

  getSalesSchedule(params: SalesScheduleFilters): Observable<HttpResponseDTO<ISalesSchedule[]>> {
    return this.http.post<HttpResponseDTO<ISalesSchedule[]>>(
      this.api() + `api/Report/GetTasksSchedule`, params, { headers: this.makeHeaders() }
    );
  }

  getTrainerSchedule(params: TrainerScheduleFilters): Observable<HttpResponseDTO<ITrainerSchedule[]>> {
    params = { ...params };
    params.fromDate = this.standardDate.transform(params.fromDate, DateType.TO_UTC);
    params.toDate = this.standardDate.transform(params.toDate, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<ITrainerSchedule[]>>(
      this.api() + `api/Report/GetTrainerTasksSchedule`, params, { headers: this.makeHeaders() }
    );
  }

  getDoctorSchedule(params: TrainerScheduleFilters): Observable<HttpResponseDTO<ITrainerSchedule[]>> {
    params = { ...params };
    params.fromDate = this.standardDate.transform(params.fromDate, DateType.TO_UTC);
    params.toDate = this.standardDate.transform(params.toDate, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<ITrainerSchedule[]>>(
      this.api() + `api/Report/GetDoctorsSchedule`, params, { headers: this.makeHeaders() }
    );
  }

  addTrainerSlot(params: TrainerSlotForm): Observable<HttpResponseDTO<any[]>> {
    params = { ...params };
    params.startDate = this.standardDate.transform(params.startDate, DateType.TO_UTC);
    params.happeningDate = this.standardDate.transform(params.happeningDate, DateType.TO_UTC);
    if (params.endDate)
      params.endDate = this.standardDate.transform(params.endDate, DateType.TO_UTC);

    return this.http.post<HttpResponseDTO<any[]>>(
      this.api() + `api/Attendance/AddAvailableSlot`, params, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.add', 'httpResponseMessages.elements.slot')
    }
    );
  }

  editTrainerSlot(params: TrainerSlotForm): Observable<HttpResponseDTO<any[]>> {
    params = { ...params };
    params.startDate = this.standardDate.transform(params.startDate, DateType.TO_UTC);
    params.endDate = this.standardDate.transform(params.endDate, DateType.TO_UTC);
    params.happeningDate = this.standardDate.transform(params.happeningDate, DateType.TO_UTC); return this.http.post<HttpResponseDTO<any[]>>(
      this.api() + `api/Attendance/EditAvailableSlot`, params, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.edit', 'httpResponseMessages.elements.slot')
    }
    );
  }

  deleteTrainerSlot(id: number): Observable<HttpResponseDTO<any[]>> {
    return this.http.get<HttpResponseDTO<any[]>>(
      this.api() + `api/Attendance/DeleteAvailableSlot?Id=${id}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.delete', 'httpResponseMessages.elements.slot')
    }
    );
  }

  getTrainerTimeTable(params: TrainerTimeTableFilters): Observable<HttpResponseDTO<ITrainerTimeTableSchedule[]>> {
    params = { ...params };
    params.fromDate = this.standardDate.transform(params.fromDate, DateType.TO_UTC);
    params.toDate = this.standardDate.transform(params.toDate, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<ITrainerTimeTableSchedule[]>>(
      this.api() + `api/Utility/GetTimeTableReservations`, params, { headers: this.makeHeaders() }
    );
  }

  addTrainerTimeTableSlot(params: TrainersTimeTableSlotForm): Observable<HttpResponseDTO<any[]>> {
    params = { ...params };
    params.startDate = this.standardDate.transform(params.startDate, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<any[]>>(
      this.api() + `api/Utility/AddTimeTableReservation`, params, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.add', 'httpResponseMessages.elements.slot')
    }
    );
  }

  editTrainerTimeTableSlot(params: TrainersTimeTableSlotForm): Observable<HttpResponseDTO<any[]>> {
    params = { ...params };
    params.startDate = this.standardDate.transform(params.startDate, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<any[]>>(
      this.api() + `api/Utility/EditTimeTableReservation`, params, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.edit', 'httpResponseMessages.elements.slot')
    }
    );
  }

  deleteTrainerTimeTableSlot(id: number): Observable<HttpResponseDTO<any[]>> {
    return this.http.get<HttpResponseDTO<any[]>>(
      this.api() + `api/Utility/DeleteTimeTableReservation?Id=${id}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.delete', 'httpResponseMessages.elements.slot')
    }
    );
  }

  cancelTrainerSlot(id: number): Observable<HttpResponseDTO<any[]>> {
    return this.http.get<HttpResponseDTO<any[]>>(
      this.api() + `api/Attendance/CancelAvailableSlot?Id=${id}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.cancel', 'httpResponseMessages.elements.slot')
    }
    );
  }

  snoozeUserReminder(reminderId: number, minutes: number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(
      this.api() + `api/Reminder/SnoozeReminder?reminderId=${reminderId}&minutes=${minutes}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.snooze', 'httpResponseMessages.elements.reminder')
    }
    );
  }

  dismissUserReminder(reminderId: number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(
      this.api() + `api/Reminder/DismissReminder?reminderId=${reminderId}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.dismiss', 'httpResponseMessages.elements.reminder')
    }
    );
  }

  getSlotMembers(slotId: number): Observable<HttpResponseDTO<Attendance[]>> {
    return this.http.get<HttpResponseDTO<Attendance[]>>(
      this.api() + `api/Attendance/GetSlotBookingList?SlotId=${slotId}`, {
      headers: this.makeHeaders()
    }
    );
  }

  addSlotMember(slotId: number, memberId: number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(
      this.api() + `api/Attendance/BookAvailableSlot?SlotId=${slotId}&MemberId=${memberId}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.add', 'httpResponseMessages.elements.member')
    }
    );
  }

  removeSlotMember(slotId: number, memberId: number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(
      this.api() + `api/Attendance/RemoveSlotBooking?SlotId=${slotId}&MemberId=${memberId}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.delete', 'httpResponseMessages.elements.member')
    }
    );
  }

  deleteAvailableSlots(params: IDeleteAvailableSlots): Observable<HttpResponseDTO<any[]>> {
    params = { ...params };
    params.fromDate = this.standardDate.transform(params.fromDate, DateType.TO_UTC);
    params.toDate = this.standardDate.transform(params.toDate, DateType.TO_UTC);

    return this.http.post<HttpResponseDTO<any[]>>(
      this.api() + `api/Attendance/DeleteAvailableSlots`, params, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.delete', 'httpResponseMessages.elements.slot')
    }
    );
  }

}
