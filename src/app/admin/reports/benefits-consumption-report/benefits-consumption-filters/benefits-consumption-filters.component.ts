import { Component, Input, OnInit } from '@angular/core';
import { BenefitsConsumptionReportFilter } from 'src/app/models/reports.model';
import { TranslateModule } from '@ngx-translate/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-benefits-consumption-filters',
    templateUrl: './benefits-consumption-filters.component.html',
    styleUrls: ['./benefits-consumption-filters.component.scss'],
    imports: [FormsModule, MatFormFieldModule, MatInputModule, TranslateModule]
})
export class BenefitsConsumptionFiltersComponent implements OnInit {

  @Input() filters: BenefitsConsumptionReportFilter;
  constructor() { }

  ngOnInit(): void {
  }



}
