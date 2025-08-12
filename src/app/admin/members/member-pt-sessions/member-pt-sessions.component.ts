
import { Component, inject, input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IPTSession } from 'src/app/models/member.model';
import { ITableColumn, MAT_TABLE_COL_TYPE, MaterialTableComponent } from 'src/app/shared/material-table/material-table.component';

@Component({
    selector: 'app-member-pt-sessions',
    imports: [MaterialTableComponent],
    templateUrl: './member-pt-sessions.component.html',
    styleUrl: './member-pt-sessions.component.scss'
})
export class MemberPtSessionsComponent {
  private translate = inject(TranslateService);
  sessions = input.required<IPTSession[]>();

  displayedCols: ITableColumn[] = [
    { label: this.translate.instant('reports.table.sessionDate'), key: 'sessionDate', colType: MAT_TABLE_COL_TYPE.DATE },
    { label: this.translate.instant('members.memberName'), key: 'memberName' },
    { label: this.translate.instant('members.packageName'), key: 'packageName' },
    { label: this.translate.instant('members.startDate'), key: 'startDate', colType: MAT_TABLE_COL_TYPE.DATE },
    { label: this.translate.instant('members.endDate'), key: 'expirationDate', colType: MAT_TABLE_COL_TYPE.DATE },
    { label: this.translate.instant('reports.table.type'), key: 'typeName' },
    { label: this.translate.instant('reports.table.status'), key: 'statusName' },
    { label: this.translate.instant('members.trainerName'), key: 'trainerName' },
  ];
  
}
