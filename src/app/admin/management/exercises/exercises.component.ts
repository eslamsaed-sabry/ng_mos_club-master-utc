import { Component, OnInit, TemplateRef, ViewChild, HostListener, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { AppConfigService } from 'src/app/services/app-config.service';
import { ManagementService } from 'src/app/services/management.service';
import { IExercise, dialogExerciseData } from 'src/app/models/management.model';
import { ExerciseFormComponent } from './exercise-form/exercise-form.component';
import { LookupType } from 'src/app/models/enums';
import { CommonService } from 'src/app/services/common.service';
import { ILookUp } from 'src/app/models/common.model';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RoleDirective } from '../../../directives/role.directive';
import { NgStyle } from '@angular/common';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'app-exercises',
    templateUrl: './exercises.component.html',
    styleUrls: ['./exercises.component.scss'],
    imports: [MatFormFieldModule, MatSelectModule, FormsModule, MatOptionModule, RoleDirective, MatButtonModule, MatIconModule, NgStyle, TranslateModule]
})
export class ExercisesComponent implements OnInit {
  @ViewChild('photoModal') photoModal: TemplateRef<any>;
  exercises: IExercise[] = [];
  appConfig = inject(AppConfigService);
  proxyUrl = this.appConfig.envUrl;
  linkName: string;
  selectedImg: IExercise;
  totalElements: number;
  filters: {
    id?: number,
    typeId?: number,
    skipCount: number,
    takeCount: number
  };
  workOuts: ILookUp[] = [];

  constructor(private apiService: ManagementService, public dialog: MatDialog, private common: CommonService,
    private translate: TranslateService) { }

  ngOnInit(): void {
    this.filters = {
      skipCount: 0,
      takeCount: 20
    };
    this.getExercises();
    this.getWorkouts();
  }

  getWorkouts() {
    this.common.getLookup(LookupType.WorkOutTypes).subscribe({
      next: (res: any) => {
        this.workOuts = res;
      }
    })
  }

  getExercises(onPagination: boolean = false) {
    this.filters.skipCount = onPagination ? this.filters.skipCount : 0,
      this.filters.takeCount = 20,

      this.apiService.getExercises(this.filters).subscribe({
        next: (res) => {
          if (onPagination) {
            this.exercises = [...this.exercises, ...res.data];
          } else {
            this.exercises = res.data;
          }
          this.totalElements = res.totalCount;
          this.preventCall = false;
        }
      })
  }

  pictureZoom(image: IExercise) {
    this.selectedImg = image;
    this.dialog.open(this.photoModal, {
      maxHeight: '95vh',
      maxWidth: '95vw'
    });
  }

  deleteExercise(id: number) {
    this.apiService.deleteExercise(id).subscribe();
  }


  onDeleteImage(exercise: IExercise) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxHeight: '80vh',
      data: { mainTitle: this.translate.instant('management.msgToDeletedImage'), subTitle: exercise.exerciseName },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'yes') {
        this.deleteExercise(exercise.id);
        this.exercises = this.exercises.filter(img => img.id != exercise.id);
      }
    });
  }

  preventCall: boolean;
  @HostListener('window:scroll', [])
  onWindowScroll(event: any) {
    let allPageHeight = document.body.scrollHeight;
    let visiblePageHeight = document.body.clientHeight;
    let maxScroll = allPageHeight - visiblePageHeight;
    let scrollAmount = window.pageYOffset;

    if (allPageHeight > visiblePageHeight && !this.preventCall) {
      if (maxScroll < (scrollAmount + 60) && this.totalElements > this.exercises.length) {
        this.preventCall = true;
        this.loadMore();
      }
    }
  }

  loadMore() {
    this.filters.skipCount = (this.filters.skipCount + 1) * this.filters.takeCount;
    this.getExercises(true);
  }

  openExerciseModal(actionName: string, exercise?: IExercise) {
    let data: dialogExerciseData = {} as dialogExerciseData;
    data.type = actionName;
    data.exercise = exercise;
    let dialogRef = this.dialog.open(ExerciseFormComponent, {
      maxHeight: '80vh',
      maxWidth: '500px',
      data: data,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getExercises();
      }
    });
  }


}

