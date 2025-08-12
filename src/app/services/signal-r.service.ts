import { Injectable, signal } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { APIService } from './api.service';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { IAuthorizedUser, IBookingListSignal } from '../models/user.model';
import { BrandService } from 'src/app/services/brand.service';

@Injectable()
export class SignalRService extends APIService {
  pinned = false;
  connection: signalR.HubConnection;
  private notificationsObserver = new Subject<number>();
  getNotificationsCount = this.notificationsObserver.asObservable();
  updateNotificationsCount(userId: number) {
    this.notificationsObserver.next(userId);
  }

  private memberAttendanceObserver = new Subject<{memberId: number, branchId: number}>();
  getMemberAtt = this.memberAttendanceObserver.asObservable();
  updateMemberAtt(data: {memberId: number, branchId: number}) {
    this.memberAttendanceObserver.next(data);
  }

  private userReminderObserver = new Subject<number>();
  getUserReminders = this.userReminderObserver.asObservable();
  updateUserReminders(memberId: number) {
    this.userReminderObserver.next(memberId);
  }


  private bookingListObserver = new Subject<IBookingListSignal>();
  getBookingList = this.bookingListObserver.asObservable();
  updateBookingList(data: IBookingListSignal) {
    this.bookingListObserver.next(data);
  }

  whatsappQRSignal = signal<string | null>(null);

  playNotification(valid: boolean) {
    let audio: HTMLAudioElement = valid ? new Audio('../../assets/welcome.mp3') : new Audio('../../assets/not-active.mp3');
    audio.play();
  }

  constructor(private router: Router, translate: TranslateService) {
    super(translate);
  }

  startConnection(brandService : BrandService) {
    const _USER: IAuthorizedUser = JSON.parse(localStorage.getItem('mosUser') || '');
    const _loginToken = localStorage.getItem('mosToken') || '';

    this.connection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Information)
      .withUrl(this.api() + `api/notify`, { accessTokenFactory: () => _loginToken })
      .build();

    this.connection
      .start()
      .then((res) => { 
        // setInterval(()=>{
        //   console.log('connection on');
        // },5000)
      })
      .catch(err => console.log('Error while starting connection'));

    this.connection.on('MemberAttendance', (data) => {
      if (location.pathname !== '/admin/attendance-monitoring') {
        this.updateMemberAtt(data)
      } else if (location.pathname === '/admin/attendance-monitoring' && this.pinned) {
        this.updateMemberAtt(data)
      } else {
        if (data.branchId === brandService.currentBranch.id){
          this.router.navigate(['/admin/attendance-monitoring'], {
            queryParams: {
              id: data.memberId
            }
          })
        }
      }
    });

    this.connection.on('UserNotification', (data) => {
      if (data === _USER.id) {
        this.updateNotificationsCount(data);
      }
    });

    this.connection.on('ReminderChange', (data) => {
      if (data) {
        this.updateUserReminders(data);
      }
    });

    // setInterval(() => {
    //     this.updateMemberAtt({memberId: 40686, branchId: 1})
    // }, 10000)
    // setTimeout(() => {
    //   if (location.pathname !== '/admin/attendance-monitoring') {
    //     this.updateMemberAtt(6326)
    //   }
    // }, 4000)
    // setTimeout(() => {
    //   if (location.pathname !== '/admin/attendance-monitoring') {
    //     this.updateMemberAtt(6329)
    //   }
    // }, 6000)

    // setInterval(() => {
    //   this.updateMemberAtt(640)
    // }, 2000)
  }

  startBookingListSignal() {
    this.connection.on('BookingListChange', (data: IBookingListSignal) => {
      if (data) {
        this.updateBookingList(data);
      }
    });
  }

  whatsappSignal(actionType: 'START' | 'STOP') {
    if (actionType === 'START') {
      this.connection.on('WhatsAppQRCode', (data: string) => {
        if (data) {
          this.whatsappQRSignal.set(data)
        }
      });
    } else {
      this.connection.off('WhatsAppQRCode');
    }
  }

  closeConnection() {
    this.connection.off('MemberAttendance');
    this.connection.off('UserNotification');
    this.connection.off('ReminderChange');
    this.connection.off('BookingListChange');
    this.connection.off('WhatsAppQRCode');
    this.connection.stop();
  }


}
