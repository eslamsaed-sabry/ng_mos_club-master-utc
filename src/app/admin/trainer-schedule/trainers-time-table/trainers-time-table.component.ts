import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { SalesScheduleService } from 'src/app/services/sales-schedule.service';
import { DateType, StandardDatePipe } from 'src/app/pipes/standard-date.pipe';
import { CommonService } from 'src/app/services/common.service';
import { EventRenderedArgs, EventSettingsModel, GroupModel, PopupOpenEventArgs, ScheduleComponent, View, ScheduleModule } from '@syncfusion/ej2-angular-schedule';
import { ITrainerTimeTableSchedule, TrainerTimeTableFilters, TrainersTimeTableSlotForm } from 'src/app/models/common.model';
import { LookupType } from 'src/app/models/enums';
import { dialogTrainersTimeTableSlot } from 'src/app/models/member.model';
import { TrainersTimeTableSlotFormComponent } from './trainers-time-table-slot-form/trainers-time-table-slot-form.component';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { TrainersTimeTableFilterComponent } from './trainers-time-table-filter/trainers-time-table-filter.component';
import { switchMap, tap } from 'rxjs';

@Component({
    selector: 'app-trainers-time-table',
    templateUrl: './trainers-time-table.component.html',
    styleUrl: './trainers-time-table.component.scss',
    imports: [MatSidenavModule, MatButtonModule, MatIconModule, ScheduleModule, TrainersTimeTableFilterComponent,
        RouterLink, TranslateModule, CommonModule]
})
export class TrainersTimeTableComponent implements OnInit {
  @ViewChild('scheduleObj') public scheduleObj: ScheduleComponent;
  private translate = inject(TranslateService);
  private apiService = inject(SalesScheduleService);
  public dialog = inject(MatDialog);
  private standardPipe = inject(StandardDatePipe);
  private common = inject(CommonService);
  private destroyRef = inject(DestroyRef);

  width = screen.width;
  filters: TrainerTimeTableFilters = new TrainerTimeTableFilters();
  showSchedule: boolean;
  public eventSettings: EventSettingsModel = { dataSource: [] };
  public currentView: View = "Day";
  currentLang: string;
  trainersTimeTable: any[] = [];
  public views: Array<string> = ['Day', 'Week', 'Month', 'TimelineWeek', 'TimelineMonth'];
  public group: GroupModel = {
    resources: ['Owners']
  };
  public allowMultipleOwner: Boolean = true;
  public trainers: any[] = [];
  trainer$ = this.common.getLookup(LookupType.Trainers).pipe(tap(res => {
    if (res.length) {
      res.forEach((item: any) => {
        let obj = {
          ...item,
          OwnerText: item.name,
          Id: item.id,
          OwnerColor: item.colorHex
        }
        this.trainers.push(obj)
      })
    }
    return res
  }), switchMap(res => this.getSchedule$));

  constructor() { }
  getSchedule$ = this.apiService.getTrainerTimeTable(this.filters).pipe(tap((res) => {
    res.data.forEach((item: ITrainerTimeTableSchedule) => {
      let obj = {
        ...item,
        StartTime: new Date(item.startDate),
        EndTime: new Date(item.endDate),
        Subject: item.memberName ? item.memberName : "",
        IsAllDay: false,
        OwnerId: item.employeeId,
      };
      this.trainersTimeTable.push(obj)
    });

    this.eventSettings = {
      dataSource: this.trainersTimeTable
    };
    this.showSchedule = true;
  }))

  ngOnInit(): void {
    this.currentLang = this.translate.getDefaultLang();
  }

  getTrainerTimeTable() {
    this.trainersTimeTable = [];
    this.getSchedule$ = this.apiService.getTrainerTimeTable(this.filters)
  }

  showSlotForm(type: string, slot?: TrainersTimeTableSlotForm, groupIndex?: number, startTime?: any) {
    let data = {} as dialogTrainersTimeTableSlot;
    data.slotData = {} as TrainersTimeTableSlotForm;

    if (groupIndex != null) {
      groupIndex = (this.trainers[groupIndex] as any).id
    }

    if (slot) {
      data.slotData.id = slot.id;
      data.slotData.startDate = slot.startDate;
      data.slotData.durationInMinutes = slot.durationInMinutes;
      data.slotData.employeeId = slot.employeeId;
      data.slotData.typeId = slot.typeId;
      data.slotData.memberId = slot.memberId;
      data.slotData.memberName = slot.memberName;
    }

    if (startTime && type === "add") {
      data.slotData.startDate = startTime;
    }

    data.type = type;
    data.employeeId = groupIndex;

    let dialogRef = this.dialog.open(TrainersTimeTableSlotFormComponent, {
      maxHeight: '80vh',
      width: '700px',
      data: data,
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getTrainerTimeTable();
      }
    });
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
      this.showSlotForm('add', undefined, newArgs.groupIndex, newArgs.startTime);
    } else if (args.name === 'cellClick' && this.currentView !== 'Month') {
      this.showSlotForm('add', undefined, newArgs.groupIndex, newArgs.startTime);
    }
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
        this.apiService.dismissUserReminder(id).subscribe({
          next: (res) => {
            this.getTrainerTimeTable();
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
        this.apiService.cancelTrainerSlot(id).subscribe({
          next: (res) => {
            this.getTrainerTimeTable();
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
        this.apiService.deleteTrainerTimeTableSlot(id).subscribe({
          next: (res) => {
            this.getTrainerTimeTable();
          }
        });
      }
    });
  }

  onNavigation() {
    let currentViewDates: Date[] = this.scheduleObj.getCurrentViewDates() as Date[];
    let startDate: Date = currentViewDates[0] as Date;
    let endDate: Date = currentViewDates[currentViewDates.length - 1] as Date;
    if (startDate) {
      this.filters.fromDate = this.standardPipe.transform(startDate, DateType.DATE_START);
      this.filters.toDate = this.standardPipe.transform(endDate, DateType.DATE_END);
      this.getTrainerTimeTable();
    }
  }

}
