import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { IUserReminder } from 'src/app/models/common.model';
import { SalesScheduleService } from 'src/app/services/sales-schedule.service';
import { TranslateModule } from '@ngx-translate/core';
import { DatePipe, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CallRingingAnimationComponent } from '../call-ringing-animation/call-ringing-animation.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';

@Component({
    selector: 'app-user-reminder',
    templateUrl: './user-reminder.component.html',
    styleUrls: ['./user-reminder.component.scss'],
    imports: [CommonModule, MatTooltipModule,
        MatButtonModule, MatIconModule, MatDialogContent, CallRingingAnimationComponent,
        RouterLink, MatDialogActions, DatePipe, TranslateModule,
        MatMenuModule]
})
export class UserReminderComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<UserReminderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { reminders: IUserReminder[] }, private salesScheduleService: SalesScheduleService) { }

  ngOnInit(): void {
    let audio: HTMLAudioElement = new Audio('../../../assets/reminder-notification.wav');
    audio.play();
  }

  dismiss(status: string = 'cancelled', data?: IUserReminder): void {
    this.dialogRef.close({ status: status, data: data });
  }

  canBeSnoozed(date: string): boolean {
    const quarter = 900000;
    const justNow = new Date().getTime();
    const reminderDate = new Date(date).getTime();
    return (reminderDate + quarter) > justNow;
  }

  dismissUserReminder(reminder: IUserReminder, close = true) {
    this.salesScheduleService.dismissUserReminder(reminder.id).subscribe({
      next: (res) => {
        this.dismiss();
        // if (close)
        //   this.dismiss('dismissed');
        // else {
        //   reminder.isDismissed = true;
        //   this.data.reminders = this.data.reminders.filter(r => r.id != reminder.id);
        // }
      }
    });
  }

  snoozeUserReminder(minutesCount: number, reminder: IUserReminder, close = true) {
    this.salesScheduleService.snoozeUserReminder(reminder.id, minutesCount).subscribe({
      next: (res) => {
        this.dismiss('snoozed');
        // if (close)
        //   this.dismiss('snoozed');
        // else {
        //   this.data.reminders = this.data.reminders.filter(r => r.id != reminder.id);
        // }
      }
    })
  }

}
