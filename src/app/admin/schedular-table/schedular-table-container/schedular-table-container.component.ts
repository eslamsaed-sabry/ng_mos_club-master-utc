import { Component, DestroyRef, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { loadCldr, L10n } from '@syncfusion/ej2-base';
import { EventSettingsModel, View, PopupOpenEventArgs, ScheduleComponent, EventRenderedArgs, ScheduleModule, GroupModel, ActionEventArgs, CellClickEventArgs } from '@syncfusion/ej2-angular-schedule';
import * as numberingSystems from '../numberingSystems.json';
import * as gregorian from '../ca-gregorian.json';
import * as numbers from '../numbers.json';
import * as timeZoneNames from '../timeZoneNames.json';
import * as editor from '../editor.json';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { dialogScheduleClassData, IClassBookingList, IClassRoom, IPrivateRoom, IRentRoom, ISchedule, ScheduleFilters } from 'src/app/models/schedule.model';
import { ScheduleService } from 'src/app/services/schedule.service';
import { MatDialog } from '@angular/material/dialog';
import { ClassScheduleFormComponent } from '../class-schedule-form/class-schedule-form.component';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { DateType, StandardDatePipe } from 'src/app/pipes/standard-date.pipe';
import { PublishClassesFormComponent } from './publish-classes-form/publish-classes-form.component';
import { ClassScheduleQuickinfoComponent } from '../class-schedule-quickinfo/class-schedule-quickinfo.component';
import { AsyncPipe, NgStyle } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { forkJoin, map } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { LookupType } from 'src/app/models/enums';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { RentRoomScheduleFormComponent } from '../rent-room-schedule-form/rent-room-schedule-form.component';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { PrivateClassScheduleFormComponent } from '../private-class-schedule-form/private-class-schedule-form.component';

loadCldr(numberingSystems, gregorian, numbers, timeZoneNames);
L10n.load(editor);
@Component({
  selector: 'app-schedular-table-container',
  templateUrl: './schedular-table-container.component.html',
  styleUrls: ['./schedular-table-container.component.scss'],
  providers: [StandardDatePipe],
  imports: [MatButtonModule, MatIconModule, RouterLink, ScheduleModule, NgStyle, ClassScheduleQuickinfoComponent, TranslateModule, MatSelectModule, FormsModule, AsyncPipe, MatMenuModule]
})
export class SchedularTableContainerComponent implements OnInit {
  @ViewChild('scheduleObj') public scheduleObj: ScheduleComponent;
  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;
  @ViewChild('menuTrigger', { read: ElementRef }) menuTriggerButton: ElementRef<HTMLButtonElement>;

  public currentView: View = "Week";
  public eventSettings: EventSettingsModel = { dataSource: [] };

  currentLang: string;
  scheduleData: any[] = [];
  // currentAction: 'Add' | 'Save' | 'Delete' | null;
  showQuickInfo: boolean;
  filters: ScheduleFilters = new ScheduleFilters();

  private router = inject(Router);
  private translate = inject(TranslateService);
  private scheduleService = inject(ScheduleService);
  public dialog = inject(MatDialog);
  private standardPipe = inject(StandardDatePipe);
  private common = inject(CommonService);
  private destroyRef = inject(DestroyRef);
  classProgram$ = this.common.getLookup(LookupType.ClassPrograms);
  classGenre$ = this.common.getLookup(LookupType.ClassGenres);

  rooms: IClassRoom[] = [];
  classesTypes: any[] = [];
  instructors: any[] = [];
  isPresent = true;

  public group: GroupModel | undefined = {
    resources: ['Rooms'],
    byDate: true
  };

  selectedCellDialog = {} as dialogScheduleClassData;

  ngOnInit(): void {
    this.currentLang = this.translate.getDefaultLang();
    this.getFilters();
  }

  getFilters() {
    forkJoin({
      rooms: this.scheduleService.getClassRooms(),
      classes: this.common.getLookup(LookupType.ClassesTypes),
      instructors: this.common.getLookup(LookupType.Instructors)
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.instructors = res.instructors;
        this.rooms = res.rooms.data;
        this.classesTypes = res.classes;
      }
    })
  }

  // switchView() {
  //   this.showRentRooms = !this.showRentRooms;
  //   this.getSchedule();
  // }



  getSchedule() {
    this.scheduleData = [];
    forkJoin([
      this.scheduleService.getRentRoomsSchedule(this.filters).pipe(map(res => res.data.map((r: IRentRoom) => ({ ...r, isRentRoom: true })))),
      this.scheduleService.getClassesSchedule(this.filters).pipe(map(res => res.data.map((r: IRentRoom) => ({ ...r, isRentRoom: false })))),
      this.scheduleService.getPrivateRoomsSchedule(this.filters).pipe(map(res => res.data.map((r: IPrivateRoom) => ({ ...r, isRentRoom: false, isPrivateRoom: true })))),
    ]).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        const classes = [...res[0], ...res[1], ...res[2]];
        classes.forEach((item: IClassBookingList) => {

          let _subject = item.classTypeName + ' with ' + item.instructorName + (item.isCancelled ? ' (Cancelled)' : '');

          if (item.isRentRoom) {
            _subject = (`${this.translate.instant('classSchedule.rentRoom')} ${item.roomName}`)
          }

          if (item.isPrivateRoom) {
            _subject = (`${this.translate.instant('classSchedule.privateRoom')} ${item.roomName} (${item.memberName})`)
          }

          let obj = {
            ...item,
            colorHex: item.isCancelled ? '#8f8f8f' : item.colorHex,
            StartTime: item.isRentRoom ? new Date(item.fromDate) : new Date(item.startDate),
            EndTime: item.isRentRoom ? new Date(item.toDate) : new Date(item.endDate),
            Subject: _subject,
            IsAllDay: false
          };
          this.scheduleData.push(obj)
        })
        this.eventSettings = {
          dataSource: this.scheduleData
        };
      }
    })
  }

  onCellClick(args: CellClickEventArgs) {
    args.cancel = true;
    const groupIndex = args.groupIndex;

    this.selectedCellDialog = {} as dialogScheduleClassData;
    this.selectedCellDialog.type = 'Add';
    this.selectedCellDialog.startTime = args.startTime ?? new Date();

    if (groupIndex != null && this.rooms[groupIndex]) {
      this.selectedCellDialog.scheduledClass = {} as ISchedule;
      this.selectedCellDialog.scheduledClass.roomId = this.rooms[groupIndex].id;
    }

    // Move the hidden button to mouse position
    const button = this.menuTriggerButton.nativeElement;
    button.style.left = `${(args.event! as any).clientX}px`;
    button.style.top = `${(args.event! as any).clientY}px`;

    this.menuTrigger.openMenu();
  }

  onEventClick(args: PopupOpenEventArgs): void {
    const _data = <ISchedule>this.scheduleObj.getEventDetails(args.element);
    if (!_data.isPrivateRoom && !_data.isRentRoom) {
      this.router.navigate(['/admin/scheduler/booking-list/class', _data.id])
    } else {
      args.cancel = true;
      let data = {} as dialogScheduleClassData;
      data.type = 'Save';
      data.scheduledClass = _data;
      this.openScheduleForm(data);
    }
  }


  openScheduleForm(data: dialogScheduleClassData) {
    if (data.scheduledClass.isRentRoom && !data.scheduledClass.isPrivateRoom) {
      this.openRentRoomForm(data);
    } else if (!data.scheduledClass.isRentRoom && data.scheduledClass.isPrivateRoom) {
      this.openPrivateClassForm(data);
    } else {
      this.openClassRoomForm(data);
    }
  }

  openRentRoomForm(data: dialogScheduleClassData = this.selectedCellDialog) {
    const dialogRef = this.dialog.open(RentRoomScheduleFormComponent, {
      maxHeight: '85vh',
      width: '500px',
      data: data,
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getSchedule();
      }
    });
  }

  openPrivateClassForm(data: dialogScheduleClassData = this.selectedCellDialog) {
    const dialogRef = this.dialog.open(PrivateClassScheduleFormComponent, {
      maxHeight: '85vh',
      width: '500px',
      data: data,
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getSchedule();
      }
    });
  }

  openClassRoomForm(data: dialogScheduleClassData = this.selectedCellDialog) {
    const dialogRef = this.dialog.open(ClassScheduleFormComponent, {
      maxHeight: '85vh',
      width: '500px',
      data: data,
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getSchedule();
      }
    });
  }


  onEdit(e: ISchedule) {
    let data = {} as dialogScheduleClassData;
    data.type = 'Save';
    data.scheduledClass = e;
    this.openScheduleForm(data);
  }

  closePopUp() {
    this.scheduleObj.closeQuickInfoPopup();
  }

  deleteEvent(data: ISchedule) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxHeight: '80vh',
      data: { mainTitle: this.translate.instant('classSchedule.msgToDeletedClass') },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'yes') {
        this.scheduleService.deleteScheduleClass(data.id).subscribe({
          next: (res) => {
            this.getSchedule();
          }
        })
      }
    });
  }

  onHover(args: any) {
    if (args.element!.classList.contains("e-appointment")) {
      let ele: any = this.scheduleObj.getEventDetails(args.element);
      this.scheduleObj.openQuickInfoPopup(ele);
    }
  }

  onEventRendered(args: EventRenderedArgs): void {
    let classId = args.data['classTypeId'];
    args.element.style.backgroundColor = args.data['colorHex'];
  }


  onNavigation() {
    setTimeout(() => {
      let currentViewDates: Date[] = this.scheduleObj.getCurrentViewDates() as Date[];
      let startDate: Date = currentViewDates[0] as Date;
      let endDate: Date = currentViewDates[currentViewDates.length - 1] as Date;
      if (startDate) {
        this.filters.fromDate = this.standardPipe.transform(startDate, DateType.DATE_START);
        this.filters.toDate = this.standardPipe.transform(endDate, DateType.DATE_END);
        this.getSchedule();
        this.refreshView(this.scheduleObj.currentView);
      }
    }, 500);

  }

  previousView: string;
  hasRefreshedQuickInfo = false;
  refreshView(currentView: string) {
    if (currentView === 'Week' && !this.hasRefreshedQuickInfo) {
      this.hasRefreshedQuickInfo = true;
      setTimeout(() => {
        this.scheduleObj.refresh(); // Only refresh ONCE
      }, 500);
    }

    this.previousView = currentView;
  }

  publishAll() {
    let dialogRef = this.dialog.open(PublishClassesFormComponent, {
      maxHeight: '80vh',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getSchedule();
      }
    });
  }

  public onActionBegin(args: ActionEventArgs): void {
    if (args.requestType === "viewNavigate") {
      this.isPresent = false;
      setTimeout(() => this.isPresent = true, 0);

    }
  }


}
