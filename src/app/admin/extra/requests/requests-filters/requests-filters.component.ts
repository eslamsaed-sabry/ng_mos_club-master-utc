import { BidiModule } from '@angular/cdk/bidi';

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LookupType } from 'src/app/models/enums';
import { RequestsFilters } from 'src/app/models/extra.model';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-requests-filters',
  templateUrl: './requests-filters.component.html',
  styleUrl: './requests-filters.component.scss',
  imports: [FormsModule, BidiModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatButtonModule, TranslateModule]
})
export class RequestsFiltersComponent implements OnInit {
  @Output() onFilter: EventEmitter<any> = new EventEmitter();
  @Input() filters: RequestsFilters;
  requestsType: any[] = [];
  currentLang: string;

  constructor(private commonService: CommonService, private translate: TranslateService) { }

  ngOnInit(): void {
    this.currentLang = this.translate.getDefaultLang();
    this.getRequestType();
  }

  getRequestType() {
    this.commonService.getLookup(LookupType.RequestsTypes).subscribe({
      next: (res: any) => {
        this.requestsType = res;
      }
    })
  }
}
