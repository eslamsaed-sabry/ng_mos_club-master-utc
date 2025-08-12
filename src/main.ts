import { enableProdMode, APP_INITIALIZER, importProvidersFrom, isDevMode, provideAppInitializer, inject } from '@angular/core';
import { HttpLoaderFactory } from './app/app.module';
import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { StandardDatePipe } from './app/pipes/standard-date.pipe';
import { getBrand, BrandService } from './app/services/brand.service';
import { configLoader, AppConfigService } from './app/services/app-config.service';
import { LoaderInterceptor } from './app/interceptors/loader.interceptor';
import { ErrHandlerInterceptor } from './app/interceptors/err-handler.interceptor';
import { HTTP_INTERCEPTORS, withInterceptorsFromDi, provideHttpClient, HttpClient } from '@angular/common/http';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatPaginationIntlService } from './app/services/mat-paginator-intl.service';
import { provideRouter, withViewTransitions } from '@angular/router';
import routeConfig from './app/app-routes';
import { provideServiceWorker } from '@angular/service-worker';
const MY_DATE_FORMATS = {
    parse: {
        dateInput: 'DD/MM/YYYY'
    },
    display: {
        dateInput: 'DD/MM/YYYY', // Format displayed in the input field
        monthYearLabel: 'MMM YYYY', // Format in the month/year dropdown
        dateA11yLabel: 'LL', // Accessibility format
        monthYearA11yLabel: 'MMMM YYYY', // Accessibility format for month/year
    },
};
if (environment.production) {
    enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        provideRouter(routeConfig, withViewTransitions()),
        importProvidersFrom(BrowserModule, ToastrModule.forRoot({
            positionClass: 'toast-top-center',
        }), TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        })),
        { provide: HTTP_INTERCEPTORS, useClass: ErrHandlerInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
        provideAppInitializer(() => configLoader(inject(AppConfigService))),
        provideAppInitializer(() => getBrand(inject(BrandService))),
        StandardDatePipe,
        provideAnimations(),
        provideHttpClient(withInterceptorsFromDi()),
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        },
        { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
        { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
        { provide: MatPaginatorIntl, useClass: MatPaginationIntlService },
        provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
        })
    ]
})
    .catch(err => console.error(err));
