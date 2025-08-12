import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { CallMember } from 'src/app/models/member.model';
import { TranslateModule } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { CallRingingAnimationComponent } from '../call-ringing-animation/call-ringing-animation.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-call-reminder',
    templateUrl: './call-reminder.component.html',
    styleUrls: ['./call-reminder.component.scss'],
    imports: [MatButtonModule, MatIconModule, MatDialogContent, CallRingingAnimationComponent, MatDialogActions, DatePipe, TranslateModule]
})
export class CallReminderComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<CallReminderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { reminder: CallMember }) { }

  ngOnInit(): void {
    let audio: HTMLAudioElement = new Audio('../../../assets/reminder-notification.wav');
    audio.play();
  }

  dismiss(status: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: status, data: this.data.reminder });
  }

  onSnooze(minutes: number) {
    this.data.reminder.snoozeMinutes = minutes;
    this.dismiss('snoozed');
  }

}
