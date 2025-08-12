import { Component, OnInit, Inject } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { LookupType } from 'src/app/models/enums';
import { IExercise, IWorkOutExercise, dialogWorkoutExerciseData } from 'src/app/models/management.model';
import { CommonService } from 'src/app/services/common.service';
import { ExtraService } from 'src/app/services/extra.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';

import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'app-workout-exercise-form',
    templateUrl: './workout-exercise-form.component.html',
    styleUrls: ['./workout-exercise-form.component.scss'],
    imports: [MatDialogTitle, FormsModule, MatDialogContent, MatFormFieldModule, MatSelectModule, MatOptionModule, MatInputModule, MatRadioModule, MatDialogActions, MatButtonModule, TranslateModule],
    providers: [ExtraService]
})
export class WorkoutExerciseFormComponent implements OnInit {
  exercise: IWorkOutExercise = {} as IWorkOutExercise;
  workoutTypes: any[] = [];
  exercises: IExercise[] = [];
  constructor(public dialogRef: MatDialogRef<WorkoutExerciseFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: dialogWorkoutExerciseData, private extraService: ExtraService,
    private common: CommonService) { }

  ngOnInit(): void {
    this.exercise.workoutId = this.data.workout.id;
    this.getExerciseTypes();

    if (this.data.type === 'edit') {
      this.exercise = this.data.exercise!;
      this.getExercises();
    }
  }

  dismiss(status: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: status, data: data });
  }

  getExerciseTypes() {
    this.common.getLookup(LookupType.WorkOutTypes).subscribe({
      next: (res) => {
        this.workoutTypes = res;
      }
    })
  }

  getExercises() {
    let params = {
      typeId: this.exercise.workoutTypeId
    }
    this.extraService.getExercises(params).subscribe({
      next: (res) => {
        this.exercises = res.data;
      }
    })
  }

  submit(form: NgForm) {
    if (form.form.status === 'VALID') {
      if (this.data.type === 'add') {
        this.extraService.addWorkoutExercise(this.exercise).subscribe({
          next: (res) => {
            this.dismiss('success');
          }
        })
      } else {
        this.extraService.editWorkoutExercise(this.exercise).subscribe({
          next: (res) => {
            this.dismiss('success');
          }
        })
      }
    }
  }

}
