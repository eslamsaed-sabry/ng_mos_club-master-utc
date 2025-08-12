import { Component, OnInit, Input, inject, DestroyRef } from '@angular/core';
import { LookupType } from 'src/app/models/enums';
import { NotActiveMembersReport } from 'src/app/models/reports.model';
import { CommonService } from 'src/app/services/common.service';
import { TranslateModule } from '@ngx-translate/core';

import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-not-active-members-report-filters',
    templateUrl: './not-active-members-report-filters.component.html',
    styleUrls: ['./not-active-members-report-filters.component.scss'],
    imports: [MatCheckboxModule, FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, TranslateModule]
})
export class NotActiveMembersReportFiltersComponent implements OnInit {
  @Input() filters: NotActiveMembersReport;
  destroyRef = inject(DestroyRef);
  sales: any[] = [];
  isActive: boolean = true;

  public commonService = inject(CommonService);


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
