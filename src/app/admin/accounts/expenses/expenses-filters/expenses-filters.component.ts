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
import { ExpensesFilters, IExpense } from 'src/app/models/accounts.model';
import { LookupType } from 'src/app/models/enums';
import { MemberService } from 'src/app/services/member.service';

@Component({
    selector: 'app-expenses-filters',
    templateUrl: './expenses-filters.component.html',
    styleUrl: './expenses-filters.component.scss',
    imports: [FormsModule, BidiModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatDatepickerModule, MatIconModule, MatButtonModule, TranslateModule]
})
export class ExpensesFiltersComponent {
  @Input() filters: ExpensesFilters;
  @Output() onFilterChange: EventEmitter<any> = new EventEmitter();
  currentLang: string;
  expensesTypes: IExpense[] = [];

  private memberService = inject(MemberService);
  private translate = inject(TranslateService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.currentLang = this.translate.getDefaultLang();
    this.getExpensesTypes();

  }

  getExpensesTypes() {
    this.memberService.getLookup(LookupType.ExpensesTypes).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res: any) => {
        this.expensesTypes = res;
      }
    })
  }


}
