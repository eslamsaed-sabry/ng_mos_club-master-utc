
import { Component, inject, input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IMemberReferral } from 'src/app/models/reports.model';
import { ITableColumn, MAT_TABLE_COL_TYPE, MaterialTableComponent } from 'src/app/shared/material-table/material-table.component';

@Component({
    selector: 'app-member-referral',
    imports: [MaterialTableComponent],
    templateUrl: './member-referral.component.html',
    styleUrl: './member-referral.component.scss'
})
export class MemberReferralComponent {
  private translate = inject(TranslateService);
  referrals = input.required<IMemberReferral[]>();

  displayedCols: ITableColumn[] = [
    { label: this.translate.instant('members.creationDate'), key: 'creationDate', colType: MAT_TABLE_COL_TYPE.DATE },
    { label: this.translate.instant('members.contractNo'), key: 'applicationNo' },
    { label: this.translate.instant('reports.table.name'), key: 'nameEng' },
    { label: this.translate.instant('members.phone'), key: 'phoneNo' },
    { label: this.translate.instant('members.salesPerson'), key: 'salesName' },
  ];

}
