import { BidiModule } from '@angular/cdk/bidi';

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LookupType } from 'src/app/models/enums';
import { FeedbacksFilters } from 'src/app/models/extra.model';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-feedbacks-filters',
  templateUrl: './feedbacks-filters.component.html',
  styleUrl: './feedbacks-filters.component.scss',
  imports: [FormsModule, BidiModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule,
    MatButtonModule, TranslateModule]
})
export class FeedbacksFiltersComponent implements OnInit {
  @Output() onFilter: EventEmitter<any> = new EventEmitter();
  @Input() filters: FeedbacksFilters;
  currentLang: string;

  constructor(private translate: TranslateService) { }

  ngOnInit(): void {
    this.currentLang = this.translate.getDefaultLang();
  }
}