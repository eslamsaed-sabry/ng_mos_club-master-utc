import { Component, DestroyRef, inject } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { IResetPassword } from 'src/app/models/user.model';
import { AuthLoginService } from 'src/app/services/auth-login.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgStyle } from '@angular/common';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { BrandService } from 'src/app/services/brand.service';
import { MatSelectModule } from '@angular/material/select';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonService } from 'src/app/services/common.service';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss'],
    imports: [LoaderComponent, FormsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, TranslateModule, NgStyle, MatSelectModule]
})
export class ResetPasswordComponent {
  private authLogin = inject(AuthLoginService);
  private route = inject(ActivatedRoute);
  private toastr = inject(ToastrService);
  private router = inject(Router);
  private translate = inject(TranslateService);
  public commonService = inject(CommonService);
  destroyRef = inject(DestroyRef);
  brand = inject(BrandService).brand;

  request: IResetPassword = {} as IResetPassword;
  repeatedPW: string;
  pwType1: string = 'password';
  pwType2: string = 'password';
  ifSuccess: boolean;
  branches: any[] = [];



  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.request.email = params['email'];
      this.request.token = params['token'];
      this.ifSuccess = !!params['isSuccess'];
    });

    this.getBranches();

  }

  toggleType(type: number) {
    switch (type) {
      case 2:
        if (this.pwType2 === 'password') {
          this.pwType2 = 'text';
        } else {
          this.pwType2 = 'password'
        }
        break;

      default:
        if (this.pwType1 === 'password') {
          this.pwType1 = 'text';
        } else {
          this.pwType1 = 'password'
        }
        break;
    }

  }

  getBranches() {
    this.commonService.GetBranchesFullDetails().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res: any) => {
        this.branches = res.data;
        if (this.branches.length == 1)
          this.request.branchId = this.branches[0].id;
      }
    })
  }

  reset(f: NgForm) {
    if (this.request.password !== this.repeatedPW) {
      this.toastr.error(this.translate.instant('login.notMatchedPW'));
      return
    }
    if (f.form.status === 'VALID') {
      this.authLogin.resetPassword(this.request).subscribe({
        next: (res) => {
          this.ifSuccess = true;
          this.router.navigate([],
            {
              relativeTo: this.route,
              queryParams: { isSuccess: 'true' },
              queryParamsHandling: "merge", // remove to replace all query params by provided
            });
        }
      })
    }
  }
}
