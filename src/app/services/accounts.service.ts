import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { APIService } from './api.service';
import { Observable } from 'rxjs';
import { HttpResponseDTO } from '../models/common.model';
import { FinancialFilters, ExpensesFilters, IFinancial, IExpense, IExpenses, IOtherRevenue, OtherRevenueFilters } from '../models/accounts.model';
import { TranslateService } from '@ngx-translate/core';
import { DateType, StandardDatePipe } from '../pipes/standard-date.pipe';
@Injectable()
export class AccountsService extends APIService {
  utcDate = inject(StandardDatePipe);
  http = inject(HttpClient);
  constructor(translate: TranslateService) {
    super(translate);
  }

  getOtherRevenue(props: OtherRevenueFilters): Observable<HttpResponseDTO<IOtherRevenue>> {
    return this.http.post<HttpResponseDTO<IOtherRevenue>>(this.api() + `api/Accountant/GetOtherRevenue`, props, {
      headers: this.makeHeaders()
    });
  }

  deleteRevenue(revenueID: number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Accountant/DeleteOtherRevenue?Id=${revenueID}`, {
      headers: this.makeHeaders('true', 'true', 'Revenue is deleted successfully.')
    });
  }

  addRevenue(newRevenue: IOtherRevenue): Observable<HttpResponseDTO<any>> {
    const props = {...newRevenue};
    props.actionDate = this.utcDate.transform(props.actionDate, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Accountant/AddOtherRevenue`, props, {
      headers: this.makeHeaders()
    });
  }

  editRevenue(currentRevenue: IOtherRevenue): Observable<HttpResponseDTO<any>> {
    const props = {...currentRevenue};
    props.actionDate = this.utcDate.transform(props.actionDate, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Accountant/EditOtherRevenue`, props, {
      headers: this.makeHeaders()
    });
  }

  /********************************************************************************** */

  getExpenses(props: ExpensesFilters): Observable<HttpResponseDTO<IExpenses>> {
    return this.http.post<HttpResponseDTO<IExpenses>>(this.api() + `api/Accountant/GetExpenses`, props, {
      headers: this.makeHeaders()
    });
  }

  getExpensesTypes(): Observable<HttpResponseDTO<IExpense>> {
    return this.http.get<HttpResponseDTO<IExpense>>(this.api() + `api/Accountant/GetExpenseTypes`, {
      headers: this.makeHeaders()
    });
  }

  deleteExpenses(revenueID: number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Accountant/DeleteExpense?Id=${revenueID}`, {
      headers: this.makeHeaders('true', 'true', 'Revenue is deleted successfully.')
    });
  }

  addExpenses(newRevenue: IExpenses): Observable<HttpResponseDTO<any>> {
    const props = {...newRevenue};
    props.actionDate = this.utcDate.transform(props.actionDate, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Accountant/AddExpense`, props, {
      headers: this.makeHeaders()
    });
  }

  editExpenses(currentRevenue: IExpenses): Observable<HttpResponseDTO<any>> {
    const props = {...currentRevenue};
    props.actionDate = this.utcDate.transform(props.actionDate, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Accountant/EditExpense`, props, {
      headers: this.makeHeaders()
    });
  }

  /********************************************************************************** */

  getFinancial(props: FinancialFilters): Observable<HttpResponseDTO<IFinancial>> {
    return this.http.post<HttpResponseDTO<IFinancial>>(this.api() + `api/Accountant/GetStaffFinancial`, props, {
      headers: this.makeHeaders()
    });
  }

  deleteFinancial(deductionID: number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Accountant/DeleteFinancial?Id=${deductionID}`, {
      headers: this.makeHeaders('true', 'true', 'Revenue is deleted successfully.')
    });
  }

  addFinancial(deduction: IFinancial): Observable<HttpResponseDTO<any>> {
    const props = {...deduction};
    props.actionDate = this.utcDate.transform(props.actionDate, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Accountant/AddFinancial`, props, {
      headers: this.makeHeaders()
    });
  }

  editFinancial(deduction: IFinancial): Observable<HttpResponseDTO<any>> {
    const props = {...deduction};
    props.actionDate = this.utcDate.transform(props.actionDate, DateType.TO_UTC);
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Accountant/EditFinancial`, props, {
      headers: this.makeHeaders()
    });
  }

}
