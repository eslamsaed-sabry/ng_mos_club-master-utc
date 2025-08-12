import { Component, OnInit, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from './services/common.service';
import { RouterOutlet } from '@angular/router';
import { environment } from 'src/environments/environment';
import { registerLicense } from '@syncfusion/ej2-base';
import { BrandService } from './services/brand.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    imports: [RouterOutlet]
})
export class AppComponent implements OnInit {
  private translate = inject(TranslateService);
  private common = inject(CommonService);
  private brandService = inject(BrandService);

  constructor() {
    let selectedLang = localStorage.getItem('mosLang') || 'en';
    this.translate.setDefaultLang(selectedLang);
    localStorage.setItem('mosLang', selectedLang);
    document.documentElement.lang = selectedLang;
    document.documentElement.dir = selectedLang === 'ar' ? 'rtl' : 'ltr';
    this.translate.setDefaultLang(selectedLang);
    // this.translate.onLangChange.emit({ lang: selectedLang, translations: '' });
    this.common.loadStyle(selectedLang);
    let zoom = localStorage.getItem('mosZoom') || 'zoom-lg';
    document.body.id = zoom;
  }

  ngOnInit(): void {
    if (environment.production) {
      registerLicense(this.brandService.brand.syncfusionLicenseKey);
    }
  }
}
