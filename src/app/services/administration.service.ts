import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpResponseDTO, IGymImage, IPermission, IRole } from '../models/common.model';
import { IAuthorizedUser, IGymSetting, IUser } from '../models/user.model';
import { TranslateService } from '@ngx-translate/core';
@Injectable({
  providedIn: 'root'
})
export class AdministrationService extends APIService {

  constructor(private http: HttpClient, translate: TranslateService) {
    super(translate);
  }


  getUsers(active?: boolean): Observable<HttpResponseDTO<IAuthorizedUser[]>> {
    return this.http.get<HttpResponseDTO<IAuthorizedUser[]>>(this.api() + `api/User/GetUsers?IsActive=${active}`, {
      headers: this.makeHeaders()
    })
  }

  addUser(user: IUser): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/User/AddUser`, user, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.add', 'httpResponseMessages.elements.user')
    })
  }

  editUser(user: IUser): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/User/EditUser`, user, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.edit', 'httpResponseMessages.elements.user')
    })
  }

  activateUser(userID: number): Observable<HttpResponseDTO<IAuthorizedUser[]>> {
    return this.http.get<HttpResponseDTO<IAuthorizedUser[]>>(this.api() + `api/User/ActivateUser?UserId=${userID}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.activate', 'httpResponseMessages.elements.user')
    })
  }

  deactivateUser(userID: number): Observable<HttpResponseDTO<IAuthorizedUser[]>> {
    return this.http.get<HttpResponseDTO<IAuthorizedUser[]>>(this.api() + `api/User/DeactivateUser?UserId=${userID}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.deactivate', 'httpResponseMessages.elements.user')
    })
  }

  changeUserPassword(props: any): Observable<HttpResponseDTO<any>> {
    let params = {
      "userId": props.userId,
      "currentPassword": props.currentPassword,
      "newPassword": props.password
    }
    let url = props.isAdmin ? 'api/User/ChangePassword' : 'api/User/ChangeUserPassword';

    return this.http.post<HttpResponseDTO<any>>(this.api() + `${url}`, params, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.change', 'httpResponseMessages.elements.password')
    })
  }

  getRoles(): Observable<HttpResponseDTO<IRole[]>> {
    return this.http.get<HttpResponseDTO<IRole[]>>(this.api() + `api/Administration/GetRoles`, {
      headers: this.makeHeaders()
    })
  }

  addRole(props: IRole): Observable<HttpResponseDTO<any[]>> {
    return this.http.get<HttpResponseDTO<any[]>>(this.api() + `api/Administration/AddRole?EnglishName=${props.nameEng}&ArabicName=${props.nameAr}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.add', 'httpResponseMessages.elements.role')
    })
  }

  deleteRole(roleId: number): Observable<HttpResponseDTO<any[]>> {
    return this.http.get<HttpResponseDTO<any[]>>(this.api() + `api/Administration/DeleteRole?RoleId=${roleId}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.delete', 'httpResponseMessages.elements.role')
    })
  }

  editRole(props: IRole): Observable<HttpResponseDTO<any[]>> {
    return this.http.get<HttpResponseDTO<any[]>>(this.api() + `api/Administration/EditRole?Id=${props.id}&EnglishName=${props.nameEng}&ArabicName=${props.nameAr}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.edit', 'httpResponseMessages.elements.role')
    })
  }

  getPermissions(roleId: number): Observable<HttpResponseDTO<IPermission[]>> {
    return this.http.get<HttpResponseDTO<IPermission[]>>(this.api() + `api/Administration/GetPermissions?RoleId=${roleId}`, {
      headers: this.makeHeaders()
    })
  }

  editPermissions(roleId: number, props: IPermission[]): Observable<HttpResponseDTO<any[]>> {
    return this.http.post<HttpResponseDTO<any[]>>(this.api() + `api/Administration/EditPermissions?RoleId=${roleId}`, props, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.edit', 'httpResponseMessages.elements.permission')
    })
  }

  getGymImages(page: number, symbol: string, perPage: number = 10, includeVideo: boolean = false): Observable<HttpResponseDTO<IGymImage[]>> {
    return this.http.get<HttpResponseDTO<IGymImage[]>>(this.api() + `api/Utility/GetGymImages?skipCount=${page}&takeCount=${perPage}&includeVideo=${includeVideo}&Symbol=${symbol}`, {
      headers: this.makeHeaders()
    })
  }

  deleteLink(id: number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Utility/DeleteLink?Id=${id}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.delete', 'httpResponseMessages.elements.image')
    })
  }

  addLink(obj: any): Observable<HttpResponseDTO<any>> {
    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Utility/AddLinkWithRedirectURL`, obj, {
      headers: this.makeHeaders()
    })
  }

  uploadImages(formData: FormData) {
    return this.http.post(
      this.api() + 'api/Utility/Upload', formData, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.upload', 'httpResponseMessages.elements.image')
    }
    );
  }

  getGymSettings(): Observable<HttpResponseDTO<IGymSetting[]>> {
    return this.http.get<HttpResponseDTO<IGymSetting[]>>(this.api() + `api/Utility/GetGymSettings`, {
      headers: this.makeHeaders()
    })
  }

  editGymSettings(data: IGymSetting[]): Observable<HttpResponseDTO<any[]>> {
    return this.http.post<HttpResponseDTO<any[]>>(
      this.api() + 'api/Utility/EditGymSettings', data, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.edit', 'httpResponseMessages.elements.gymSettings')
    });
  }

  getUserBranchesId(userId: number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/User/GetUserBranchesId?UserId=${userId}`, {
      headers: this.makeHeaders()
    });
  }

  startWhatsappService() {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Notification/StartWhatsAppService`, {
      headers: this.makeHeaders()
    });
  }

}
