import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CallMember } from 'src/app/models/member.model';
import { MemberService } from 'src/app/services/member.service';
import { CallReminderComponent } from 'src/app/shared/call-reminder/call-reminder.component';
import moment from 'moment';
import { Subject, takeUntil, timer } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { IAuthorizedUser } from 'src/app/models/user.model';
import { IUserNotification, IUserReminder, UserNotificationFilters, UserRemindersFilters } from 'src/app/models/common.model';
import { SignalRService } from 'src/app/services/signal-r.service';
import { UserReminderComponent } from 'src/app/shared/user-reminder/user-reminder.component';
import { SalesScheduleService } from 'src/app/services/sales-schedule.service';
import { NotificationTypePipe } from '../../pipes/notification-type.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterModule } from '@angular/router';
import { NOTIFICATION_TYPE_ID, NotificationRedirectionService } from 'src/app/services/notification-redirection.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotificationBatchDataListComponent } from './notification-batch-data-list/notification-batch-data-list.component';

@Component({
    selector: 'app-user-notifications',
    templateUrl: './user-notifications.component.html',
    styleUrls: ['./user-notifications.component.scss'],
    imports: [MatButtonModule, MatMenuModule, MatBadgeModule, MatIconModule, MatProgressSpinnerModule, DatePipe, TranslateModule, NotificationTypePipe, MatTooltipModule, RouterModule],
    providers: [NotificationRedirectionService]
})
export class UserNotificationsComponent implements OnInit {
  private destroyUserReminder$ = new Subject();
  user: IAuthorizedUser = JSON.parse(localStorage.getItem('mosUser') || '');
  notifications: IUserNotification[] = [];
  totalElements: number;
  page: number = 0;
  perPage: number = 10;
  unseenNotifications: number;
  unseenUserReminders: IUserReminder[] = [];
  loading: boolean;
  userReminders: IUserReminder[] = [];
  private memberService = inject(MemberService);
  public dialog = inject(MatDialog);
  public common = inject(CommonService);
  private signalR = inject(SignalRService);
  private salesScheduleService = inject(SalesScheduleService);
  private notificationRedirect = inject(NotificationRedirectionService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private audio: HTMLAudioElement;

  ngOnInit(): void {
    this.loadAudio();
    this.getUnseenNotificationsCount();
    this.getUserReminders();
    this.signalR.getNotificationsCount.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((userId) => {
      if (userId) {
        this.playSound();
        this.getUnseenNotificationsCount();
      }
    });
    this.signalR.getUserReminders.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((userId) => {
      if (userId) {
        this.playSound();
        this.getUserReminders();
      }
    });

  }

  loadAudio(){
    this.audio = new Audio();
    this.audio.src = 'assets/notification.mp3';
    this.audio.load();
  }

  playSound(): void {
    this.audio.currentTime = 0;
    this.audio.play().catch(error => console.error('Error playing sound:', error));
  }

  showCallReminder(Reminder: CallMember) {
    let dialogRef = this.dialog.open(CallReminderComponent, {
      maxHeight: '80vh',
      width: '600px',
      data: { reminder: Reminder },
      disableClose: true,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'dismissed') {
        this.dismissReminder(result.data.id);
      } else if (result.status === 'snoozed') {
        this.snoozeReminder(result.data.id, result.data.snoozeMinutes);
      }
    });

  }

  dismissReminder(callId: number) {
    this.memberService.dismissCallReminder(callId).subscribe({
      next: () => {
        // this.getUserReminders();
      }
    });
  }

  snoozeReminder(callId: number, minutesCount: number) {
    this.memberService.snoozeCallReminder(callId, minutesCount).subscribe({
      next: () => {
        // this.getUserReminders();
      }
    });
  }


  getNotifications(markAsSeen: boolean = false) {
    this.loading = true;
    let params: UserNotificationFilters = {
      userId: this.user.id,
      isSeen: null,
      isVisited: null,
      skipCount: this.page * this.perPage,
      takeCount: this.perPage
    }
    this.memberService.getUserNotifications(params).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.notifications = [...this.notifications, ...res.data];
        this.totalElements = res.totalCount;
        this.loading = false;
        if (markAsSeen) {
          this.markAsSeen();
        }
      }
    })
  }

  getUnseenNotificationsCount() {
    this.memberService.getUnseenNotifications(this.user.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.unseenNotifications = res.data;
      }
    });
  }

  loadMore() {
    this.page = this.page + 1;
    this.getNotifications(true);
  }

  onOpenMenu() {
    this.notifications = [];
    this.page = 0;
    this.getNotifications(true);
  }

  markAsSeen() {
    this.memberService.markNotificationSeen(this.user.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.unseenNotifications = 0;
      }
    });
  }

  getUserReminders() {
    // const startOfMonth = moment().clone().startOf('month').format('YYYY-MM-DD hh:mm');
    // const monthLater = new Date(startOfMonth);
    // monthLater.setDate(monthLater.getDate() + 30);

    let filters = new UserRemindersFilters();
    filters.reminderDateFrom = moment().startOf('day') as any;
    filters.reminderDateTo = moment().add(3, 'hour') as any;
    filters.createdTo = this.user.id;
    this.salesScheduleService.getUserReminders(filters).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.userReminders = this.sortByDate(res.data);
        this.unseenUserReminders = this.sortByDate(res.data).filter((r: IUserReminder) => !r.isDismissed);
        this.destroyUserReminder$.next(null);
        this.destroyUserReminder$.complete();
        this.setUserRemindersTimer();
      }
    })
  }

  setUserRemindersTimer() {
    if (this.unseenUserReminders.length > 0) {
      const [r] = this.unseenUserReminders.slice(-1);
      timer(new Date(r.reminderDate)).pipe(takeUntil(this.destroyUserReminder$)).subscribe(() => {
        this.openUserReminder(this.unseenUserReminders)
      })
    }
  }

  sortByDate(array: IUserReminder[]) {
    const arr = array.sort((a, b) => {
      const dateA = new Date(a.reminderDate);
      const dateB = new Date(b.reminderDate);
      return dateB.getTime() - dateA.getTime();
    });
    return arr;
  }

  openUserReminder(reminders: IUserReminder[]) {
    let dialogRef = this.dialog.open(UserReminderComponent, {
      maxHeight: '80vh',
      width: '600px',
      data: { reminders: reminders },
      disableClose: false,
      autoFocus: false
    });
    // dialogRef.afterClosed().subscribe(result => {
    //   if (result.status === 'dismissed') {
    //     this.getUserReminders();
    //   } else if (result.status === 'snoozed') {
    //     this.getUserReminders();
    //   }
    // });
  }

  onClickNotification(notification: IUserNotification) {

    if (!notification.batchId) {

      const _memberRedirection = [NOTIFICATION_TYPE_ID.MEMBER, NOTIFICATION_TYPE_ID.POTENTIAL_MEMBER, NOTIFICATION_TYPE_ID.MEMBER_TASKS];

      if (_memberRedirection.includes(notification.typeId)) {
        this.router.navigate([this.notificationRedirect.getRedirectionUrl(notification.typeId, notification.contextId).url, notification.contextId], {
          queryParams: {
            tab: this.notificationRedirect.getRedirectionUrl(notification.typeId, notification.contextId).extra
          }
        })
      } else {
        this.router.navigate([this.notificationRedirect.getRedirectionUrl(notification.typeId, notification.contextId).url], {
          queryParams: {
            contextId: notification.contextId,
            tab: this.notificationRedirect.getRedirectionUrl(notification.typeId, notification.contextId).extra
          }
        })
      }
    } else {
      this.showBatchIdDialog(notification.batchId);
    }

  }

  showBatchIdDialog(batchId: number) {
    this.dialog.open(NotificationBatchDataListComponent, {
      data: batchId,
      maxHeight:'85vh'
    })
  }


}
