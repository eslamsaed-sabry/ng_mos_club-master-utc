import { Component, Input, OnInit } from '@angular/core';
import { MembershipTransferReportFilter } from 'src/app/models/reports.model';
import { TranslateModule } from '@ngx-translate/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-membership-transfer-filters',
    templateUrl: './membership-transfer-filters.component.html',
    styleUrls: ['./membership-transfer-filters.component.scss'],
    imports: [FormsModule, MatFormFieldModule, MatInputModule, TranslateModule]
})
export class MembershipTransferFiltersComponent implements OnInit {

  @Input() filters: MembershipTransferReportFilter;
  constructor() { }

  ngOnInit(): void {
  }
}
