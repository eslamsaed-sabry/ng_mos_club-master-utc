import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ClassAttendanceStatus } from 'src/app/models/enums';
import { dialogBookingClassData, dialogScheduleClassData, IClassBookingList } from 'src/app/models/schedule.model';
import { ScheduleService } from 'src/app/services/schedule.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { ClassScheduleFormComponent } from '../../class-schedule-form/class-schedule-form.component';
import { ClassMemberFormComponent } from '../class-member-form/class-member-form.component';
import { MemberClassNotificationFormComponent } from '../member-class-notification-form/member-class-notification-form.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { NgStyle, DatePipe } from '@angular/common';

@Component({
    selector: 'app-class-booking-list-item',
    templateUrl: './class-booking-list-item.component.html',
    styleUrls: ['./class-booking-list-item.component.scss'],
    imports: [NgStyle, MatButtonModule, MatTooltipModule, MatIconModule, MatMenuModule, DatePipe, TranslateModule]
})
export class ClassBookingListItemComponent implements OnInit {
  @Input() classSchedule: IClassBookingList;
  @Output() onAction: EventEmitter<any> = new EventEmitter();
  memberStatus = ClassAttendanceStatus;

  constructor(public dialog: MatDialog, private scheduleService: ScheduleService, private translate: TranslateService) { }

  ngOnInit(): void {

  }

  addMember() {
    let data = {} as dialogBookingClassData;
    data.type = 'addNote';
    data.class = this.classSchedule;
    let dialogRef = this.dialog.open(ClassMemberFormComponent, {
      maxHeight: '80vh',
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.onAction.emit();
      }
    });
  }

  editClass() {
    let data = {} as dialogScheduleClassData;
    data.type = 'Save';
    data.scheduledClass = this.classSchedule;

    let dialogRef = this.dialog.open(ClassScheduleFormComponent, {
      maxHeight: '80vh',
      width: '500px',
      data: data,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.onAction.emit();
      }
    });
  }

  deleteClass() {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxHeight: '80vh',
      data: { mainTitle: this.translate.instant('classSchedule.msgToDeletedClass') },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'yes') {
        this.scheduleService.deleteScheduleClass(this.classSchedule.id).subscribe({
          next: (res) => {
            this.onAction.emit();
          }
        })
      }
    });
  }

  removeMemberFromClass(memberId: number) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxHeight: '80vh',
      data: { mainTitle: this.translate.instant('members.msgToRemoveMemberFromClass') },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'yes') {
        this.scheduleService.removeClassBooking(memberId, this.classSchedule.id).subscribe({
          next: (res) => {
            this.onAction.emit();
          }
        })
      }
    });
  }

  attendMe(memberId: number) {
    this.scheduleService.attendMemberClass(memberId, this.classSchedule.id).subscribe();
  }
  unAttendMe(memberId: number) {
    this.scheduleService.unAttendMemberClass(memberId, this.classSchedule.id).subscribe();
  }

  sendNotification() {
    let data = {} as dialogBookingClassData;
    data.class = this.classSchedule;

    let dialogRef = this.dialog.open(MemberClassNotificationFormComponent, {
      maxHeight: '80vh',
      width: '500px',
      data: data,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {

      }
    });
  }

  publishClass() {
    this.scheduleService.publishClass(this.classSchedule.id).subscribe({
      next: (res) => {
        this.onAction.emit();
      }
    });
  }

}
