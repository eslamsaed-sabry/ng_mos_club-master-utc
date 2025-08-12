import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDropListGroup, CdkDropList, CdkDrag } from '@angular/cdk/drag-drop';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { IBookingListMember, IClassBookingList, ISchedule, ScheduleFilters, dialogBookingClassData, dialogScheduleClassData } from 'src/app/models/schedule.model';
import { IBookingListSignal } from 'src/app/models/user.model';
import { ScheduleService } from 'src/app/services/schedule.service';
import { SignalRService } from 'src/app/services/signal-r.service';
import { ClassMemberFormComponent } from '../class-member-form/class-member-form.component';
import { MatDialog } from '@angular/material/dialog';
import { SingleBookingListItemComponent } from './single-booking-list-item/single-booking-list-item.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { ClassScheduleFormComponent } from '../../class-schedule-form/class-schedule-form.component';

@Component({
  selector: 'app-single-booking-list',
  templateUrl: './single-booking-list.component.html',
  styleUrls: ['./single-booking-list.component.scss'],
  imports: [MatIconModule, MatButtonModule, RouterLink, MatFormFieldModule, MatInputModule, CdkDropListGroup, CdkDropList, CdkDrag, SingleBookingListItemComponent, DatePipe, TranslateModule]
})
export class SingleBookingListComponent implements OnInit, OnDestroy {

  classId: number;
  attended: IBookingListMember[] = [];
  booked: IBookingListMember[] = [];
  waitingList: IBookingListMember[] = [];
  wholeList: IBookingListMember[] = [];
  classDetails: ISchedule;
  private apiService = inject(ScheduleService);
  private route = inject(ActivatedRoute);
  private signalR = inject(SignalRService);
  private toastr = inject(ToastrService);
  private translate = inject(TranslateService);
  public dialog = inject(MatDialog);

  drop(event: CdkDragDrop<IBookingListMember[]>) {
    if (event.previousContainer === event.container) {
      //rearrange
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // move to another column
      let obj = {
        from: event.previousContainer.id,
        to: event.container.id,
        memberId: +event.item.element.nativeElement.id
      }
      if (obj.from === 'attended' && obj.to === 'waitingList') {
        this.unAttendMe(obj.memberId);
      } else if (obj.from === 'attended' && obj.to === 'booked') {
        this.unAttendMe(obj.memberId);
      } else if (obj.from === 'waitingList' && obj.to === 'attended') {
        this.attendMe(obj.memberId);
      } else if (obj.from === 'booked' && obj.to === 'attended') {
        this.attendMe(obj.memberId);
      }

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }




  ngOnInit(): void {
    this.signalR.startBookingListSignal();
    this.route.params.subscribe((params) => {
      this.classId = +params['classId'];
    });
    this.getListDetails();
    this.getClassDetails();
    this.signalR.getBookingList.subscribe((data: IBookingListSignal) => {
      if (data.classId && data.classId === this.classId) {
        let member = this.wholeList.find(m => m.memberId === data.memberId);
        this.toastr.info(this.translate.instant('classSchedule.bookingListMemberUpdated', { memberName: member?.memberName }))
        this.getListDetails();
      }
    });
  }

  getClassDetails() {
    let filters: ScheduleFilters = new ScheduleFilters();
    filters.id = this.classId;
    this.apiService.getClassesSchedule(filters).subscribe({
      next: (res) => {
        this.classDetails = res.data[0];
      }
    })
  }

  getListDetails() {
    this.apiService.getBookingFullDetails(this.classId).subscribe({
      next: (res) => {
        this.wholeList = res.data;
        this.mapMembers(res.data);
      }
    })
  }

  mapMembers(data: IBookingListMember[]) {
    this.attended = data.filter(el => el.isAttended);
    this.waitingList = data.filter(el => el.isWaitingList);
    this.booked = data.filter(el => !el.isWaitingList && !el.isAttended);
  }


  attendMe(memberId: number) {
    this.apiService.attendMemberClass(memberId, this.classId).subscribe();
  }
  unAttendMe(memberId: number) {
    this.apiService.unAttendMemberClass(memberId, this.classId).subscribe();
  }

  searchMembers(e: Event) {
    let keyword = (<HTMLInputElement>e.target).value;

    const filtered = this.wholeList.filter(obj => {
      const values = Object.values(obj).map(value =>
        typeof value === 'string' ? value.toLowerCase() : value
      );

      return values.some(value =>
        typeof value === 'string' && value.includes(keyword.toLowerCase())
      );
    });


    this.mapMembers(filtered);
  }

  addMember() {
    let data = {} as dialogBookingClassData;
    data.type = 'addNote';
    data.class = this.classDetails as IClassBookingList;
    let dialogRef = this.dialog.open(ClassMemberFormComponent, {
      maxHeight: '80vh',
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getListDetails();
      }
    });
  }

  publishClass() {
    this.apiService.publishClass(this.classId).subscribe();
  }

  editClass() {
    const _data: dialogScheduleClassData = {
      scheduledClass: this.classDetails,
      startTime: new Date(),
      type: 'Save',
      hideBookingListLink: true
    }
    const dialogRef = this.dialog.open(ClassScheduleFormComponent, {
      maxHeight: '85vh',
      width: '500px',
      data: _data,
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getClassDetails();
      }
    });
  }


  ngOnDestroy(): void {
    this.signalR.connection.off('BookingListChange');
  }
}
