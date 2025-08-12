import { Component, Input, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { MembershipsIncomePerPackageTypeReportFilters } from 'src/app/models/reports.model';
import { ReportsService } from 'src/app/services/reports.service';

@Component({
    selector: 'app-memberships-income-per-package-type-report-filters',
    templateUrl: './memberships-income-per-package-type-report-filters.component.html',
    styleUrl: './memberships-income-per-package-type-report-filters.component.scss',
    imports: [FormsModule, MatFormFieldModule, MatCheckboxModule, TranslateModule, MatInputModule]
})
export class MembershipsIncomePerPackageTypeReportFiltersComponent implements OnInit {

  @Input() filters: MembershipsIncomePerPackageTypeReportFilters;
  ngOnInit(): void {
  }
}
