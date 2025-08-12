import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent } from '@angular/material/dialog';
import { dialogMembershipData } from 'src/app/models/member.model';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';


@Component({
    selector: 'app-show-history-modal',
    templateUrl: './show-history-modal.component.html',
    styleUrls: ['./show-history-modal.component.scss'],
    imports: [MatDialogTitle, MatDialogContent, MatIconModule, TranslateModule]
})
export class ShowHistoryModalComponent implements OnInit {
  membershipHistory: string[];

  constructor(public dialogRef: MatDialogRef<ShowHistoryModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: dialogMembershipData) { }

  ngOnInit(): void {
    if (this.data.membership.history)
      this.membershipHistory = this.data.membership.history
        .split('\r\n')
        .filter((el: any) => el.trim().length !== 0);
    else this.membershipHistory = [];
  }
}
