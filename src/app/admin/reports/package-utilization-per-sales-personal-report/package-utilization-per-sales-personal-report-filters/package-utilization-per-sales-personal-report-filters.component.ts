import { Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatOptionModule } from '@angular/material/core';
import { LookupType } from 'src/app/models/enums';
import { PackageUtilizationPerSalesPersonalReportFilter } from 'src/app/models/reports.model';
import { CommonService } from 'src/app/services/common.service';
import { TranslateModule } from '@ngx-translate/core';

import { MatSelectModule } from '@angular/material/select';
import { RoleDirective } from '../../../../directives/role.directive';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
    selector: 'app-package-utilization-per-sales-personal-report-filters',
    templateUrl: './package-utilization-per-sales-personal-report-filters.component.html',
    styleUrl: './package-utilization-per-sales-personal-report-filters.component.scss',
    imports: [MatCheckboxModule, FormsModule, MatFormFieldModule, MatInputModule, RoleDirective, MatSelectModule, MatOptionModule, TranslateModule]
})
export class PackageUtilizationPerSalesPersonalReportFiltersComponent implements OnInit {
  @Input() filters: PackageUtilizationPerSalesPersonalReportFilter;
  sales: any[] = [];
  allIds: number[];
  selection: string = 'Select All';
  date: Date = new Date();

  destroyRef = inject(DestroyRef);
  isActive: boolean = true;

  public commonService = inject(CommonService);

  ngOnInit(): void {
    this.getSales();
  }

  getSales() {
    this.commonService.getLookup(LookupType.Sales, this.isActive).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res: any) => {
        this.sales = res;
        this.allIds = this.sales.map(el => el.id);
      }
    })
  }

  onSelect() {
    setTimeout(() => {
      if (this.filters.salesIds.includes(0)) {
        this.filters.salesIds = [0, ...this.sales.map(el => el.id)];
      } else {
        this.filters.salesIds = [];
      }
    }, 100);
  }
}
