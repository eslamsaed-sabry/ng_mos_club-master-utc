import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DebtsTableFilters } from 'src/app/models/member.model';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { DebtStatus, Gender, LookupType } from 'src/app/models/enums';
import { CommonService } from 'src/app/services/common.service';
import { MatButtonModule } from '@angular/material/button';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BidiModule } from '@angular/cdk/bidi';
import { FormsModule } from '@angular/forms';
@Component({
    selector: 'app-debts-filters',
    templateUrl: './debts-filters.component.html',
    styleUrls: ['./debts-filters.component.scss'],
    imports: [FormsModule, BidiModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatDatepickerModule, MatButtonModule, TranslateModule]
})
export class DebtsFiltersComponent implements OnInit {
  @Input() filters: DebtsTableFilters;
  @Output() onFilter: EventEmitter<any> = new EventEmitter();
  currentLang: string;
  gender = Gender;
  debtStatus = DebtStatus;
  sales: any[] = [];

  constructor(private commonService: CommonService, private translate: TranslateService) { }

  ngOnInit(): void {
    this.currentLang = this.translate.getDefaultLang();
    this.getSales();
  }

  getSales() {
    this.commonService.getLookup(LookupType.Sales).subscribe({
      next: (res: any) => {
        this.sales = res;
      }
    })
  }
}
