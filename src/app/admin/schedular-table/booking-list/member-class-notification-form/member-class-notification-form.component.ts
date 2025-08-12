import { Component, inject } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { ClassAttendanceStatus } from 'src/app/models/enums';
import { dialogBookingClassData, MemberClassNotification } from 'src/app/models/schedule.model';
import { ScheduleService } from 'src/app/services/schedule.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Task } from 'src/app/models/common.model';
import { ToastrService } from 'ngx-toastr';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { CheckboxGroupComponent } from '../../../../shared/checkbox-group/checkbox-group.component';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-member-class-notification-form',
  templateUrl: './member-class-notification-form.component.html',
  styleUrls: ['./member-class-notification-form.component.scss'],
  imports: [
    MatDialogTitle,
    FormsModule,
    MatDialogContent,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    CheckboxGroupComponent,
    MatInputModule,
    MatDialogActions,
    MatButtonModule,
    TranslateModule,
  ],
  providers: [ScheduleService]
})
export class MemberClassNotificationFormComponent {
  notificationForm: MemberClassNotification = new MemberClassNotification();
  memberStatus = ClassAttendanceStatus;
  readonly dialogRef = inject(MatDialogRef<MemberClassNotificationFormComponent>);
  readonly data = inject<dialogBookingClassData>(MAT_DIALOG_DATA);
  private scheduleService = inject(ScheduleService);
  private translate = inject(TranslateService);
  private toastr = inject(ToastrService);

  notificationType: Task = {
    name: this.translate.instant('classSchedule.notificationType'),
    completed: true,
    color: 'primary',
    subtasks: [
      { name: this.translate.instant('classSchedule.sms'), completed: true, color: 'warn', value: 'isSMS' },
      { name: this.translate.instant('classSchedule.mobileApp'), completed: true, color: 'warn', value: 'isMobileApp' },
      { name: this.translate.instant('classSchedule.whatsapp'), completed: true, color: 'warn', value: 'isWhatsApp' },
    ]
  };

  dismiss(status: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: status, data: data });
  }

  submit(form: NgForm) {
    let notifications = this.notificationType.subtasks?.filter(n => n.completed)
    if (notifications?.length === 0) {
      this.toastr.error('Please choose at least one notification type.');
      return
    } else {
      this.notificationForm.isSMS = this.notificationType.subtasks?.find(n => n.value === 'isSMS')?.completed!
      this.notificationForm.isMobileApp = this.notificationType.subtasks?.find(n => n.value === 'isMobileApp')?.completed!
      this.notificationForm.isWhatsApp = this.notificationType.subtasks?.find(n => n.value === 'isWhatsApp')?.completed!
    }
    console.log(this.data.class)
    this.notificationForm.classId = this.data.class.id;
    if (form.form.status === 'VALID') {
      this.scheduleService.sendMemberClassNotification(this.notificationForm).subscribe({
        next: (res) => {
          this.dismiss('success');
        }
      })
    }
  }

}
