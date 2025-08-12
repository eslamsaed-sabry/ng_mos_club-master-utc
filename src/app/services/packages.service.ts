import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { APIService } from './api.service';
import { Observable } from 'rxjs';
import { HttpResponseDTO } from '../models/common.model';
import { IPackage, Benefit } from '../models/member.model';
import { IClassRoom } from '../models/schedule.model';
import { TranslateService } from '@ngx-translate/core';
import { DateType, StandardDatePipe } from '../pipes/standard-date.pipe';
@Injectable()
export class PackagesService extends APIService {
  standardDate = inject(StandardDatePipe);
  constructor(private http: HttpClient, translate: TranslateService) {
    super(translate);
  }

  getPackages(props: any): Observable<HttpResponseDTO<IPackage>> {
    return this.http.get<HttpResponseDTO<IPackage>>(this.api() + `api/Period/GetPeriod`, {
      headers: this.makeHeaders(),
      params: {
        ActiveOnly: props.activeOnly,
        SearchKey: props.searchKey,
        PackageTypeId: props.packageTypeId,
        MembersPeriodsOnly: props.membersPeriodsOnly,
        IncludeSystemPackages: props.includeSystemPackages,
        skipCount: props.skipCount,
        takeCount: props.takeCount
      }
    });
  }

  deletePackage(packageID: number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Period/DeletePackage?Id=${packageID}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.delete', 'httpResponseMessages.elements.package')
    });
  }

  addPackage(newPackage: IPackage): Observable<HttpResponseDTO<any>> {
    const props = { ...newPackage };

    props.availabilityFrom = newPackage.availabilityFrom ? this.standardDate.transform(props.availabilityFrom, DateType.TO_UTC) : null;
    props.availabilityTo = newPackage.availabilityTo ? this.standardDate.transform(props.availabilityTo, DateType.TO_UTC) : null;

    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Period/AddPackage`, props, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.add', 'httpResponseMessages.elements.package')
    });
  }

  editPackage(currentPackage: IPackage): Observable<HttpResponseDTO<any>> {
    const props = { ...currentPackage };

    props.availabilityFrom = currentPackage.availabilityFrom ? this.standardDate.transform(props.availabilityFrom, DateType.TO_UTC) : null;
    props.availabilityTo = currentPackage.availabilityTo ? this.standardDate.transform(props.availabilityTo, DateType.TO_UTC) : null;

    return this.http.post<HttpResponseDTO<any>>(this.api() + `api/Period/EditPackage`, props, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.edit', 'httpResponseMessages.elements.package')
    });
  }

  getPackageBranches(packageId: number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Period/GetPackageBranches?packageId=${packageId}`, {
      headers: this.makeHeaders()
    });
  }

  getPackageAccessAreas(packageId: number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Period/GetPackageAreas?packageId=${packageId}`, {
      headers: this.makeHeaders()
    });
  }

  activatePackage(packageID: number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Period/ActivatePackage?PackageId=${packageID}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.activate', 'httpResponseMessages.elements.package')
    });
  }

  deactivatePackage(packageID: number): Observable<HttpResponseDTO<any>> {
    return this.http.get<HttpResponseDTO<any>>(this.api() + `api/Period/DeactivatePackage?PackageId=${packageID}`, {
      headers: this.makeHeaders('true', 'true', 'httpResponseMessages.deactivate', 'httpResponseMessages.elements.package')
    });
  }

  getPackageBenefits(packageID: number): Observable<HttpResponseDTO<Benefit[]>> {
    return this.http.get<HttpResponseDTO<Benefit[]>>(this.api() + `api/Period/GetPeriodBenfits?OfferId=1&PeriodId=${packageID}`, {
      headers: this.makeHeaders()
    });
  }

  getPackageClasses(packageID: number): Observable<HttpResponseDTO<IClassRoom[]>> {
    return this.http.get<HttpResponseDTO<IClassRoom[]>>(this.api() + `api/Period/GetClasses?PackageId=${packageID}`, {
      headers: this.makeHeaders()
    });
  }

  getPackagePrograms(packageID: number): Observable<HttpResponseDTO<IClassRoom[]>> {
    return this.http.get<HttpResponseDTO<IClassRoom[]>>(this.api() + `api/Period/GetPrograms?PackageId=${packageID}`, {
      headers: this.makeHeaders()
    });
  }

}
