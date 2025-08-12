import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { LookupType } from 'src/app/models/enums';
import { PotentialMemberFilters } from 'src/app/models/member.model';
import { CommonService } from 'src/app/services/common.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';

import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BidiModule } from '@angular/cdk/bidi';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
    selector: 'app-potential-member-filters',
    templateUrl: './potential-member-filters.component.html',
    styleUrls: ['./potential-member-filters.component.scss'],
    imports: [FormsModule, BidiModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatDatepickerModule, MatIconModule, MatButtonModule, TranslateModule, MatCheckboxModule]
})
export class PotentialMemberFiltersComponent implements OnInit {
  @Input() filters: PotentialMemberFilters;
  @Output() onFilterChange: EventEmitter<any> = new EventEmitter();
  currentLang: string;
  sales: any[] = [];
  sources: any[] = [];

  constructor(private translate: TranslateService, private commonService: CommonService) { }

  ngOnInit(): void {
    this.currentLang = this.translate.getDefaultLang();
    this.getSales();
    this.getSources();
  }

  getSales() {
    this.commonService.getLookup(LookupType.Sales).subscribe({
      next: (res: any) => {
        this.sales = res;
      }
    })
  }

  getSources() {
    this.commonService.getLookup(LookupType.SourceOfKnowledge).subscribe({
      next: (res: any) => {
        this.sources = res;
      }
    })
  }
}
