import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { LookupType } from 'src/app/models/enums';
import { FreeBenefitFilters } from 'src/app/models/extra.model';
import { IBenefitsType } from 'src/app/models/management.model';
import { CommonService } from 'src/app/services/common.service';
import { ManagementService } from 'src/app/services/management.service';
import { MatButtonModule } from '@angular/material/button';

import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BidiModule } from '@angular/cdk/bidi';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-free-benefits-filters',
    templateUrl: './free-benefits-filters.component.html',
    imports: [FormsModule, BidiModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatSelectModule, MatOptionModule, MatButtonModule, TranslateModule]
})
export class FreeBenefitsFiltersComponent implements OnInit {
  @Output() onFilter: EventEmitter<any> = new EventEmitter();
  @Input() filters: FreeBenefitFilters;
  benefits: IBenefitsType[] = [];
  coaches: any[] = [];
  currentLang: string;

  constructor(private managementService: ManagementService, private commonService: CommonService, private translate: TranslateService) { }

  ngOnInit(): void {
    this.currentLang = this.translate.getDefaultLang();
    this.getBenefits();
    this.getCoaches();
  }

  getBenefits() {
    this.managementService.getBenefitsTypes().subscribe({
      next: (res) => {
        this.benefits = res.data;
      }
    })
  }

  getCoaches() {
    this.commonService.getLookup(LookupType.Trainers).subscribe(
      (res: any) => {
        this.coaches = res
      });
  }


}
