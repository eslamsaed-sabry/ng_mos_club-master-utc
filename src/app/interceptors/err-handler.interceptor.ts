import { Injectable, inject } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Injectable()
export class ErrHandlerInterceptor implements HttpInterceptor {

  router = inject(Router);
  constructor(private toastr: ToastrService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap((res: any) => {
        if (res.status === 200 && request.headers.has('showSuccessToastr') && request.headers.get('showSuccessToastr') === 'true') {
          let msg: string = request.headers.get('message')!.length > 0 ? request.headers.get('message')! : 'Success';
          this.toastr.success(decodeURI(msg))
        }
      }),
      catchError((err: HttpErrorResponse) => {
        let errMsg;
        if (typeof (err.error) === 'string') {
          errMsg = err.error;
        } else {
          errMsg = err.error.message;
        }
        let errorName = err.url?.split("/");
        if (errorName?.includes("UnlockDoor")) {
          this.toastr.error('Unable to allocate gate.')
        } else if (errMsg?.includes("relogin")) {
          localStorage.clear();
          this.router.navigate(['/auth/login']);
        } else {
          this.toastr.error(errMsg, err.statusText)
        }
        return throwError(err)
      }),

    );

  }
}
