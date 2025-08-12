import { Component, Input, OnInit } from '@angular/core';
import { MembershipsDiscountReportFilter } from 'src/app/models/reports.model';
import { TranslateModule } from '@ngx-translate/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-memberships-discount-report-filters',
    templateUrl: './memberships-discount-report-filters.component.html',
    styleUrls: ['./memberships-discount-report-filters.component.scss'],
    imports: [FormsModule, MatFormFieldModule, MatInputModule, TranslateModule]
})
export class MembershipsDiscountReportFiltersComponent implements OnInit {

  @Input() filters: MembershipsDiscountReportFilter;
  constructor() { }

  ngOnInit(): void {
  }
}
