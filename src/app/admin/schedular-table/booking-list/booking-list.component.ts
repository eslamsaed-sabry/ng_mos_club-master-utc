import { Component, OnInit } from '@angular/core';
import { LookupType } from 'src/app/models/enums';
import { ClassBookingListFilters, IClassBookingList, IClassType, dialogScheduleClassData } from 'src/app/models/schedule.model';
import { ScheduleService } from 'src/app/services/schedule.service';
import moment from 'moment';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { ClassScheduleFormComponent } from '../class-schedule-form/class-schedule-form.component';
import { MatDialog } from '@angular/material/dialog';
import { PublishClassesFormComponent } from '../schedular-table-container/publish-classes-form/publish-classes-form.component';
import { TranslateModule } from '@ngx-translate/core';
import { ClassBookingListItemComponent } from './class-booking-list-item/class-booking-list-item.component';
import { NgxMasonryModule } from 'ngx-masonry';
import { NgClass } from '@angular/common';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
@Component({
    selector: 'app-booking-list',
    templateUrl: './booking-list.component.html',
    styleUrls: ['./booking-list.component.scss'],
    imports: [MatButtonModule, RouterLink, MatIconModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, FormsModule, MatSelectModule, MatOptionModule, NgxMasonryModule, NgClass, ClassBookingListItemComponent, TranslateModule]
})
export class BookingListComponent implements OnInit {
  filters: ClassBookingListFilters = new ClassBookingListFilters();
  classTypes: IClassType[] = [];
  classesSchedule: IClassBookingList[] = [];
  selectedClassId: number | null;
  constructor(public dialog: MatDialog, private scheduleService: ScheduleService, private route: ActivatedRoute, private commonService: CommonService) { }

  ngOnInit(): void {
    this.getClasses();
    // this.filters.fromDate = moment(new Date()).startOf('week').format('YYYY-MM-DD');
    // this.filters.toDate = moment(new Date()).endOf('week').format('YYYY-MM-DD');

    this.filters.fromDate = moment(new Date()).format('YYYY-MM-DD') + 'T00:00';
    this.filters.toDate = moment(new Date()).format('YYYY-MM-DD') + 'T23:59';

    this.route.queryParams.subscribe((params: Params) => {
      if (params['classId']) {
        this.selectedClassId = params['classId'];
        this.filters.fromDate = moment(params['startDate']).startOf('month').format('YYYY-MM-DD');
      }
      this.getSchedule();
    });
  }

  getClasses() {
    this.commonService.getLookup(LookupType.ClassesTypes).subscribe({
      next: (res) => {
        this.classTypes = res;
      }
    })
  }

  getSchedule() {
    this.scheduleService.getClassBookingListFilters(this.filters).subscribe({
      next: (res) => {
        this.classesSchedule = res.data;

        if (this.selectedClassId) {
          setTimeout(() => {
            document.getElementById('data-id-' + this.selectedClassId)!.scrollIntoView({ behavior: "smooth", block: "start", inline: "center" });
          }, 1000);
        }
      }
    })
  }

  addClass() {
    let data = {} as dialogScheduleClassData;
    data.type = 'Add';
    data.startTime = new Date();
    let dialogRef = this.dialog.open(ClassScheduleFormComponent, {
      maxHeight: '80vh',
      width: '500px',
      data: data,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getClasses();
      }
    });
  }

  showAllOtherClasses() {
    this.selectedClassId = null;
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


}
