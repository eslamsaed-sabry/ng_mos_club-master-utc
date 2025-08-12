import { Component, OnInit, Input, SimpleChanges, inject, DestroyRef } from '@angular/core';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { Gender } from 'src/app/models/enums';
import { LookupType } from 'src/app/models/enums';
import { IPackage } from 'src/app/models/member.model';
import { DebtsReportFilters } from 'src/app/models/reports.model';
import { CommonService } from 'src/app/services/common.service';
import { MemberService } from 'src/app/services/member.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-debts-report-filters',
    templateUrl: './debts-report-filters.component.html',
    styleUrls: ['./debts-report-filters.component.scss'],
    imports: [FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatCheckboxModule, MatDatepickerModule, TranslateModule]
})
export class DebtsReportFiltersComponent implements OnInit {
  @Input() filters: DebtsReportFilters | any;
  destroyRef = inject(DestroyRef);
  sales: any[] = [];
  gender = Gender;
  packages: IPackage[] = [];
  packageTypes: any[] = [];
  isActive: boolean = true;

  public memberService = inject(MemberService);
  public commonService = inject(CommonService);

  ngOnInit(): void {
    this.getSales();
    this.getPackageTypes();
  }

  getSales() {
    this.commonService.getLookup(LookupType.Sales, this.isActive).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res: any) => {
        this.sales = res;
      }
    })
  }

  onChange(fieldName: string, value: MatCheckboxChange) {
    if (!value.checked) {
      this.filters[fieldName] = null;
    } else {
      this.filters[fieldName] = new Date();;
    }
  }

  getPackages() {
    this.memberService.getPackages(this.filters.packageCategory).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.packages = res.data;
      }
    })
  }

  getPackageTypes() {
    this.commonService.getLookup(LookupType.PackageType).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res: any) => {
        this.packageTypes = res;
      }
    })
  }
}
