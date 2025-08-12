import { Component, Inject, OnInit } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { SingleMemberNotification } from 'src/app/models/reports.model';
import { CommonService } from 'src/app/services/common.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'app-member-notification-form',
    templateUrl: './member-notification-form.component.html',
    styleUrls: ['./member-notification-form.component.scss'],
    imports: [MatDialogTitle, FormsModule, MatDialogContent, MatFormFieldModule, MatInputModule, MatCheckboxModule, MatDialogActions, MatButtonModule, MatIconModule, TranslateModule]
})
export class MemberNotificationFormComponent implements OnInit {
  memberNotification: SingleMemberNotification = new SingleMemberNotification();
  constructor(private common: CommonService, private toastr: ToastrService, public dialogRef: MatDialogRef<MemberNotificationFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }


  ngOnInit(): void {
    this.memberNotification.memberId = this.data.memberId;
  }

  dismiss(status: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: status, data: data });
  }

  submit(form: NgForm) {
    if (!this.memberNotification.isSMS && !this.memberNotification.isMobileApp && !this.memberNotification.isWhatsApp) {
      this.toastr.error('You should choose a notification type.');
      return
    }

    if (form.form.status === 'VALID') {
      this.common.addSingleMemberNotification(this.memberNotification).subscribe({
        next: (res) => {
          this.dismiss('success')
        }
      })
    }
  }

}
