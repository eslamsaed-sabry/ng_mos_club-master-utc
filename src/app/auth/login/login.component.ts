import { Component, OnInit, inject } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { AuthLoginService } from 'src/app/services/auth-login.service';
import { mergeMap, forkJoin, map, finalize } from 'rxjs';
import moment from 'moment-timezone';
import { BrandService } from 'src/app/services/brand.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgStyle } from '@angular/common';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { AppConfigService } from 'src/app/services/app-config.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [
    LoaderComponent,
    NgStyle,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    TranslateModule,
    MatProgressSpinnerModule,
    MatIconModule
]
})
export class LoginComponent implements OnInit {
  loading: boolean;
  user: User = {} as User;
  brand = inject(BrandService).brand;
  private config = inject(AppConfigService);
  appVersion: string;
  constructor(private authLogin: AuthLoginService, private router: Router) { }

  ngOnInit(): void {

    this.config.getVersion().subscribe(version => {
      this.appVersion = version;
    });


    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && event.url === '/auth/login') {
        // reload the page to clear the browser cache
        // window.location.reload();
        localStorage.clear();
        sessionStorage.clear();
      }
    });
  }

  login(f: NgForm) {
    if (f.form.status === 'VALID') {
      this.loading = true;
      this.user.clientId = 'MOS_Club_Portal';

      this.authLogin.login(this.user).pipe(
        finalize(() => this.loading = false),
        mergeMap(user => forkJoin([
          this.authLogin.getGateUnlockUrl(),
          this.authLogin.getTimezone()
        ]).pipe(map(([unlockUrl, timezone]: [string, any]) => {
          user.userInfo.gateUrl = unlockUrl;
          if (timezone.data) {
            user.userInfo.timezone = timezone.data;
          } else {
            user.userInfo.timezone = moment.tz.guess();
          }
          localStorage.setItem('mosUser', JSON.stringify(user.userInfo));
        })))
      ).subscribe({
        next: () => {
          this.router.navigate(['/admin']);
        }
      });
    }
  }
}
