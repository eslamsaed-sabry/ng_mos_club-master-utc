import { Injectable, inject } from '@angular/core';
import { APIService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpResponseDTO, ILookUp } from '../models/common.model';
import { Shift, IStaff, IStaffAttendance, IStaffJob, StaffAttendanceFilters, StaffFilters, ChangeSalesForm, EmployeeRequestFilters, EmployeeRequest, ApproveDeclineEmployeeRequest } from '../models/staff.model';
import { TranslateService } from '@ngx-translate/core';
import { DateType, StandardDatePipe } from '../pipes/standard-date.pipe';
@Injectable({
  providedIn: 'root'
})
export class StaffService extends APIService {

  standardDate = inject(StandardDatePipe);
  constructor(private http: HttpClient, translate: TranslateService) {
    super(translate);
  }


  getSalesStatistics(): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Staff/GetSalesStatistics`, {
      headers: this.makeHeaders()
    })
  }
  
  getAssignedPrograms(StaffMemberId:number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Staff/GetAssignedPrograms?StaffMemberId=${StaffMemberId}`, {
      headers: this.makeHeaders()
    })
  }

  changeSalesPerson(data: ChangeSalesForm): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Member/ChangeMembersSalesPerson`, data, {
      headers: this.makeHeaders()
    })
  }

  getStaff(props: StaffFilters): Observable<HttpResponseDTO<IStaff[]>> {
    return this.http.post<HttpResponseDTO<IStaff[]>>(this.api() + `api/Staff/GetStaffs`, props, {
      headers: this.makeHeaders()
    })
  }

  addStaff(props: IStaff): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Staff/AddStaff`, props, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.add', 'httpResponseMessages.elements.staff')
    })
  }

  addInstructor(props: IStaff): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Staff/AddInstructor`, props, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.add', 'httpResponseMessages.elements.staff')
    })
  }

  addTrainer(props: IStaff): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Staff/AddTrainer`, props, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.add', 'httpResponseMessages.elements.staff')
    })
  }

  editStaff(props: IStaff): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Staff/EditStaff`, props, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.edit', 'httpResponseMessages.elements.staff')
    })
  }

  activateStaffMember(StaffId: number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Staff/ActivateStaff?StaffMemberId=${StaffId}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.activate', 'httpResponseMessages.elements.staff')
    })
  }

  deactivateStaffMember(StaffId: number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Staff/DeactivateStaff?StaffMemberId=${StaffId}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.deactivate', 'httpResponseMessages.elements.staff')
    })
  }

  getJobTitles(): Observable<HttpResponseDTO<IStaffJob[]>> {
    return this.http.get<HttpResponseDTO<IStaffJob[]>>(this.api() + `api/Staff/GetJobTitles`, {
      headers: this.makeHeaders()
    })
  }

  getTrainers(): Observable<HttpResponseDTO<IStaff[]>> {
    return this.http.get<HttpResponseDTO<IStaff[]>>(this.api() + `api/Staff/GetTrainers`, {
      headers: this.makeHeaders()
    })
  }

  getStaffAttendance(props: StaffAttendanceFilters): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Staff/GetStaffAttendanceTransactions${props.staffMemberId ? '?StaffMemberId=' + props.staffMemberId : ''}`, props, {
      headers: this.makeHeaders()
    })
  }
  editStaffAttendance(props: IStaffAttendance): Observable<HttpResponseDTO<any>> {
    const _props = { ...props }
    _props.punchDate = this.standardDate.transform(_props.punchDate, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Staff/EditStaffAttendanceTransaction`, _props, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.edit', 'httpResponseMessages.elements.attendance')
    })
  }

  addStaffAttendance(props: IStaffAttendance): Observable<HttpResponseDTO<any>> {
    const _props = { ...props }
    _props.punchDate = this.standardDate.transform(_props.punchDate, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Staff/AddAttendanceTransactions`, _props, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.add', 'httpResponseMessages.elements.attendance')
    })
  }

  addStaffAttendanceByCode(code: string): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Staff/AddAttendance?Code=${code}`, {
      headers: this.makeHeaders()
    })
  }

  deleteLookup(lookupID: number, lookupTypeId: number, typeName: string): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/LookUp/DeleteLookUp?LookupId=${lookupID}&LookupTypeId=${lookupTypeId}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.delete', `httpResponseMessages.elements.${typeName}`)
    });
  }

  addLookup(lookupTypeId: number, lookup: ILookUp, typeName: string): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/LookUp/AddLookUp?LookupTypeId=${lookupTypeId}`, lookup, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.add', `httpResponseMessages.elements.${typeName}`)
    });
  }

  editLookup(lookupTypeId: number, lookup: ILookUp, typeName: string): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/LookUp/EditLookUp?LookupTypeId=${lookupTypeId}`, lookup, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.edit', `httpResponseMessages.elements.${typeName}`)
    });
  }

  getShifts(): Observable<HttpResponseDTO<Shift[]>> {
    return this.http.get<HttpResponseDTO<Shift[]>>(this.api() + `api/Staff/GetShifts`, {
      headers: this.makeHeaders()
    })
  }

  deleteShift(shiftId: number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Staff/DeleteShift?Id=${shiftId}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.delete', 'httpResponseMessages.elements.shift')
    })
  }

  addShift(shift: Shift): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Staff/AddShift`, shift, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.add', 'httpResponseMessages.elements.shift')
    });
  }

  editShift(shift: Shift): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Staff/EditShift`, shift, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.edit', 'httpResponseMessages.elements.shift')
    });
  }

  getAssignedClasses(staffMemberId: number): Observable<HttpResponseDTO<number[]>> {
    return this.http.get<HttpResponseDTO<number[]>>(this.api() + `api/Staff/GetAssignedClasses?StaffMemberId=${staffMemberId}`, {
      headers: this.makeHeaders()
    })
  }

  getAssignedBranches(staffMemberId: number): Observable<HttpResponseDTO<number[]>> {
    return this.http.get<HttpResponseDTO<number[]>>(this.api() + `api/Staff/GetAssignedBranches?StaffMemberId=${staffMemberId}`, {
      headers: this.makeHeaders()
    })
  }

  getEmployeesRequests(props: EmployeeRequestFilters): Observable<HttpResponseDTO<IStaff[]>> {
    return this.http.post<HttpResponseDTO<IStaff[]>>(this.api() + `api/Staff/GetEmployeesRequests`, props, {
      headers: this.makeHeaders()
    })
  }

  addEmployeeRequest(props: EmployeeRequest): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Staff/AddEmployeeRequest`, props, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.add', 'httpResponseMessages.elements.employeeRequest')
    })
  }

  approveDeclineEmployeeRequest(props: ApproveDeclineEmployeeRequest): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Staff/ApproveDeclineEmployeeRequest`, props, {
      headers: this.makeHeaders()
    })
  }

  finalApproveDeclineEmployeeRequest(props: ApproveDeclineEmployeeRequest): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Staff/FinalApproveDeclineEmployeeRequest`, props, {
      headers: this.makeHeaders()
    })
  }


}
