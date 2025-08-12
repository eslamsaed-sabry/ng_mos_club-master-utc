import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { APIService } from './api.service';
import { Observable } from 'rxjs';
import { HttpResponseDTO } from '../models/common.model';
import {
  IAnnouncement, IBenefitsType, IExpensesType, IGymRule, INews, IRange, IRangePercentage,
  ISessionType, ITarget, newsFilters, IPageField, RangePercentageFilter, MachinesFilters, IMachine, IFAQ, IExercise,
  IWorkOut, IPackagesCommissionsMonths, IpackagesCommissions, InstructorClassesPrice, dialogInstructorClassesPriceData,
  IClosingTransactions, IAddClosingTransactionsData, IAddClosingTransactions, ICallsFeedback, CallsFeedbackFilters,
  INewsTypes,
  IEventBooking
} from '../models/management.model';
import { TranslateService } from '@ngx-translate/core';
import { RangePercentageSymbol, RequiredFieldPage } from '../models/enums';
import { DateType, StandardDatePipe } from '../pipes/standard-date.pipe';

@Injectable({
  providedIn: 'root'
})
export class ManagementService extends APIService {

  constructor(private http: HttpClient, translate: TranslateService) {
    super(translate);
  }

  standardDate = inject(StandardDatePipe);


  getAnnouncements(id: string | null = null, title: string | null = null): Observable<HttpResponseDTO<IAnnouncement>> {

    let params = ``;

    if (id && id.trim().length > 0 && title && title.trim().length > 0) {
      params = `?Id=${id}&Title=${title}`;
    } else if (id && id.trim().length > 0) {
      params = `?Id=${id}`;
    } else if (title && title.trim().length > 0) {
      params = `?Title=${title}`;
    }


    return this.http.get<HttpResponseDTO<IAnnouncement>>(this.api() + `api/Announcement/GetAnnouncements${params}`, {
      headers: this.makeHeaders()
    });
  }

  addAnnouncement(props: IAnnouncement): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Announcement/AddAnnouncement`, props, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.add', 'httpResponseMessages.elements.announcement')
    });
  }

  editAnnouncement(props: IAnnouncement): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Announcement/EditAnnouncement`, props, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.edit', 'httpResponseMessages.elements.announcement')
    });
  }

  deleteAnnouncement(id: number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Announcement/DeleteAnnouncement?Id=${id}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.delete', 'httpResponseMessages.elements.announcement')
    });
  }

  getRanges(symbol: string): Observable<HttpResponseDTO<IRange[]>> {
    return this.http.get<HttpResponseDTO<IRange[]>>(this.api() + `api/Period/GetRanges`, {
      headers: this.makeHeaders(),
      params: {
        Symbol: symbol,
      }
    });
  }

  addRange(from: number, to: number, symbol: string): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Period/AddRange?From=${from}&To=${to}&Symbol=${symbol}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.add', 'httpResponseMessages.elements.range')
    });
  }

  editRange(from: number, to: number, id: number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Period/EditRange?Id=${id}&From=${from}&To=${to}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.edit', 'httpResponseMessages.elements.range')
    });
  }

  deleteRange(id: number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Period/DeleteRange?Id=${id}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.delete', 'httpResponseMessages.elements.range')
    });
  }

  getSessionTypes(activeOnly: boolean = false): Observable<HttpResponseDTO<ISessionType[]>> {
    return this.http.get<HttpResponseDTO<ISessionType[]>>(this.api() + `api/Session/GetSessionTypes?activeOnly=${activeOnly}`, {
      headers: this.makeHeaders()
    });
  }

  addSessionTypes(sessionType: ISessionType): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Session/AddSessionType`, sessionType, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.add', 'httpResponseMessages.elements.sessionType')
    });
  }

  editSessionTypes(sessionType: ISessionType): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Session/EditSessionType`, sessionType, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.edit', 'httpResponseMessages.elements.sessionType')
    });
  }

  deleteSessionType(id: number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Session/DeleteSessionType?Id=${id}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.delete', 'httpResponseMessages.elements.sessionType')
    });
  }

  getGymRules(): Observable<HttpResponseDTO<IGymRule[]>> {
    return this.http.get<HttpResponseDTO<IGymRule[]>>(this.api() + `api/Utility/GetGymRules?RuleType=0`, {
      headers: this.makeHeaders()
    })
  }

  addGymRule(rule: IGymRule): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Utility/AddGymRule`, rule, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.add', 'httpResponseMessages.elements.gymRule')
    });
  }

  editGymRule(rule: IGymRule): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Utility/EditGymRule`, rule, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.edit', 'httpResponseMessages.elements.gymRule')
    });
  }

  deleteGymRule(id: number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Utility/DeleteGymRule?Id=${id}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.delete', 'httpResponseMessages.elements.gymRule')
    });
  }

  getExpensesTypes(): Observable<HttpResponseDTO<IExpensesType[]>> {
    return this.http.get<HttpResponseDTO<IExpensesType[]>>(this.api() + `api/Accountant/GetExpenseTypes`, {
      headers: this.makeHeaders()
    })
  }

  addExpensesType(rule: IExpensesType): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Accountant/AddExpenseType`, rule, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.add', 'httpResponseMessages.elements.expensesType')
    });
  }

  editExpensesType(rule: IExpensesType): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Accountant/EditExpenseType`, rule, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.edit', 'httpResponseMessages.elements.expensesType')
    });
  }

  deleteExpensesType(id: number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Accountant/DeleteExpenseType?Id=${id}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.delete', 'httpResponseMessages.elements.expensesType')
    });
  }

  /********************************************************* */

  getBenefitsTypes(isIncluded: boolean = false): Observable<HttpResponseDTO<IBenefitsType[]>> {
    return this.http.get<HttpResponseDTO<IBenefitsType[]>>(this.api() + `api/Period/GetAllBenfits?isIncluded=${isIncluded}`, {
      headers: this.makeHeaders()
    })
  }

  addBenefitsType(benefit: IBenefitsType): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Period/AddBenfit`, benefit, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.add', 'httpResponseMessages.elements.benefit')
    });
  }

  editBenefitsType(benefit: IBenefitsType): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Period/EditBenfit`, benefit, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.edit', 'httpResponseMessages.elements.benefit')
    });
  }

  deleteBenefitsType(id: number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Period/DeleteBenfit?Id=${id}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.delete', 'httpResponseMessages.elements.benefit')
    });
  }

  /************************************************************** */

  getStaffRangePercentages(props: RangePercentageFilter): Observable<HttpResponseDTO<IRangePercentage[]>> {
    return this.http.get<HttpResponseDTO<IRangePercentage[]>>(this.api() + `api/Staff/GetStaffRangePercentages`, {
      headers: this.makeHeaders(),
      params: {
        Symbol: props.symbol,
        Month: props.month,
        Year: props.year,
        StaffMemberId: props.staffMemberId,
        SkipCount: props.skipCount,
        TakeCount: props.takeCount
      }
    });
  }

  addRangePercentage(symbol: RangePercentageSymbol, rangePercentage: IRangePercentage): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Staff/AddStaffRangePercentages?Symbol=${symbol}`, rangePercentage, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.add', 'httpResponseMessages.elements.rangePercentage')
    });
  }

  editRangePercentage(symbol: RangePercentageSymbol, rangePercentage: IRangePercentage): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Staff/EditStaffRangePercentages?Symbol=${symbol}`, rangePercentage, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.edit', 'httpResponseMessages.elements.rangePercentage')
    });
  }

  deleteRangePercentage(props: RangePercentageFilter): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Staff/DeleteStaffRangePercentage`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.delete', 'httpResponseMessages.elements.rangePercentage'),
      params: {
        Symbol: props.symbol,
        Month: props.month,
        Year: props.year,
        StaffMemberId: props.staffMemberId
      }
    });
  }

  /************************************************************************************************* */
  getTargets(props: RangePercentageFilter): Observable<HttpResponseDTO<ITarget[]>> {
    return this.http.get<HttpResponseDTO<ITarget[]>>(this.api() + `api/Staff/GetStaffTargets`, {
      headers: this.makeHeaders(),
      params: {
        Symbol: props.symbol,
        Month: props.month,
        Year: props.year,
        StaffMemberId: props.staffMemberId,
        SkipCount: props.skipCount,
        TakeCount: props.takeCount
      }
    });
  }

  addTarget(symbol: RangePercentageSymbol, target: ITarget): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Staff/AddStaffTargets?Symbol=${symbol}`, target, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.add', 'httpResponseMessages.elements.target')
    });
  }

  editTarget(id: number, value: number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Staff/EditStaffTargets?Id=${id}&TargetValue=${value}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.edit', 'httpResponseMessages.elements.target')
    });
  }

  deleteTarget(props: RangePercentageFilter): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Staff/DeleteStaffTargets`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.delete', 'httpResponseMessages.elements.target'),
      params: {
        Symbol: props.symbol,
        Month: props.month,
        Year: props.year,
        StaffMemberId: props.staffMemberId
      }
    });
  }

  /********************************************************************************* */
  GetNewsTypes(): Observable<INewsTypes[]> {
    const obj = {
      TypeId: null
    }
    return this.http.post<INewsTypes[]>(this.api() + `api/Utility/GetNewsTypes`, obj, {
      headers: this.makeHeaders()
    });
  }

  getNews(params: newsFilters): Observable<HttpResponseDTO<INews[]>> {
    return this.http.get<HttpResponseDTO<INews[]>>(this.api() + `api/Utility/GetNews?TypeId=${params.typeId}&skipCount=${params.skipCount}&takeCount=${params.takeCount}`, {
      headers: this.makeHeaders()
    });
  }
  addNews(newsObj: INews, utilityType: string): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Utility/AddNews`, newsObj, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.add', `httpResponseMessages.elements.${utilityType.toLowerCase()}`)
    });
  }
  editNews(newsObj: INews, utilityType: string): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Utility/EditNews`, newsObj, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.edit', `httpResponseMessages.elements.${utilityType.toLowerCase()}`)
    });
  }
  deleteNews(id: number, utilityType: string): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Utility/DeleteNews?Id=${id}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.delete', `httpResponseMessages.elements.${utilityType.toLowerCase()}`)
    });
  }
  /********************************************************************************** */

  getPageFields(PageName: RequiredFieldPage): Observable<HttpResponseDTO<any[]>> {
    return this.http.get<HttpResponseDTO<any[]>>(this.api() + `api/Utility/GetPageFields?PageDevName=${PageName}`, {
      headers: this.makeHeaders()
    });
  }

  editPageField(props: IPageField): Observable<HttpResponseDTO<IPageField[]>> {
    return this.http.post<HttpResponseDTO<IPageField[]>>(this.api() + `api/Utility/EditPageFields`, props, {
      headers: this.makeHeaders()
    });
  }

  /********************************************************************************** */

  getMachines(props: MachinesFilters): Observable<HttpResponseDTO<IMachine[]>> {
    return this.http.post<HttpResponseDTO<IMachine[]>>(this.api() + `api/Utility/GetMachines`, props, {
      headers: this.makeHeaders()
    });
  }

  addMachine(machine: IMachine): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Utility/AddMachine`, machine, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.add', 'httpResponseMessages.elements.machine'),
    });
  }

  editMachine(machine: IMachine): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Utility/EditMachine`, machine, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.edit', 'httpResponseMessages.elements.machine'),
    });
  }

  deleteMachine(machineID: number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Utility/DeleteMachine?Id=${machineID}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.delete', 'httpResponseMessages.elements.machine'),
    });
  }

  /***************************************************************************************** */
  getFAQs(): Observable<HttpResponseDTO<IFAQ[]>> {
    return this.http.get<HttpResponseDTO<IFAQ[]>>(this.api() + `api/Utility/GetFrequentlyAskedQuestions`, {
      headers: this.makeHeaders()
    });
  }

  addFAQ(faq: IFAQ): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Utility/AddFrequentlyAskedQuestion`, faq, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.add', 'httpResponseMessages.elements.faq'),
    });
  }

  editFAQ(faq: IFAQ): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Utility/EditFrequentlyAskedQuestion`, faq, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.edit', 'httpResponseMessages.elements.faq'),
    });
  }

  deleteFAQ(faqID: number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Utility/DeleteFrequentlyAskedQuestion?Id=${faqID}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.delete', 'httpResponseMessages.elements.faq'),
    });
  }

  /************************************************************************************* */
  getExercises(params: any): Observable<HttpResponseDTO<IExercise[]>> {
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

  addExercise(exercise: IExercise): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Workout/AddExercise`, exercise, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.add', 'httpResponseMessages.elements.exercise'),
    });
  }

  editExercise(exercise: IExercise): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Workout/EditExercise`, exercise, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.edit', 'httpResponseMessages.elements.exercise'),
    });
  }

  deleteExercise(exerciseId: number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Workout/DeleteExercise?Id=${exerciseId}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.delete', 'httpResponseMessages.elements.exercise'),
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

  getPackagesCommissionsMonths(params: any): Observable<HttpResponseDTO<IPackagesCommissionsMonths[]>> {
    return this.http.get<HttpResponseDTO<IPackagesCommissionsMonths[]>>(this.api() + `api/Period/GetPackagesCommissionsMonths`, {
      headers: this.makeHeaders(),
      params: {
        skipCount: params.skipCount,
        takeCount: params.takeCount
      }
    });
  }

  addPackagesCommissionsMonths(params: any): Observable<HttpResponseDTO<IPackagesCommissionsMonths[]>> {
    return this.http.get<HttpResponseDTO<IPackagesCommissionsMonths[]>>(this.api() + `api/Period/AddPackagesCommissionsMonth`, {
      headers: this.makeHeaders(),
      params: {
        month: params.month,
        year: params.year
      }
    });
  }

  deletePackagesCommissionsMonths(params: any): Observable<HttpResponseDTO<IPackagesCommissionsMonths[]>> {
    return this.http.get<HttpResponseDTO<IPackagesCommissionsMonths[]>>(this.api() + `api/Period/DeletePackageCommissionMonth`, {
      headers: this.makeHeaders(),
      params: {
        Month: params.month,
        Year: params.year
      }
    });
  }

  getPackagesCommissions(params: any): Observable<HttpResponseDTO<IPackagesCommissionsMonths[]>> {
    return this.http.get<HttpResponseDTO<IPackagesCommissionsMonths[]>>(this.api() + `api/Period/GetPackagesCommissions`, {
      headers: this.makeHeaders(),
      params: {
        Month: params.month,
        Year: params.year,
        SkipCount: params.skipCount,
        TakeCount: params.takeCount
      }
    });
  }

  addPackagesCommissions(packages: IpackagesCommissions): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Period/AddPackageCommission`, packages, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.add', 'httpResponseMessages.elements.packageCommission'),
    });
  }

  editPackagesCommissions(packages: IpackagesCommissions): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Period/EditPackageCommission`, packages, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.edit', 'httpResponseMessages.elements.packageCommission'),
    });
  }

  copyPackagesCommissionsFromOtherMonth(packages: IPackagesCommissionsMonths): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Period/CopyPackagesCommissionsFromOtherMonth`, packages, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.copy', 'httpResponseMessages.elements.packageCommission'),
    });
  }

  deletePackageCommission(params: any): Observable<HttpResponseDTO<IPackagesCommissionsMonths[]>> {
    return this.http.get<HttpResponseDTO<IPackagesCommissionsMonths[]>>(this.api() + `api/Period/DeletePackageCommission`, {
      headers: this.makeHeaders(),
      params: {
        PackageId: params.packageId,
        Month: params.month,
        Year: params.year
      }
    });
  }

  getAssignedClassesFullDetails(instructorId: number): Observable<HttpResponseDTO<InstructorClassesPrice[]>> {
    return this.http.get<HttpResponseDTO<InstructorClassesPrice[]>>(this.api() + `api/Staff/GetAssignedClassesFullDetails?instructorId=${instructorId}`, {
      headers: this.makeHeaders(),
    });
  }

  setPriceForInstructorsClasses(instructorClasses: dialogInstructorClassesPriceData): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Staff/SetPriceForInstructorsClasses`, instructorClasses, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.edit', 'httpResponseMessages.elements.instructorsClassesRates')
    })
  }


  getEndOfDayTransactions(): Observable<HttpResponseDTO<IClosingTransactions[]>> {
    return this.http.get<HttpResponseDTO<IClosingTransactions[]>>(this.api() + `api/Accountant/GetEndOfDayTransactions`, {
      headers: this.makeHeaders()
    });
  }

  getEndOfDaysTotal(): Observable<HttpResponseDTO<number>> {
    return this.http.get<HttpResponseDTO<number>>(this.api() + `api/Accountant/GetEndOfDaysTotal`, {
      headers: this.makeHeaders()
    });
  }


  getEndOfDayAmount(date: string): Observable<HttpResponseDTO<IAddClosingTransactionsData>> {
    return this.http.post<HttpResponseDTO<IAddClosingTransactionsData>>(this.api() + `api/Accountant/GetEndOfDayAmount`, { date: date }, {
      headers: this.makeHeaders(),
    });
  }

  addEndOfDaysTransaction(closingTransactions: IAddClosingTransactions): Observable<HttpResponseDTO<any>> {
    closingTransactions = { ...closingTransactions };
    closingTransactions.to = this.standardDate.transform(closingTransactions.to, DateType.TO_UTC);

    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Accountant/AddEndOfDayTransaction`, closingTransactions, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.add', 'httpResponseMessages.elements.closingTransaction'),
    });
  }

  getCallsFeedback(props: CallsFeedbackFilters): Observable<HttpResponseDTO<ICallsFeedback[]>> {
    return this.http.get<HttpResponseDTO<ICallsFeedback[]>>(this.api() + `api/Call/GetFeedback`, {
      headers: this.makeHeaders(),
      params: {
        SkipCount: props.skipCount,
        TakeCount: props.takeCount
      }
    })
  }

  addCallsFeedback(callFeedback: ICallsFeedback): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Call/AddFeedback`, callFeedback, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.add', 'httpResponseMessages.elements.callFeedback')
    });
  }

  editCallsFeedback(callFeedback: ICallsFeedback): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Call/EditFeedBack`, callFeedback, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.edit', 'httpResponseMessages.elements.callFeedback')
    });
  }

  getEventBookings(eventId: number): Observable<HttpResponseDTO<IEventBooking[]>> {
    return this.http.get<HttpResponseDTO<IEventBooking[]>>(this.api() + `api/Utility/GetEventBookings?eventId=${eventId}`, {
      headers: this.makeHeaders()
    });
  }

  deleteMemberEventBooking(eventId: number, memberId: number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Utility/DeleteEventBooking?EventId=${eventId}&MemberId=${memberId}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.delete', 'httpResponseMessages.elements.booking')
    });
  }

  getSingleEvent(eventId: number): Observable<HttpResponseDTO<[]>> {
    return this.http.get<HttpResponseDTO<[]>>(this.api() + `api/Utility/GetNews?Id=${eventId}`, {
      headers: this.makeHeaders()
    });
  }

  addEventBooking(event: IEventBooking): Observable<HttpResponseDTO<boolean>> {
    return this.http.post<HttpResponseDTO<boolean>>(this.api() + `api/Utility/AddEventBooking`, event, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.add', 'httpResponseMessages.elements.booking')
    });
  }

}
