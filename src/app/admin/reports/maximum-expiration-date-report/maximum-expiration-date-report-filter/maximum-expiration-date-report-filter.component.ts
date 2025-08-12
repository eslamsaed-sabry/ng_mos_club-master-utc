import { Component, Input, OnInit } from '@angular/core';
import { IPackage } from 'src/app/models/member.model';
import { MaximumExpirationDateReportFilter } from 'src/app/models/reports.model';
import { MemberService } from 'src/app/services/member.service';
import { TranslateModule } from '@ngx-translate/core';

import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-maximum-expiration-date-report-filter',
    templateUrl: './maximum-expiration-date-report-filter.component.html',
    styleUrl: './maximum-expiration-date-report-filter.component.scss',
    imports: [FormsModule, MatFormFieldModule, MatSelectModule, MatOptionModule, TranslateModule]
})
export class MaximumExpirationDateReportFilterComponent implements OnInit {

  @Input() filters: MaximumExpirationDateReportFilter;
  packages: IPackage[] = [];

  constructor(private memberService: MemberService) { }

  ngOnInit(): void {
    this.getPackages();
  }

  getPackages() {
    this.memberService.getPackages(this.filters.packageCategory).subscribe({
      next: (res) => {
        this.packages = res.data;
      }
    })
  }
}
