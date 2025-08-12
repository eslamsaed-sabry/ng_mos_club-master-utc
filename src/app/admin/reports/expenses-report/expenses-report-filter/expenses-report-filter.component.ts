
import { Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { LookupType } from 'src/app/models/enums';
import { ExpensesReportFilter } from 'src/app/models/reports.model';
import { MemberService } from 'src/app/services/member.service';

@Component({
    selector: 'app-expenses-report-filter',
    templateUrl: './expenses-report-filter.component.html',
    styleUrl: './expenses-report-filter.component.scss',
    imports: [FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, TranslateModule]
})
export class ExpensesReportFilterComponent implements OnInit {
  @Input() filters: ExpensesReportFilter;
  expensesTypes: any[] = [];
  date: Date = new Date();
  private memberService = inject(MemberService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
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
