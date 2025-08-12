import { Component, Inject, OnInit, inject } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { IBranch } from 'src/app/models/common.model';
import { dialogClassRoomData } from 'src/app/models/staff.model';
import { AppConfigService } from 'src/app/services/app-config.service';
import { CommonService } from 'src/app/services/common.service';
import { BrandService } from 'src/app/services/brand.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';

import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { IClassRoom } from 'src/app/models/schedule.model';

@Component({
    selector: 'app-class-rooms-form',
    templateUrl: './class-rooms-form.component.html',
    styleUrl: './class-rooms-form.component.scss',
    imports: [MatDialogTitle, FormsModule, MatDialogContent, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatCheckboxModule, MatDialogActions, MatButtonModule, TranslateModule]
})
export class ClassRoomsFormComponent implements OnInit {
  appConfig = inject(AppConfigService);
  proxyUrl = this.appConfig.envUrl;
  classRoom: IClassRoom = {} as IClassRoom;
  branches: IBranch[] = [];

  constructor(public dialogRef: MatDialogRef<ClassRoomsFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: dialogClassRoomData,
    private common: CommonService, private brandService: BrandService) { }


  ngOnInit(): void {
    if (this.data.type === 'edit') {
      this.classRoom = this.data.classRoom;
    }
    this.getBranches();
  }

  getBranches() {
    this.branches = this.brandService.branches;
  }

  dismiss(status: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: status, data: data });
  }

  submit(form: NgForm) {

    if (form.form.status === 'VALID') {
      if (this.data.type === 'add') {
        this.classRoom.arabicName = this.classRoom.englishName;
        console.log(this.classRoom);

        this.common.addClassRoom(this.classRoom).subscribe({
          next: (res) => {
            this.dismiss('success')
          }
        });
      } else {
        this.common.editClassRoom(this.classRoom).subscribe({
          next: (res) => {
            this.dismiss('success')
          }
        });
      }
    }
  }

}
