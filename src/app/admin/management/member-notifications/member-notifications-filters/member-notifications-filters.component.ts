import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { MemberNotificationFilters } from 'src/app/models/reports.model';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { BidiModule } from '@angular/cdk/bidi';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-member-notifications-filters',
    templateUrl: './member-notifications-filters.component.html',
    styleUrls: ['./member-notifications-filters.component.scss'],
    imports: [FormsModule, BidiModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatCheckboxModule, MatButtonModule, TranslateModule]
})
export class MemberNotificationsFiltersComponent implements OnInit {
  @Input() filters: MemberNotificationFilters;
  @Output() onFilterChange: EventEmitter<any> = new EventEmitter();
  @Input() pageID: 'ALL' | 'NOTIFICATION' | 'MEMBER' = 'ALL';
  currentLang: string;

  constructor(private translate: TranslateService) { }

  ngOnInit(): void {
    this.currentLang = this.translate.getDefaultLang();

  }
}
