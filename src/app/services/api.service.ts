import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../environments/environment';
@Injectable({
    providedIn: 'root'
})

export class APIService {
    currentLang: string; // 0 = arabic,  1 = english

    constructor(public translate: TranslateService) {
        this.currentLang = this.translate.defaultLang === 'en' ? '1' : '0';
    }

    api(): string {
        return environment.server + '/';
    }

    makeHeaders(showSuccessToastr: string = '', showSpinner: string = 'true', actionName: string = 'httpResponseMessages.commonAction',
        elementName: string = 'httpResponseMessages.elements.commonElement'): any {

        let _branch = localStorage.getItem('MOSBranch') ? JSON.parse(localStorage.getItem('MOSBranch')!) : null;

        const options: any = {
            // Encoding: "utf-8",
            Authorization: 'Bearer ' + localStorage.getItem('mosToken'),
            // "Content-Type": "application/json",
            "Accept": "*",
            "Lang": this.currentLang,
            "Branch": _branch ? _branch.id : '',
            showSuccessToastr: showSuccessToastr,
            showSpinner: showSpinner,
            message: encodeURI(this.getTranslatedMsg(actionName, elementName))
        };
        return options;
    }

    getTranslatedMsg(actionName: string, elementName: string): string {
        return this.translate.instant(actionName,
            { element: this.translate.instant(elementName) }
        )
    }

}