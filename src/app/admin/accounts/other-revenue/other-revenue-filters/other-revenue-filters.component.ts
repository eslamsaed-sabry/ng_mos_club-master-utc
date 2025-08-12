import { BidiModule } from '@angular/cdk/bidi';

import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { OtherRevenueFilters } from 'src/app/models/accounts.model';

@Component({
    selector: 'app-other-revenue-filters',
    templateUrl: './other-revenue-filters.component.html',
    styleUrl: './other-revenue-filters.component.scss',
    imports: [FormsModule, BidiModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule,
    MatDatepickerModule, MatIconModule, MatButtonModule, TranslateModule]
})

export class OtherRevenueFiltersComponent {
  @Input() filters: OtherRevenueFilters;
  @Output() onFilterChange: EventEmitter<any> = new EventEmitter();
  currentLang: string;
  private translate = inject(TranslateService);

  ngOnInit(): void {
    this.currentLang = this.translate.getDefaultLang();

  }
}
