import { BidiModule } from '@angular/cdk/bidi';

import { Component, DestroyRef, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import moment from 'moment';
import { LookupType } from 'src/app/models/enums';
import { ReminderFilters } from 'src/app/models/extra.model';
import { MemberService } from 'src/app/services/member.service';

@Component({
    selector: 'app-reminders-filters',
    templateUrl: './reminders-filters.component.html',
    styleUrl: './reminders-filters.component.scss',
    imports: [FormsModule, BidiModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatCheckboxModule, MatDatepickerModule, MatButtonModule, TranslateModule]
})
export class RemindersFiltersComponent implements OnInit {
  @Input() filters: ReminderFilters | any;
  @Output() onFilter: EventEmitter<any> = new EventEmitter();
  sales: any[] = [];
  currentLang: string;

  private translate = inject(TranslateService);
  private memberService = inject(MemberService);
  destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.currentLang = this.translate.getDefaultLang();
    this.getSales();
  }


  onChange(fieldName: string, value: MatCheckboxChange) {
    if (!value.checked) {
      this.filters[fieldName] = null;
    } else {
      this.filters[fieldName] = moment(new Date()).format('YYYY-MM-DD') + 'T' + moment(new Date()).format('HH:mm');
    }
  }

  getSales() {
    this.memberService.getLookup(LookupType.Sales, true).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res: any) => {
        this.sales = res;
      }
    })
  }
}
