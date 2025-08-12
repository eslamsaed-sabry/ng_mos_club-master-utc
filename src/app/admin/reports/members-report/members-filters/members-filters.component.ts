import { Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { forkJoin } from 'rxjs';
import { Gender, LookupType } from 'src/app/models/enums';
import { MembersFilters } from 'src/app/models/reports.model';
import { MemberService } from 'src/app/services/member.service';
import { TranslateModule } from '@ngx-translate/core';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonService } from 'src/app/services/common.service';
import { MatRadioModule } from '@angular/material/radio';

@Component({
    selector: 'app-members-filters',
    templateUrl: './members-filters.component.html',
    styleUrls: ['./members-filters.component.scss'],
    imports: [FormsModule, MatFormFieldModule, MatRadioModule, MatInputModule, MatSelectModule, MatOptionModule, MatDatepickerModule, MatCheckboxModule, TranslateModule]
})
export class MembersFiltersComponent implements OnInit {
  @Input() filters: MembersFilters | any;
  destroyRef = inject(DestroyRef);

  sales: any[] = [];
  nationality: any[] = [];
  region: any[] = [];
  level: any[] = [];
  sources: any[] = [];
  gender = Gender;
  isActive: boolean = true;

  public memberService = inject(MemberService);
  public commonService = inject(CommonService);

  ngOnInit(): void {
    this.filters.isPossibleMember = null;
    this.callLookups();
  }

  getSales() {
    this.commonService.getLookup(LookupType.Sales, this.isActive).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res: any) => {
        this.sales = res;
      }
    })
  }

  callLookups() {
    return forkJoin({
      sales: this.getLookups('sales'),
      nationality: this.getLookups('nationalities'),
      region: this.getLookups('regions'),
      level: this.getLookups('memberLevel'),
      sources: this.getLookups('sourceOfKnowledge'),
    }).pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res: any) => {
        this.sales = res.sales;
        this.nationality = res.nationality;
        this.region = res.region;
        this.level = res.level;
        this.sources = res.sources;
      });
  }

  getLookups(lookupName: string): any {
    switch (lookupName) {
      case 'sales':
        return this.memberService.getLookup(LookupType.Sales, this.isActive);
      case 'nationalities':
        return this.memberService.getLookup(LookupType.Nationalities);
      case 'regions':
        return this.memberService.getLookup(LookupType.Regions);
      case 'memberLevel':
        return this.memberService.getLookup(LookupType.MemberLevel);
      case 'sourceOfKnowledge':
        return this.memberService.getLookup(LookupType.SourceOfKnowledge);
    }
  }

  onChange(fieldName: string, value: MatCheckboxChange) {
    if (!value.checked) {
      this.filters[fieldName] = null;
    } else {
      this.filters[fieldName] = new Date();;
    }
  }
}
