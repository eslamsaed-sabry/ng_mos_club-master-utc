import { Component, OnInit, inject } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ILookUp } from 'src/app/models/common.model';
import { LookupType } from 'src/app/models/enums';
import { dialogLookupData } from 'src/app/models/staff.model';
import { CommonService } from 'src/app/services/common.service';
import { StaffService } from 'src/app/services/staff.service';
import { AppConfigService } from 'src/app/services/app-config.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { ColorPickerDirective, ColorPickerService } from 'ngx-color-picker';
import { AsyncPipe } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
@Component({
  selector: 'app-data-list-form',
  templateUrl: './data-list-form.component.html',
  styleUrls: ['./data-list-form.component.scss'],
  imports: [MatDialogTitle, FormsModule, MatDialogContent, MatFormFieldModule, MatInputModule, AsyncPipe,
    ColorPickerDirective, MatButtonModule, MatCheckboxModule, MatDialogActions, TranslateModule, MatSelectModule],
  providers: [ColorPickerService]
})
export class DataListFormComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<DataListFormComponent>);
  readonly data = inject<dialogLookupData>(MAT_DIALOG_DATA);
  private staffService = inject(StaffService);
  private common = inject(CommonService);
  private toastr = inject(ToastrService);

  lookup: ILookUp;
  lookups = LookupType;
  appConfig = inject(AppConfigService);
  proxyUrl = this.appConfig.envUrl;
  classProgram$ = this.common.getLookup(this.lookups.ClassPrograms)
  classGenre$ = this.common.getLookup(LookupType.ClassGenres);

  ngOnInit(): void {
    this.lookup = this.data.lookup;
    if (this.data.type === 'add') {
      this.lookup.isActive = true;
    }
  }

  dismiss(status: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: status, data: data });
  }

  submit(form: NgForm) {

    if (form.form.status === 'VALID') {
      if (this.lookup.colorHex)
        this.lookup.colorHex = this.common.rgbaToHex(this.lookup.colorHex);
      if (this.data.type === 'add') {
        this.staffService.addLookup(this.data.lookupTypeId, this.lookup, this.data.lookupName).subscribe({
          next: (res) => {
            this.dismiss('success')
          }
        });
      } else {
        this.staffService.editLookup(this.data.lookupTypeId, this.lookup, this.data.lookupName).subscribe({
          next: (res) => {
            this.dismiss('success')
          }
        });
      }
    }
  }

  upload(e: any) {
    let elem = e.target || e.srcElement;
    if (elem.files.length > 0) {
      let file = elem.files[0];
      if (
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.type === 'image/jpg'
      ) {
        if (file.size < 1000000) {
          const uploadData = new FormData();
          uploadData.append('Files', file);
          this.common
            .uploadImages(uploadData)
            .subscribe({
              next: (res: any) => {
                this.lookup.imagePath = res.data[0];
              },
              error: (error) => {
                e.target.value = null;
              },
            });
        } else {
          e.target.value = null;
          this.toastr.error(
            'Image size is too big',
            'Sorry! image size exceeds 1mb'
          );
        }
      }
    }
  }

  showColorPicker() {
    const _allowed = [this.lookups.ClassPrograms, this.lookups.ReservationTypes, this.lookups.ClassesTypes];
    const _isIncluded = _allowed.includes(this.data.lookupTypeId);
    if (_isIncluded) {
      this.data.lookup.colorHex = this.data.lookup.colorHex ?? '#b5bebb';
    }
    return _isIncluded;
  }

}
