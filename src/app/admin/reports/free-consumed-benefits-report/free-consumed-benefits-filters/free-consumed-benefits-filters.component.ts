import { Component, Input, OnInit } from '@angular/core';
import { FreeConsumedBenefitsReportFilter } from 'src/app/models/reports.model';
import { TranslateModule } from '@ngx-translate/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-free-consumed-benefits-filters',
    templateUrl: './free-consumed-benefits-filters.component.html',
    styleUrls: ['./free-consumed-benefits-filters.component.scss'],
    imports: [FormsModule, MatFormFieldModule, MatInputModule, TranslateModule]
})
export class FreeConsumedBenefitsFiltersComponent implements OnInit {

  @Input() filters: FreeConsumedBenefitsReportFilter;
  constructor() { }

  ngOnInit(): void {
  }
}

