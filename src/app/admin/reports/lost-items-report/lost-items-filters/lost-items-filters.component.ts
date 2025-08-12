import { Component, Input, OnInit } from '@angular/core';
import { isNull } from 'lodash-es';
import { forkJoin } from 'rxjs';
import { LookupType } from 'src/app/models/enums';
import { lostItemsReportFilter } from 'src/app/models/reports.model';
import { MemberService } from 'src/app/services/member.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-lost-items-filters',
    templateUrl: './lost-items-filters.component.html',
    styleUrls: ['./lost-items-filters.component.scss'],
    imports: [FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatCheckboxModule, MatRadioModule, TranslateModule]
})
export class LostItemsFiltersComponent implements OnInit {

  @Input() filters: lostItemsReportFilter;
  location: any;
  category: any;

  constructor(private memberService: MemberService) { }

  ngOnInit(): void {
    this.callLookups();
  }

  callLookups() {
    return forkJoin({
      location: this.getLookups('LocationsInsideGym'),
      category: this.getLookups('LostCategory'),
    })
      .subscribe((res: any) => {
        this.location = res.location;
        this.category = res.category;
      });
  }

  getLookups(lookupName: string): any {
    switch (lookupName) {
      case 'LocationsInsideGym':
        return this.memberService.getLookup(LookupType.LocationsInsideGym);
      case 'LostCategory':
        return this.memberService.getLookup(LookupType.LostCategory);

    }
  }

  changeIsDeliverd() {
    if (this.filters.isDeliverd == false)
      this.filters.isDeliverd = null;
  }

  changeIsFinder() {
    if (this.filters.isFinderMember == true) {
      this.filters.isFinderEmplyee = null;
    }
    else {
      this.filters.isFinderMember = null;
      this.filters.isFinderEmplyee = true;
    }
  }

  changeIsRecipient() {
    if (this.filters.isRecipientMember == true) {
      this.filters.isRecipientEmployee = null;
    } else {
      this.filters.isRecipientMember = null;
      this.filters.isRecipientEmployee = true;

    }
  }
}

