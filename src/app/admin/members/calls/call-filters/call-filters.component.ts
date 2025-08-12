import { Component, DestroyRef, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { LookupType } from 'src/app/models/enums';
import { CallsFilters } from 'src/app/models/member.model';
import { MemberService } from 'src/app/services/member.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';

import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BidiModule } from '@angular/cdk/bidi';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-call-filters',
    templateUrl: './call-filters.component.html',
    styleUrls: ['./call-filters.component.scss'],
    imports: [FormsModule, BidiModule, MatFormFieldModule, MatDatepickerModule, MatInputModule, MatSelectModule, MatOptionModule, MatCheckboxModule, MatButtonModule, TranslateModule]
})
export class CallFiltersComponent implements OnInit {
  @Input() filters: CallsFilters;
  @Output() onFilter: EventEmitter<any> = new EventEmitter();
  currentLang: string;
  feedBack: any[] = [];
  sales: any[] = [];
  sources: any[] = [];

  private memberService = inject(MemberService);
  private translate = inject(TranslateService);
  private destroyRef = inject(DestroyRef);


  ngOnInit(): void {
    this.filters.lastCallOnly = true;
    this.currentLang = this.translate.getDefaultLang();
    this.getFeedbackDD();
    this.getSales();
    this.getSources();
  }

  getFeedbackDD() {
    this.memberService.getCallFeedback().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.feedBack = res.data;
      }
    })
  }

  getSales() {
    this.memberService.getLookup(LookupType.Sales).subscribe({
      next: (res: any) => {
        this.sales = res;
      }
    })
  }

  getSources() {
    this.memberService.getLookup(LookupType.SourceOfKnowledge).subscribe({
      next: (res: any) => {
        this.sources = res;
      }
    })
  }
}
