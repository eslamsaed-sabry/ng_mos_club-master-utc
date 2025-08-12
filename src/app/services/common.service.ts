
import { inject, Inject, Injectable, DOCUMENT } from '@angular/core';
import { BehaviorSubject, map, Observable, Subject } from 'rxjs';
import { HttpResponseDTO, IBranch, ICountryCode, INotificationTemplate } from '../models/common.model';
import { ChangePaymentBranchData, Member } from '../models/member.model';
import { APIService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { Attachment } from '../models/staff.model';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { GymConfig, LookupType } from '../models/enums';
import { AddMemberNotification, IMemberNotification, INotification, MatchedMemberNotification, MemberNotificationFilters, SingleMemberNotification } from '../models/reports.model';
import { IClassRoom } from '../models/schedule.model';
import { ActivatedRoute, Router } from '@angular/router';
import { DateType, StandardDatePipe } from '../pipes/standard-date.pipe';
import moment from 'moment';
export interface Loading {
  show: boolean;
  type: string; //overlay...
  color: string; // primary / accent/ warn
}

// export interface IExportExcel {
//   actionType: 'EXPORT_INIT' | 'DATA_READY',
//   displayedCols?: any,
//   dataContent?: any[],
//   fileName?: string
// }

@Injectable({
  providedIn: 'root',
})

export class CommonService extends APIService {

  private http = inject(HttpClient);
  private toastr = inject(ToastrService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private standardDate = inject(StandardDatePipe);

  isFullScreen: boolean;
  constructor(@Inject(DOCUMENT) private document: Document, translate: TranslateService) {
    super(translate);

    document.addEventListener('fullscreenchange', (e) => {
      this.isFullScreen = !this.isFullScreen;
    }, false);
  }

  /**
   *
   * @param filters provide all filters to this function to set them inside the url as query params
   */
  setRouteFilters(filters: { [key: string]: any }) {
    if (Object.keys(filters).length) {
      this.router.navigate([], {
        queryParams: filters,
        queryParamsHandling: null
      });
    }
  }

  /**
   *
   * @returns this returns all your filters to bind them back inside your filters component input
   */
  fetchRouteFilters() {
    let newParams: any = {};
    return this.route.queryParams.pipe(
      map(params => {
        if (Object.keys(params).length) {
          newParams = { ...params };
          Object.keys(newParams).forEach(key => {
            const value = newParams[key];
            const formattedDate = this.dateCheck(value);
            if (formattedDate) {
              newParams[key] = formattedDate;
            } else if (!isNaN(value) && /^\d+$/.test(value)) {
              newParams[key] = Number(value);
            }
          });

          return newParams;
        }
        return null;
      })
    )
  }

  dateCheck(dateString: string) {
    const formats = [
      'ddd MMM DD YYYY HH:mm:ss [GMT]ZZ',
      'ddd MMM DD YYYY HH:mm:ss [GMT]ZZ (.*)'
    ];
    const parsedDate = moment(dateString, formats, true);
    if (parsedDate.isValid()) {
      return this.standardDate.transform(parsedDate, DateType.TO_TIMEZONE);
    }
    return null;
  }

  private theme = new BehaviorSubject<{}>({});
  getTheme = this.theme.asObservable();
  updateTheme(currentTheme: any) {
    this.theme.next(currentTheme);
  }


  private menuStatus = new BehaviorSubject<boolean>(true);
  getMenuStatus = this.menuStatus.asObservable();
  updateMenuStatus(status: boolean) {
    this.menuStatus.next(status);
  }

  isLoading = new Subject<Loading>();
  getIsLoading = this.isLoading.asObservable();
  updateIsLoading(status: Loading) {
    this.isLoading.next(status);
  }

  // exportExcel = new Subject<IExportExcel>();
  // getExportExcel = this.exportExcel.asObservable();
  // updateExportExcel(data: IExportExcel) {
  //   this.exportExcel.next(data);
  // }

  onFullScreen() {
    if (this.isFullScreen) {
      this.document.exitFullscreen();
    } else {
      this.document.documentElement.requestFullscreen();
    }
  }


  loadStyle(styleName: string) {
    let href = styleName === 'ar' ? 'bootstrap-rtl.css' : 'bootstrap-ltr.css'
    const head = this.document.getElementsByTagName('head')[0];

    let themeLink = this.document.getElementById(
      'client-theme'
    ) as HTMLLinkElement;
    if (themeLink) {
      themeLink.href = href;
    } else {
      const style = this.document.createElement('link');
      style.id = 'client-theme';
      style.rel = 'stylesheet';
      style.href = `${href}`;

      head.appendChild(style);
    }

    this.loadPrintStyle();
  }

  loadPrintStyle() {
    const head = this.document.getElementsByTagName('head')[0];
    let printFile = this.document.getElementById('print-css') as HTMLLinkElement;

    if (printFile) {
      printFile.media = 'print';
    } else {
      const style = this.document.createElement('link');
      style.id = 'print-css';
      style.rel = 'stylesheet';
      style.href = `print-style.css`;
      style.media = 'print';
      head.appendChild(style);
    }
  }

  rgbaToHex(rgba: string): string {
    const result = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?\)/);
    if (!result) return rgba; // fallback

    const r = parseInt(result[1], 10);
    const g = parseInt(result[2], 10);
    const b = parseInt(result[3], 10);
    const a = result[4] !== undefined ? Math.round(parseFloat(result[4]) * 255) : 255;

    const toHex = (n: number) => n.toString(16).padStart(2, '0');

    return `#${toHex(r)}${toHex(g)}${toHex(b)}${toHex(a)}`;
  }

  getAttachments(props: any): Observable<HttpResponseDTO<Attachment[]>> {
    return this.http.get<HttpResponseDTO<Attachment[]>>(this.api() + `api/Utility/GetAttachments?contextId=${props.contextId}&contextTypeId=${props.contextTypeId}`, {
      headers: this.makeHeaders()
    })
  }

  addAttachment(props: any, formData: FormData): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Utility/AddAttachments?contextId=${props.contextId}&contextTypeId=${props.contextTypeId}`, formData, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.add', 'httpResponseMessages.elements.attachment')
    })
  }


  getAttachmentsForTrainer(coachId: number): Observable<HttpResponseDTO<Attachment[]>> {
    return this.http.get<HttpResponseDTO<Attachment[]>>(this.api() + `api/Staff/GetTrainerTransformationImages?trainerId=${coachId}`, {
      headers: this.makeHeaders()
    })
  }

  addAttachmentForTrainer(coachId: number, formData: FormData): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Staff/AddTrainerTransformationImage?contextId=${coachId}`, formData, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.add', 'httpResponseMessages.elements.attachment')
    })
  }

  addAttachmentBase64(props: any): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Utility/AddAttachmentBase64`, props, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.add', 'httpResponseMessages.elements.attachment')
    })
  }

  downloadAttachment(AttachmentId: number): Observable<any> {
    return this.http.get<any>(this.api() + `api/Utility/DownloadAttachment?AttachmentId=${AttachmentId}`, {
      headers: this.makeHeaders()
    })
  }

  deleteAttachment(AttachmentId: number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Utility/DeleteAttachment?AttachmentId=${AttachmentId}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.delete', 'httpResponseMessages.elements.attachment')
    })
  }

  confirmMemberPhoto(memberId: number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Member/ConfirmMemberPhoto?memberId=${memberId}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.confirm', 'httpResponseMessages.elements.image')
    })
  }

  declineMemberPhoto(memberId: number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Member/DeclineMemberPhoto?memberId=${memberId}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.decline', 'httpResponseMessages.elements.image')
    })
  }

  getCountryCodes(): Observable<HttpResponseDTO<ICountryCode[]>> {
    return this.http.get<HttpResponseDTO<ICountryCode[]>>(this.api() + `api/utility/GetPhoneFormat`, {
      headers: this.makeHeaders()
    })
  }

  validatePhoneNumber(phoneNo: string, phoneFormatId: number, countryCodes: ICountryCode[]): boolean {
    let status = true;
    if (phoneNo && !phoneFormatId) {
      this.toastr.error(this.translate.instant('common.countryCodeIsMissing'));
      status = false;
    } else if (phoneNo && phoneFormatId) {
      let selectedCountry = countryCodes.find(country => country.id === phoneFormatId);
      if (phoneNo.length != selectedCountry!.lengths) {
        this.toastr.error(this.translate.instant('common.invalidPhoneNumberLength', { lengths: selectedCountry!.lengths }));
        return status = false;
      }
      if (!phoneNo.startsWith(selectedCountry!.startWith)) {
        this.toastr.error(this.translate.instant('common.invalidPhoneNumberStartWith', { startsWith: selectedCountry!.startWith }));
        return status = false;
      }
    }

    return status
  }

  getLookup(lookupID: LookupType, isActive: boolean | null = true, params = '', searchKey: String = ''): Observable<any> {
    return this.http.get<any>(this.api() + `api/LookUp/GetLookUp?LookupId=${lookupID}&searchKey=${searchKey}${isActive === null ? '' : `&IsActive=${isActive}`}${params}`, {
      headers: this.makeHeaders()
    });
  }

  getCurrentUserBranches(): Observable<any> {
    return this.http.get<any>(this.api() + `api/User/GetCurrentUserBranches`, {
      headers: this.makeHeaders()
    });
  }

  GetBranchesFullDetails(): Observable<any> {
    return this.http.get<any>(this.api() + `api/Utility/GetBranchesFullDetails`, {
      headers: this.makeHeaders()
    });
  }

  getBranches(): Observable<HttpResponseDTO<IBranch[]>> {
    return this.http.get<HttpResponseDTO<IBranch[]>>(this.api() + `api/Utility/GetBranches`, {
      headers: this.makeHeaders()
    });
  }

  getClassRooms(isActive: boolean | null = true): Observable<any> {
    return this.http.get<any>(this.api() + `api/Class/GetClassRooms?IsActive=${isActive}`, {
      headers: this.makeHeaders()
    });
  }

  addClassRoom(classRoom: IClassRoom): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Class/AddClassRoom`, classRoom, {
      headers: this.makeHeaders()
    });
  }

  editClassRoom(classRoom: IClassRoom): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Class/EditClassRoom`, classRoom, {
      headers: this.makeHeaders()
    });
  }

  deleteClassRoom(roomId: number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Class/RemoveClassRoom?RoomId=${roomId}`, {
      headers: this.makeHeaders()
    });
  }

  uploadImages(formData: FormData) {
    return this.http.post(
      this.api() + 'api/Utility/Upload', formData, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.upload', 'httpResponseMessages.elements.image')
    }
    );
  }

  getConstValue(symbol: GymConfig): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Utility/GetConstantValue?Symbol=${symbol}`, {
      headers: this.makeHeaders('false')
    })
  }

  getNotificationsTemplates(params: any): Observable<HttpResponseDTO<INotificationTemplate[]>> {
    return this.http.get<HttpResponseDTO<INotificationTemplate[]>>(this.api() + `api/Utility/GetNotificationsTemplates`, {
      headers: this.makeHeaders(),
      params: {
        SkipCount: params.skipCount,
        TakeCount: params.takeCount
      }
    });
  }

  editNotificationsTemplates(notificationTemplate: INotificationTemplate): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Utility/EditNotificationTemplate`, notificationTemplate, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.edit', 'httpResponseMessages.elements.notificationTemplate'),
    });
  }

  getMemberNotifications(props: MemberNotificationFilters): Observable<HttpResponseDTO<IMemberNotification[]>> {
    return this.http.post<HttpResponseDTO<IMemberNotification[]>>(this.api() + `api/Notification/GetMemberNotification`, props, {
      headers: this.makeHeaders()
    });
  }

  getAllNotifications(props: MemberNotificationFilters): Observable<HttpResponseDTO<INotification[]>> {
    return this.http.post<HttpResponseDTO<INotification[]>>(this.api() + `api/Notification/GetNotifications`, props, {
      headers: this.makeHeaders()
    });
  }

  getMatchedMembers(props: MatchedMemberNotification): Observable<HttpResponseDTO<Member[]>> {
    return this.http.post<HttpResponseDTO<Member[]>>(this.api() + `api/Report/GetMatchedMembers`, props, {
      headers: this.makeHeaders()
    });
  }

  addMemberNotifications(props: AddMemberNotification): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Report/AddMemberNotifications`, props, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.send', 'httpResponseMessages.elements.notification')
    });
  }

  addSingleMemberNotification(props: SingleMemberNotification): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Notification/AddNotification`, props, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.send', 'httpResponseMessages.elements.notification')
    });
  }

  changePaymentBranche(props: ChangePaymentBranchData): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Accountant/ChangePaymentBranch?ContextTypeId=${props.contextTypeId}&ContextId=${props.contextId}&BranchId=${props.branchId}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.change', 'httpResponseMessages.elements.changePaymentBranch')
    })
  }
}
