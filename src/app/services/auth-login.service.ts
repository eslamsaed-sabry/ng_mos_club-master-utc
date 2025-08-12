import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { IResetPassword, User } from '../models/user.model';
import {  map } from 'rxjs/operators';
import { APIService } from './api.service';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { GymConfig } from '../models/enums';

@Injectable({
  providedIn: 'root',
})
export class AuthLoginService extends APIService {
  constructor(private http: HttpClient, private router: Router, translate: TranslateService) {
    super(translate);
  }

  login(cred: User) {
    return this.http.post(this.api() + 'api/Login', cred).pipe(
      map((res: any) => {
        if (res.token) {
          localStorage.setItem('mosToken', res.token);
        }
        return res;
      })
    );
  }

  getTimezone() {
    return this.http.get(this.api() + `api/Utility/GetRowConstantValue?Symbol=${GymConfig.PereferedTimeZone}`, {
      headers: this.makeHeaders('false')
    })
  }

  getGateUnlockUrl() {
    return this.http.get(this.api() + `api/Utility/GetRowConstantValue?Symbol=${GymConfig.AccessControlAPI}`, {
      headers: this.makeHeaders('false')
    }).pipe(map((res: any) => {
      return res.data
    }))
  }

  resetPassword(props: IResetPassword): Observable<any> {
    return this.http.post<any>(this.api() + `api/Member/ResetMyPassword`, props, {
      headers: this.makeHeaders('false', 'true')
    });
  }

  logout() {
    localStorage.removeItem('mosToken');
    localStorage.removeItem('mosUser');
    this.router.navigate(['/auth/login'], { skipLocationChange: true });
    window.location.reload();
  }
}
