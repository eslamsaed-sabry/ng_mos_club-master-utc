import { Component, Input } from '@angular/core';
import { ISchedule } from 'src/app/models/schedule.model';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-class-schedule-quickinfo',
    templateUrl: './class-schedule-quickinfo.component.html',
    styleUrls: ['./class-schedule-quickinfo.component.scss'],
    imports: [MatIconModule, DatePipe, RouterLink]
})
export class ClassScheduleQuickinfoComponent {
  @Input() data: ISchedule;
}
