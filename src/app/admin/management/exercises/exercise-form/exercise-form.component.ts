import { Component, OnInit, Inject, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { NgForm, FormsModule } from '@angular/forms';
import { ManagementService } from 'src/app/services/management.service';
import { dialogExerciseData, IExercise, IWorkOut } from 'src/app/models/management.model';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { LookupType } from 'src/app/models/enums';
import { ILookUp } from 'src/app/models/common.model';
import { AppConfigService } from 'src/app/services/app-config.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';

import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'app-exercise-form',
    templateUrl: './exercise-form.component.html',
    styleUrls: ['./exercise-form.component.scss'],
    imports: [MatDialogTitle, FormsModule, MatDialogContent, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatButtonModule, MatIconModule, MatDialogActions, TranslateModule]
})
export class ExerciseFormComponent implements OnInit {
  exercise: IExercise = {} as IExercise;
  workOuts: ILookUp[] = [];
  appConfig = inject(AppConfigService);
  proxyUrl = this.appConfig.envUrl;

  constructor(public dialogRef: MatDialogRef<ExerciseFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: dialogExerciseData, private apiService: ManagementService,
    private toastr: ToastrService, private common: CommonService) { }

  ngOnInit(): void {
    this.getWorkouts();
    if (this.data.type === 'edit') {
      this.exercise = this.data.exercise!;
    }
  }

  dismiss(status: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: status, data: data });
  }

  getWorkouts() {
    this.common.getLookup(LookupType.WorkOutTypes).subscribe({
      next: (res: any) => {
        this.workOuts = res;
      }
    })
  }


  submit(form: NgForm) {
    if (form.form.status === 'VALID') {
      if (this.data.type === 'add') {
        this.apiService.addExercise(this.exercise).subscribe({
          next: (res) => {
            this.dismiss('success');
          }
        });
      } else {
        this.apiService.editExercise(this.exercise).subscribe({
          next: (res) => {
            this.dismiss('success');
          }
        });
      }
    }
  }

  uploadImage(e: any) {
    let elem = e.target || e.srcElement;
    if (elem.files.length > 0) {
      let file = elem.files[0];
      if (
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.type === 'image/jpg'
      ) {
        // File types supported for image
        if (file.size < 1000000) {
          const uploadData = new FormData();
          uploadData.append('Files', file);
          this.common.uploadImages(uploadData).subscribe({
            next: (res: any) => {
              this.exercise.imagePath = res.data[0];
            },
            error: (error) => {
              this.toastr.error('Error', error.statusText);
              e.target.value = null;
            },
          });
        } else {
          e.target.value = null;
          this.toastr.error('Image size is too big', 'Sorry! image size exceeds 1mb');
        }
      }
    }
  }

}
