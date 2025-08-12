
import { Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { LookupType } from 'src/app/models/enums';
import { SalesPersonClosingRatioReportFilter } from 'src/app/models/reports.model';
import { CommonService } from 'src/app/services/common.service';

@Component({
    selector: 'app-sales-person-closing-ratio-report-filter',
    templateUrl: './sales-person-closing-ratio-report-filter.component.html',
    styleUrl: './sales-person-closing-ratio-report-filter.component.scss',
    imports: [FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, TranslateModule]
})

export class SalesPersonClosingRatioReportFilterComponent implements OnInit {
  @Input() filters: SalesPersonClosingRatioReportFilter;
  sales: any[] = [];
  date: Date = new Date();
  private commonService = inject(CommonService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.getSales();
  }

  getSales() {
    this.commonService.getLookup(LookupType.Sales).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res: any) => {
        this.sales = res;
      }
    })
  }

}
