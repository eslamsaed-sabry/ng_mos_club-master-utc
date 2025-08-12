import { Component, Inject, OnInit } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { dialogAnnouncementData, IAnnouncement } from 'src/app/models/management.model';
import { IAuthorizedUser, IUser } from 'src/app/models/user.model';
import { AdministrationService } from 'src/app/services/administration.service';
import { ManagementService } from 'src/app/services/management.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';

import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'app-announcements-form',
    templateUrl: './announcements-form.component.html',
    styleUrls: ['./announcements-form.component.scss'],
    imports: [MatDialogTitle, FormsModule, MatDialogContent, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatSelectModule, MatOptionModule, MatDialogActions, MatButtonModule, TranslateModule]
})
export class AnnouncementsFormComponent implements OnInit {
  announcement: IAnnouncement = {} as IAnnouncement;
  user: IAuthorizedUser = JSON.parse(localStorage.getItem('mosUser')!);
  users: IUser[] = [];
  userIds: number[] = [];
  constructor(public dialogRef: MatDialogRef<AnnouncementsFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: dialogAnnouncementData, private managementService: ManagementService,
    private adminService: AdministrationService) { }

  ngOnInit(): void {
    this.getUsers();
    if (this.data.type === 'edit') {
      this.announcement = this.data.announcement;
    }
    if (!this.announcement.showDate) {
      this.announcement.showDate = new Date();
    }
  }

  dismiss(status: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: status, data: data });
  }

  getUsers() {
    this.adminService.getUsers(true).subscribe({
      next: (res) => {
        this.users = res.data;
      }
    })
  }

  onSelectAll(e: any) {
    if (e.source._selected) {
      this.userIds = this.users.map(u => u.id)
    } else {
      this.userIds = [];
    }
  }

  submit(form: NgForm) {
    if (form.form.status === 'VALID') {
      this.announcement.usersIds = [...this.userIds, ...this.announcement.usersIds];
      this.announcement.usersIds = this.announcement.usersIds.filter(el => el != null);
      if (this.data.type === 'add') {
        this.managementService.addAnnouncement(this.announcement).subscribe({
          next: () => {
            this.dismiss('success');
          }
        })
      } else {
        this.managementService.editAnnouncement(this.announcement).subscribe({
          next: () => {
            this.dismiss('success');
          }
        })
      }
    }
  }

}
