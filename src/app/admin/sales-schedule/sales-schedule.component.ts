import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { EventRenderedArgs, EventSettingsModel, PopupOpenEventArgs, ScheduleComponent, View, ScheduleModule } from '@syncfusion/ej2-angular-schedule';
import { ISalesSchedule, SalesScheduleFilters } from 'src/app/models/common.model';
import { SalesScheduleService } from 'src/app/services/sales-schedule.service';
import { MemberReminderFormComponent } from '../members/member-reminder-form/member-reminder-form.component';
import { dialogMemberReminder } from 'src/app/models/member.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { DateType, StandardDatePipe } from 'src/app/pipes/standard-date.pipe';
import { RouterLink } from '@angular/router';
import { ScheduleFiltersComponent } from './schedule-filters/schedule-filters.component';
import { BidiModule } from '@angular/cdk/bidi';
import { RoleDirective } from '../../directives/role.directive';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgStyle, DatePipe } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
@Component({
    selector: 'app-sales-schedule',
    templateUrl: './sales-schedule.component.html',
    styleUrls: ['./sales-schedule.component.scss'],
    imports: [MatSidenavModule, NgStyle, MatButtonModule, MatIconModule, RoleDirective, BidiModule, ScheduleFiltersComponent, ScheduleModule, RouterLink, DatePipe, TranslateModule]
})
export class SalesScheduleComponent implements OnInit {
  @ViewChild('scheduleObj') public scheduleObj: ScheduleComponent;
  width = screen.width;
  filters: SalesScheduleFilters = new SalesScheduleFilters();
  public eventSettings: EventSettingsModel = { dataSource: [] };
  public currentView: View = "Agenda";
  currentLang: string;
  scheduleData: any[] = [];

  constructor(private translate: TranslateService, private apiService: SalesScheduleService,
    public dialog: MatDialog, private standardPipe: StandardDatePipe) { }

  ngOnInit(): void {
    this.currentLang = this.translate.getDefaultLang();
  }

  getSchedule() {
    this.scheduleData = [];
    this.apiService.getSalesSchedule(this.filters).subscribe({
      next: (res) => {
        res.data.forEach((item: ISalesSchedule) => {
          let obj = {
            ...item,
            StartTime: new Date(item.happeningDate),
            EndTime: new Date(item.happeningDate),
            Subject: item.memberName ? item.memberName : item.summary,
            IsAllDay: false
          };
          this.scheduleData.push(obj)
        });
        this.eventSettings = {
          dataSource: this.scheduleData
        };
      }
    })
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
      this.addReminder(newArgs.startTime);
    } else if (args.name === 'cellClick' && this.currentView !== 'Month') {
      this.addReminder(newArgs.startTime);
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
      width: '700px',
      data: data,
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getSchedule();
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
        this.apiService.dismissUserReminder(id).subscribe({
          next: (res) => {
            this.getSchedule();
          }
        });
      }
    });
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
      }
    }, 500);
  }
}
