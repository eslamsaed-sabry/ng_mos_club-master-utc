import { Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { Gender, LookupType } from 'src/app/models/enums';
import { MemberAttendanceFilters } from 'src/app/models/reports.model';
import { CommonService } from 'src/app/services/common.service';
import { ReportsService } from 'src/app/services/reports.service';
import { TranslateModule } from '@ngx-translate/core';

import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-member-attendance-filters',
    templateUrl: './member-attendance-filters.component.html',
    styleUrls: ['./member-attendance-filters.component.scss'],
    imports: [FormsModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, TranslateModule]
})
export class MemberAttendanceFiltersComponent implements OnInit {
  @Input() filters: MemberAttendanceFilters;
  @Input() dataType: string;

  sales: any[] = [];
  gender = Gender;
  destroyRef = inject(DestroyRef);
  isActive: boolean = true;

  public commonService = inject(CommonService);
  public reportService = inject(ReportsService);


  ngOnInit(): void {
    this.getSales();
  }

  getSales() {
    this.commonService.getLookup(LookupType.Sales, this.isActive).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res: any) => {
        this.sales = res;
      }
    })
  }

}
