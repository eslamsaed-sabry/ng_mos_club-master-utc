import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { CommonService, Loading } from '../services/common.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {

  loader: Loading = {} as Loading;
  constructor(private common: CommonService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.headers.has('showSpinner') && request.headers.get('showSpinner') === 'true') {
      this.loader.show = true;
      this.common.updateIsLoading(this.loader);
    }
    return next.handle(request).pipe(
      finalize(() => {
        this.loader.show = false;
        this.common.updateIsLoading(this.loader);
      }),
    );
  }
}
