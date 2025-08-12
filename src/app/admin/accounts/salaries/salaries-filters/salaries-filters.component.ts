import { BidiModule } from '@angular/cdk/bidi';

import { Component, DestroyRef, EventEmitter, Input, Output, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FinancialFilters } from 'src/app/models/accounts.model';
import { LookupType } from 'src/app/models/enums';
import { CommonService } from 'src/app/services/common.service';

@Component({
    selector: 'app-salaries-filters',
    templateUrl: './salaries-filters.component.html',
    styleUrl: './salaries-filters.component.scss',
    imports: [FormsModule, BidiModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatDatepickerModule, MatIconModule, MatButtonModule, TranslateModule]
})
export class SalariesFiltersComponent {
  @Input() filters: FinancialFilters;
  @Output() onFilterChange: EventEmitter<any> = new EventEmitter();
  currentLang: string;
  staffMembers: any[] = [];

  private commonService = inject(CommonService);
  private translate = inject(TranslateService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.currentLang = this.translate.getDefaultLang();
    this.getStaffMembers();

  }

  getStaffMembers() {
    this.commonService.getLookup(LookupType.Staff).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res: any) => {
        this.staffMembers = res;
      }
    })
  }
}
