import { Component, DestroyRef, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { LookupType } from 'src/app/models/enums';
import { ExtraService } from 'src/app/services/extra.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { CommonService } from 'src/app/services/common.service';
import { IWorkOut } from 'src/app/models/management.model';
import { NgForm, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { MatInputModule } from '@angular/material/input';
import { WorkoutCardComponent } from './workout-card/workout-card.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-workouts',
    templateUrl: './workouts.component.html',
    styleUrls: ['./workouts.component.scss'],
    imports: [MatFormFieldModule, MatSelectModule, FormsModule, MatOptionModule, MatButtonModule, MatIconModule, WorkoutCardComponent, MatDialogTitle, MatDialogContent, MatInputModule, MatDialogActions, TranslateModule, MatPaginatorModule]
})
export class WorkoutsComponent implements OnInit {
  @ViewChild('workoutTemplateModal') workoutTemplateModal: TemplateRef<any>;
  public dialog = inject(MatDialog);
  private extraService = inject(ExtraService);
  private common = inject(CommonService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private translate = inject(TranslateService);
  private destroyRef = inject(DestroyRef);

  workouts: IWorkOut[] = [];
  totalElements: number;
  trainers: any[] = [];
  trainerId: number;
  filters = {
    skipCount: 0,
    takeCount: 10
  };
  page: number = 0;
  selectedWorkout: IWorkOut = {} as IWorkOut;
  workoutFormActionType: string;


  ngOnInit(): void {
    this.filters.skipCount = 0;
    this.filters.takeCount = 10;
    this.common.fetchRouteFilters().subscribe((params) => {
      if (params) {
        this.filters = { ...params };
        this.page = Math.floor(this.filters.skipCount / this.filters.takeCount);
      }
    });

    this.getWorkouts();
    this.getTrainers();
  }

  applyFilter() {
    this.common.setRouteFilters(this.filters);
    this.getWorkouts();
  }

  onPaginationChange(e: PageEvent) {
    this.page = e.pageIndex;
    this.filters.skipCount = e.pageIndex * this.filters.takeCount;
    this.filters.takeCount = e.pageSize;
    this.router.navigate([], {
      queryParams: {
        skipCount: this.filters.skipCount,
        takeCount: this.filters.takeCount,
        page: this.page
      },
      queryParamsHandling: 'merge'
    });
    this.common.setRouteFilters(this.filters);
    this.getWorkouts();
  }

  getTrainers() {
    this.common.getLookup(LookupType.Trainers).subscribe({
      next: (trainers) => {
        this.trainers = trainers;
      }
    })
  }

  getWorkouts() {
    this.extraService.getWorkouts(this.filters).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.workouts = res.data;
        this.totalElements = res.totalCount;
      }
    })
  }

  onAction(action: { actionType: string, workout: IWorkOut }) {
    this.selectedWorkout = action.workout;

    switch (action.actionType) {
      case 'delete':
        this.onDelete();
        break;
      case 'viewExercises':
        this.router.navigate([`exercises/${action.workout.id}`], {
          relativeTo: this.route
        });
        break;
      case 'viewMembers':
        this.router.navigate([`members/${action.workout.id}`], {
          relativeTo: this.route
        });
        break;

      default: //edit
        this.openWorkoutForm('edit');
        break;
    }
  }


  onFilterChange() {
    this.page = 0;
    this.getWorkouts();
  }

  openWorkoutForm(actionType: string) {
    this.workoutFormActionType = actionType;

    this.dialog.open(this.workoutTemplateModal, {
      maxWidth: '400px'
    });
  }

  onSubmitWorkout(form: NgForm) {
    if (form.form.status === 'VALID') {
      if (this.workoutFormActionType === 'add') {
        this.extraService.addWorkout(this.selectedWorkout).subscribe({
          next: (res) => {
            this.dialog.closeAll();
            this.getWorkouts();
          }
        });
      } else {
        this.extraService.editWorkout(this.selectedWorkout).subscribe({
          next: (res) => {
            this.dialog.closeAll();
            this.getWorkouts();
          }
        });
      }
    }
  }

  onDelete() {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxHeight: '80vh',
      data: { mainTitle: this.translate.instant('extra.msgToDeletedWorkout') },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'yes') {
        this.deleteWorkout();
      }
    });
  }

  deleteWorkout() {
    this.extraService.deleteWorkout(this.selectedWorkout.id).subscribe({
      next: (res) => {
        this.getWorkouts();
      }
    })
  }


}
