import { Component, Output, Input, EventEmitter } from '@angular/core';
import { IWorkOutParams } from 'src/app/models/management.model';

@Component({
    selector: 'app-workout-members-filters',
    templateUrl: './workout-members-filters.component.html',
    styleUrls: ['./workout-members-filters.component.scss'],
    standalone: true
})
export class WorkoutMembersFiltersComponent {
  @Output() onFilter: EventEmitter<any> = new EventEmitter();
  @Input() filters: IWorkOutParams;
}
