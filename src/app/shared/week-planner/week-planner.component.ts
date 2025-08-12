import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { WeekDayPlanner, WeekPlanner } from 'src/app/models/common.model';
import moment from 'moment';
import { TranslateModule } from '@ngx-translate/core';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-week-planner',
    templateUrl: './week-planner.component.html',
    styleUrls: ['./week-planner.component.scss'],
    imports: [FormsModule, MatExpansionModule, MatCheckboxModule, MatIconModule, NgxMaterialTimepickerModule, TranslateModule]
})
export class WeekPlannerComponent implements OnChanges {
  @Input() data: Partial<WeekPlanner>;
  now = moment().format('hh:mm a');
  weekDays: WeekDayPlanner[] = [
    { id: 1, key: 'staff.saturday', status: true, startTime: this.now, endTime: this.now, isStartTime: false, isEndTime: false },
    { id: 2, key: 'staff.sunday', status: true, startTime: this.now, endTime: this.now, isStartTime: false, isEndTime: false },
    { id: 3, key: 'staff.monday', status: true, startTime: this.now, endTime: this.now, isStartTime: false, isEndTime: false },
    { id: 4, key: 'staff.tuesday', status: true, startTime: this.now, endTime: this.now, isStartTime: false, isEndTime: false },
    { id: 5, key: 'staff.wednesday', status: true, startTime: this.now, endTime: this.now, isStartTime: false, isEndTime: false },
    { id: 6, key: 'staff.thursday', status: true, startTime: this.now, endTime: this.now, isStartTime: false, isEndTime: false },
    { id: 7, key: 'staff.friday', status: true, startTime: this.now, endTime: this.now, isStartTime: false, isEndTime: false },
  ]


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      if (this.data && Object.keys(this.data).length)
        this.setData();
    }
  }

  setData() {
    if (this.data) {
      this.weekDays.forEach((day) => {
        switch (day.id) {
          case 1:
            day.status = this.data.isSaturday || false;
            day.startTime = this.data.saturdayStartTime ? moment(this.data.saturdayStartTime, 'hh:mm:ss').format('hh:mm a') : null;
            day.isStartTime = !!day.startTime;
            day.endTime = this.data.saturdayEndTime ? moment(this.data.saturdayEndTime, 'hh:mm:ss').format('hh:mm a') : null;
            day.isEndTime = !!day.endTime;
            break;
          case 2:
            day.status = this.data.isSunday || false;
            day.startTime = this.data.sundayStartTime ? moment(this.data.sundayStartTime, 'hh:mm:ss').format('hh:mm a') : null;
            day.isStartTime = !!day.startTime;
            day.endTime = this.data.sundayEndTime ? moment(this.data.sundayEndTime, 'hh:mm:ss').format('hh:mm a') : null;
            day.isEndTime = !!day.endTime;
            break;
          case 3:
            day.status = this.data.isMonday || false;
            day.startTime = this.data.mondayStartTime ? moment(this.data.mondayStartTime, 'hh:mm:ss').format('hh:mm a') : null;
            day.isStartTime = !!day.startTime;
            day.endTime = this.data.mondayEndTime ? moment(this.data.mondayEndTime, 'hh:mm:ss').format('hh:mm a') : null;
            day.isEndTime = !!day.endTime;
            break;
          case 4:
            day.status = this.data.isTuesday || false;
            day.startTime = this.data.tuesdayStartTime ? moment(this.data.tuesdayStartTime, 'hh:mm:ss').format('hh:mm a') : null;
            day.isStartTime = !!day.startTime;
            day.endTime = this.data.tuesdayEndTime ? moment(this.data.tuesdayEndTime, 'hh:mm:ss').format('hh:mm a') : null;
            day.isEndTime = !!day.endTime;
            break;
          case 5:
            day.status = this.data.isWednesday || false;
            day.startTime = this.data.wednesdayStartTime ? moment(this.data.wednesdayStartTime, 'hh:mm:ss').format('hh:mm a') : null;
            day.isStartTime = !!day.startTime;
            day.endTime = this.data.wednesdayEndTime ? moment(this.data.wednesdayEndTime, 'hh:mm:ss').format('hh:mm a') : null;
            day.isEndTime = !!day.endTime;
            break;
          case 6:
            day.status = this.data.isThursday || false;
            day.startTime = this.data.thursdayStartTime ? moment(this.data.thursdayStartTime, 'hh:mm:ss').format('hh:mm a') : null;
            day.isStartTime = !!day.startTime;
            day.endTime = this.data.thursdayEndTime ? moment(this.data.thursdayEndTime, 'hh:mm:ss').format('hh:mm a') : null;
            day.isEndTime = !!day.endTime;
            break;
          case 7:
            day.status = this.data.isFriday || false;
            day.startTime = this.data.fridayStartTime ? moment(this.data.fridayStartTime, 'hh:mm:ss').format('hh:mm a') : null;
            day.isStartTime = !!day.startTime;
            day.endTime = this.data.fridayEndTime ? moment(this.data.fridayEndTime, 'hh:mm:ss').format('hh:mm a') : null;
            day.isEndTime = !!day.endTime;
            break;

          default:
            break;
        }
      })
    }
  }

  submit() {
    let planner: WeekPlanner = {} as WeekPlanner;
    this.weekDays.forEach((day) => {
      switch (day.id) {
        case 1:
          planner.isSaturday = day.status;
          planner.saturdayStartTime = day.isStartTime && day.status ? moment(day.startTime, 'hh:mm a').format('HH:mm:ss') : null;
          planner.saturdayEndTime = day.isEndTime && day.status ? moment(day.endTime, 'hh:mm a').format('HH:mm:ss') : null;
          break;
        case 2:
          planner.isSunday = day.status;
          planner.sundayStartTime = day.isStartTime && day.status ? moment(day.startTime, 'hh:mm a').format('HH:mm:ss') : null;
          planner.sundayEndTime = day.isEndTime && day.status ? moment(day.endTime, 'hh:mm a').format('HH:mm:ss') : null;
          break;
        case 3:
          planner.isMonday = day.status;
          planner.mondayStartTime = day.isStartTime && day.status ? moment(day.startTime, 'hh:mm a').format('HH:mm:ss') : null;
          planner.mondayEndTime = day.isEndTime && day.status ? moment(day.endTime, 'hh:mm a').format('HH:mm:ss') : null;
          break;
        case 4:
          planner.isTuesday = day.status;
          planner.tuesdayStartTime = day.isStartTime && day.status ? moment(day.startTime, 'hh:mm a').format('HH:mm:ss') : null;
          planner.tuesdayEndTime = day.isEndTime && day.status ? moment(day.endTime, 'hh:mm a').format('HH:mm:ss') : null;
          break;
        case 5:
          planner.isWednesday = day.status;
          planner.wednesdayStartTime = day.isStartTime && day.status ? moment(day.startTime, 'hh:mm a').format('HH:mm:ss') : null;
          planner.wednesdayEndTime = day.isEndTime && day.status ? moment(day.endTime, 'hh:mm a').format('HH:mm:ss') : null;
          break;
        case 6:
          planner.isThursday = day.status;
          planner.thursdayStartTime = day.isStartTime && day.status ? moment(day.startTime, 'hh:mm a').format('HH:mm:ss') : null;
          planner.thursdayEndTime = day.isEndTime && day.status ? moment(day.endTime, 'hh:mm a').format('HH:mm:ss') : null;
          break;
      
        default:
          planner.isFriday = day.status;
          planner.fridayStartTime = day.isStartTime && day.status ? moment(day.startTime, 'hh:mm a').format('HH:mm:ss') : null;
          planner.fridayEndTime = day.isEndTime && day.status ? moment(day.endTime, 'hh:mm a').format('HH:mm:ss') : null;
          break;
      }

    })
    return planner
  }
}
