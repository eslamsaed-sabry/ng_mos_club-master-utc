import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatDialogTitle, MatDialogContent } from '@angular/material/dialog';
import { Attendance, dialogTrainerSlotMember } from 'src/app/models/member.model';
import { AddSlotMemberComponent } from './add-slot-member/add-slot-member.component';
import { SalesScheduleService } from 'src/app/services/sales-schedule.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-slot-members-list',
    templateUrl: './slot-members-list.component.html',
    styleUrls: ['./slot-members-list.component.scss'],
    imports: [MatDialogTitle, MatDialogContent, MatButtonModule, RouterLink, MatIconModule, TranslateModule]
})
export class SlotMembersListComponent implements OnInit {
  members: Attendance[];
  constructor(public dialogRef: MatDialogRef<SlotMembersListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: dialogTrainerSlotMember, public dialog: MatDialog,
    private apiService: SalesScheduleService, private translate: TranslateService) { }

  ngOnInit(): void {
    this.getSlotMembers();
  }

  getSlotMembers() {
    this.apiService.getSlotMembers(this.data.slotData.contextId).subscribe({
      next: (res) => {
        this.members = res.data
      }
    })
  }

  onAddMember() {
    let data: dialogTrainerSlotMember = {
      slotData: this.data.slotData,
    };
    const dialogRef = this.dialog.open(AddSlotMemberComponent, {
      maxHeight: '80vh',
      maxWidth: "500px",
      data: data,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getSlotMembers();
      }
    });
  }

  removeMember(member: Attendance) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxHeight: '80vh',
      data: { mainTitle: this.translate.instant('members.msgToDeletedMember') },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'yes') {
        this.apiService.removeSlotMember(this.data.slotData.contextId, member.memberId).subscribe({
          next: (res) => {
            this.getSlotMembers();
          }
        });
      }
    });
  }


}
