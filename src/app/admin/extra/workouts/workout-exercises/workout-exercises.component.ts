import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ExtraService } from 'src/app/services/extra.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';

import { IWorkOut, IWorkOutExercise, IWorkOutMember, IWorkOutParams, dialogWorkoutExerciseData, dialogWorkoutMemberData } from 'src/app/models/management.model';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { WorkoutExerciseFormComponent } from './workout-exercise-form/workout-exercise-form.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-workout-exercises',
    templateUrl: './workout-exercises.component.html',
    styleUrls: ['./workout-exercises.component.scss'],
    imports: [MatButtonModule, RouterLink, MatIconModule, MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatMenuModule, MatPaginatorModule, TranslateModule]
})
export class WorkoutExercisesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  exercises: IWorkOutExercise[] = [];
  dataSource: MatTableDataSource<IWorkOutExercise>;
  displayedColumns: string[] = [
    'exerciseName',
    'sets',
    'reps',
    'rest',
    'notes',
    'actions'
  ];
  width = screen.width;
  filters: IWorkOutParams = {} as IWorkOutParams;
  totalElements: number;
  perPage: number;
  page: number;
  workoutDetails: IWorkOut;
  constructor(public dialog: MatDialog, private extraService: ExtraService, private route: ActivatedRoute,
    private translate: TranslateService) { }

  ngOnInit(): void {
    this.filters.skipCount = 0;
    this.filters.takeCount = 10;
    this.route.params.subscribe((params) => {
      if (params['workoutId']) {
        this.filters.workoutId = params['workoutId'];
        this.getExercises();
        this.getWorkoutDetails();
      };
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getWorkoutDetails() {
    this.extraService.getWorkouts({ id: this.filters.workoutId }).subscribe({
      next: (res) => {
        this.workoutDetails = res.data[0];
      }
    });
  }

  onPaginationChange(e: PageEvent) {
    this.page = e.pageIndex;
    this.perPage = e.pageSize;
    this.filters.skipCount = e.pageIndex * this.perPage;
    this.filters.takeCount = e.pageSize;
    this.getExercises();
  }

  getExercises() {
    this.extraService.getWorkoutExercises(this.filters).subscribe({
      next: (res) => {
        this.exercises = res.data;
        this.totalElements = res.totalCount;
        this.dataSource = new MatTableDataSource(this.exercises);
        this.dataSource.sort = this.sort;
      }
    })
  }

  openExerciseForm(actionType: string, exercise?:IWorkOutExercise) {
    let data = {} as dialogWorkoutExerciseData;
    data.type = actionType;
    data.workout = this.workoutDetails;
    data.exercise = exercise;
    let dialogRef = this.dialog.open(WorkoutExerciseFormComponent, {
      maxHeight: '80vh',
      width: '700px',
      data: data,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getExercises();
      }
    });

  }

  deleteExercise(exercise: IWorkOutExercise) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxHeight: '80vh',
      data: { mainTitle: this.translate.instant('extra.msgToDeletedExercise') },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'yes') {
        this.extraService.deleteWorkoutExercise(exercise.id).subscribe({
          next: (res) => {
            this.getExercises();
          }
        })
      }
    });
  }


}
