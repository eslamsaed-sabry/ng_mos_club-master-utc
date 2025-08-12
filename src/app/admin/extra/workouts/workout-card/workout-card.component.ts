import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IWorkOut } from 'src/app/models/management.model';
import { TranslateModule } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-workout-card',
    templateUrl: './workout-card.component.html',
    styleUrls: ['./workout-card.component.scss'],
    imports: [MatButtonModule, MatIconModule, DatePipe, TranslateModule]
})
export class WorkoutCardComponent {
  @Input() workout: IWorkOut;
  @Output() onAction: EventEmitter<{ actionType: string, workout: IWorkOut }> = new EventEmitter();
}
