import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { APIService } from './api.service';
import { TranslateService } from '@ngx-translate/core';
import { HttpResponseDTO, IBranch, IBrand } from '../models/common.model';
import { Title } from '@angular/platform-browser';
import { AppConfigService } from './app-config.service';

@Injectable({ providedIn: 'root' })
export class BrandService extends APIService {
  brand: IBrand;
  appConfig = inject(AppConfigService);
  http = inject(HttpClient);
  titleService = inject(Title);
  branches: IBranch[] = [];
  currentBranch: IBranch = JSON.parse(localStorage.getItem('MOSBranch')!);
  constructor(translate: TranslateService) {
    super(translate)
  }

  setBranch(branch: IBranch) {
    this.currentBranch = branch;
    localStorage.setItem('MOSBranch', JSON.stringify(branch));
  }

  getUserBranches(): Observable<HttpResponseDTO<IBranch[]>> {
    return this.http.get<HttpResponseDTO<IBranch[]>>(this.api() + `api/User/GetCurrentUserBranches`, {
      headers: this.makeHeaders('false')
    })
  }

  getBrand(): Observable<IBrand> {
    return this.http.get<HttpResponseDTO<IBrand>>(this.api() + `api/Utility/GetGymInfo`).pipe(map(res => {
      this.brand = res.data;
      this.brand.darkLogoPath = this.appConfig.envUrl + this.brand.darkLogoPath;
      this.brand.lightLogoPath = this.appConfig.envUrl + this.brand.lightLogoPath;
      this.brand.shortLogo = this.appConfig.envUrl + this.brand.shortLogo;
      this.titleService.setTitle(this.brand.name)
      return res.data
    }));
  }
}

export function getBrand(brand: BrandService): Observable<IBrand> {
  return brand.getBrand();
}