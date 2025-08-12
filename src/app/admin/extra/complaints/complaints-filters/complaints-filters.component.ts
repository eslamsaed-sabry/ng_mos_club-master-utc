import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { LookupType } from 'src/app/models/enums';
import { ComplaintsFilters } from 'src/app/models/extra.model';
import { CommonService } from 'src/app/services/common.service';
import { MatButtonModule } from '@angular/material/button';

import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BidiModule } from '@angular/cdk/bidi';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-complaints-filters',
    templateUrl: './complaints-filters.component.html',
    styleUrls: ['./complaints-filters.component.scss'],
    imports: [FormsModule, BidiModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatButtonModule, TranslateModule]
})
export class ComplaintsFiltersComponent implements OnInit {
  @Output() onFilter: EventEmitter<any> = new EventEmitter();
  @Input() filters: ComplaintsFilters;
  complaintsStatus: any[] = [];
  gymSections: any[] = [];
  currentLang: string;


  constructor(private commonService: CommonService, private translate: TranslateService) { }

  ngOnInit(): void {
    this.currentLang = this.translate.getDefaultLang();
    this.getComplaintStatus();
    this.getGymSections();
  }

  getComplaintStatus() {
    this.commonService.getLookup(LookupType.ComplaintStatus).subscribe({
      next: (res: any) => {
        this.complaintsStatus = res;
      }
    })
  }

  getGymSections() {
    this.commonService.getLookup(LookupType.GymSections).subscribe({
      next: (res: any) => {
        this.gymSections = res;
      }
    })
  }
}
