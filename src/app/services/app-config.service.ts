import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import baseUrl from '../../../proxy.conf.json';
import { EMPTY, Observable, map, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

interface PackageJson {
  version: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  envUrl: string;
  private proxyUrl = baseUrl['/api'].target;
  private http = inject(HttpClient);

  getVersion(): Observable<string> {
    return this.http.get<PackageJson>('assets/version.json').pipe(
      map((data: PackageJson) => data.version)
    );
  }

  envCheck(): Observable<string> {
    if (!environment.production) {
      this.envUrl = this.proxyUrl;
    } else {
      this.envUrl = environment.server;
    }
    return EMPTY;
  }
}

export function configLoader(configService: AppConfigService):Observable<string> {
  return configService.envCheck();
}
