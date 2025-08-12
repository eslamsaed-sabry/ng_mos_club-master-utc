import { Component, DestroyRef, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { EventRenderedArgs, EventSettingsModel, GroupModel, PopupOpenEventArgs, ScheduleComponent, View, ScheduleModule } from '@syncfusion/ej2-angular-schedule';
import { IDeleteAvailableSlots, ITrainerSchedule, TrainerScheduleFilters, TrainerSlotForm } from 'src/app/models/common.model';
import { SalesScheduleService } from 'src/app/services/sales-schedule.service';
import { MemberReminderFormComponent } from '../members/member-reminder-form/member-reminder-form.component';
import { dialogMemberReminder, dialogTrainerSlot, dialogTrainerSlotMember } from 'src/app/models/member.model';
import { MatDialog, MatDialogActions, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { SlotFormComponent } from './slot-form/slot-form.component';
import { SlotMembersListComponent } from './slot-members-list/slot-members-list.component';
import { DateType, StandardDatePipe } from 'src/app/pipes/standard-date.pipe';
import { LookupType, ScheduleType } from 'src/app/models/enums';
import { CommonService } from 'src/app/services/common.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ScheduleFiltersComponent } from './schedule-filters/schedule-filters.component';
import { BidiModule } from '@angular/cdk/bidi';
import { RoleDirective } from '../../directives/role.directive';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map, of, switchMap, tap } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, NgForm } from '@angular/forms';
@Component({
    selector: 'app-trainer-schedule',
    templateUrl: './trainer-schedule.component.html',
    styleUrls: ['./trainer-schedule.component.scss'],
    imports: [
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    BidiModule,
    ScheduleFiltersComponent,
    ScheduleModule,
    RouterLink,
    TranslateModule,
    CommonModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    MatDialogActions,
    MatDialogTitle,
    MatDialogContent
]
})
export class TrainerScheduleComponent implements OnInit {
  @ViewChild('scheduleObj') public scheduleObj: ScheduleComponent;
  @ViewChild('deleteSlotsModal') deleteSlotsModal: TemplateRef<any>;

  private translate = inject(TranslateService);
  private apiService = inject(SalesScheduleService);
  public dialog = inject(MatDialog);
  private standardPipe = inject(StandardDatePipe);
  private common = inject(CommonService);
  private destroyRef = inject(DestroyRef);
  private route = inject(ActivatedRoute);
  private salesScheduleService = inject(SalesScheduleService);

  width = screen.width;
  filters: TrainerScheduleFilters = new TrainerScheduleFilters();
  showSchedule: boolean;
  public eventSettings: EventSettingsModel = { dataSource: [] };
  public currentView: View = "Day";
  currentLang: string;
  scheduleData: any[] = [];
  public views: Array<string> = ['Day', 'Week', 'Month', 'TimelineWeek', 'TimelineMonth'];
  public group: GroupModel = {
    resources: ['Owners']
  };
  public allowMultipleOwner: Boolean = true;
  public trainersOrDoctors: any[] = [];
  scheduleTypeName: ScheduleType = this.route.snapshot.data['scheduleTypeName'];
  deleteAvailableSlots: IDeleteAvailableSlots = {} as IDeleteAvailableSlots;

  obj = this.scheduleTypeName == ScheduleType.trainerSchedule ? LookupType.Trainers : LookupType.Doctors

  trainersOrDoctors$ = this.common.getLookup(this.obj).pipe(tap(res => {
    if (res.length) {
      res.forEach((item: any) => {
        let obj = {
          ...item,
          OwnerText: item.name,
          Id: item.id,
          OwnerColor: item.colorHex
        }
        this.trainersOrDoctors.push(obj)
      })
    }
    return res
  }), switchMap(res => this.scheduleTypeName == ScheduleType.trainerSchedule ? this.getTrainer$ : this.getDoctor$));


  getTrainer$ = this.apiService.getTrainerSchedule(this.filters).pipe(tap((res) => {
    res.data.forEach((item: ITrainerSchedule) => {
      let obj = {
        ...item,
        StartTime: new Date(item.happeningDate),
        EndTime: new Date(item.happeningDate),
        Subject: item.memberName ? item.memberName : item.summary,
        IsAllDay: false,
        OwnerId: item.trainerId
      };
      this.scheduleData.push(obj)
    });
    this.eventSettings = {
      dataSource: this.scheduleData
    };
    this.showSchedule = true;
  }))

  getDoctor$ = this.apiService.getDoctorSchedule(this.filters).pipe(tap((res) => {
    res.data.forEach((item: ITrainerSchedule) => {
      let obj = {
        ...item,
        StartTime: new Date(item.happeningDate),
        EndTime: new Date(item.happeningDate),
        Subject: item.memberName ? item.memberName : item.summary,
        IsAllDay: false,
        OwnerId: item.trainerId
      };
      this.scheduleData.push(obj)
    });
    this.eventSettings = {
      dataSource: this.scheduleData
    };
    this.showSchedule = true;
  }))

  ngOnInit(): void {
    this.currentLang = this.translate.getDefaultLang();
  }

  getSchedule() {
    this.scheduleData = [];
    this.trainersOrDoctors$ = this.common.getLookup(this.obj).pipe(
      switchMap(res => this.scheduleTypeName == ScheduleType.trainerSchedule ? this.getTrainer$ : this.getDoctor$))
  }

  onEventRendered(args: EventRenderedArgs): void {
    args.element.style.backgroundColor = args.data['colorHex'];
  }

  onPopupOpen(args: PopupOpenEventArgs): void {
    let newArgs: any = args;
    args.cancel = true;
    if (args.name === 'eventClick') {
      let ele: any = this.scheduleObj.getEventDetails(args.element);
      this.scheduleObj.openQuickInfoPopup(ele);
      this.scheduleObj.closeEditor();
    } else if (args.name === 'cellClick' && this.currentView === 'Month' && newArgs.element!.lastChild.children.length < 6) {
      this.showSlotForm('add', newArgs.startTime, undefined, newArgs.groupIndex);
    } else if (args.name === 'cellClick' && this.currentView !== 'Month') {
      this.showSlotForm('add', newArgs.startTime, undefined, newArgs.groupIndex);
    }
  }

  addReminder(reminderDate?: any) {
    let data = {} as dialogMemberReminder;
    data.type = 'add';
    data.dataType = "MEMBER";
    data.showSearch = true;
    data.reminderDate = reminderDate;
    let dialogRef = this.dialog.open(MemberReminderFormComponent, {
      maxHeight: '80vh',
      maxWidth: '700px',
      data: data,
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getSchedule()
      }
    });
  }

  showSlotForm(type: string, slotDate?: any, slot?: TrainerSlotForm, groupIndex?: number) {
    if (groupIndex != null) {
      groupIndex = (this.trainersOrDoctors[groupIndex] as any).id
    }

    let data = {} as dialogTrainerSlot;
    data.type = type;
    data.scheduleType = this.scheduleTypeName;
    data.slotDate = slotDate;
    data.slotData = slot;
    data.trainerId = groupIndex;

    let dialogRef = this.dialog.open(SlotFormComponent, {
      maxHeight: '80vh',
      width: '700px',
      data: data,
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getSchedule()

      }
    });
  }

  closePopUp() {
    this.scheduleObj.closeQuickInfoPopup();
  }

  dismiss(id: number) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxHeight: '80vh',
      data: { mainTitle: this.translate.instant('members.msgToDismissReminder') },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'yes') {
        this.apiService.dismissUserReminder(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
          next: (res) => {
            this.getSchedule()
          }
        });
      }
    });
  }

  cancelSlot(id: number) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxHeight: '80vh',
      data: { mainTitle: this.translate.instant('members.msgToCancelSlot') },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'yes') {
        this.apiService.cancelTrainerSlot(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
          next: (res) => {
            this.getSchedule()
          }
        });
      }
    });
  }

  deleteSlot(id: number) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxHeight: '80vh',
      data: { mainTitle: this.translate.instant('members.msgToDeletedSlot') },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'yes') {
        this.apiService.deleteTrainerSlot(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
          next: (res) => {
            this.getSchedule()
          }
        });
      }
    });
  }

  showSlotMembers(slot: ITrainerSchedule) {
    let data: dialogTrainerSlotMember = {
      slotData: slot
    };
    this.dialog.open(SlotMembersListComponent, {
      maxHeight: '80vh',
      maxWidth: "500px",
      data: data,
      autoFocus: false
    });
  }

  onNavigation() {
    let currentViewDates: Date[] = this.scheduleObj.getCurrentViewDates() as Date[];
    let startDate: Date = currentViewDates[0] as Date;
    let endDate: Date = currentViewDates[currentViewDates.length - 1] as Date;
    // const startOfMonth = moment().clone().startOf('month').format('YYYY-MM-DD hh:mm');
    // const endOfMonth = moment().clone().endOf('month').format('YYYY-MM-DD hh:mm');
    if (startDate) {
      this.filters.fromDate = this.standardPipe.transform(startDate, DateType.DATE_START);
      this.filters.toDate = this.standardPipe.transform(endDate, DateType.DATE_END);
      this.getSchedule()
    }
  }

  openDeleteSlotsModal() {
    this.dialog.open(this.deleteSlotsModal, {
      width: '800px',
      autoFocus: false
    });
  }

  deleteSlots(form: NgForm) {
    if (form.form.status === 'VALID') {
      if (this.scheduleTypeName == ScheduleType.DoctorsSchedule)
        this.deleteAvailableSlots.isForDoctors = true;
      else
        this.deleteAvailableSlots.isForDoctors = false;

      this.salesScheduleService.deleteAvailableSlots(this.deleteAvailableSlots).subscribe({
        next: (res) => {
          this.getSchedule()
        }
      })
    }
  }

}
