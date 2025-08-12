import { Component, Inject, OnInit } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { dialogShiftData, Shift } from 'src/app/models/staff.model';
import { StaffService } from 'src/app/services/staff.service';
import moment from 'moment';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'app-shift-form',
    templateUrl: './shift-form.component.html',
    styleUrls: ['./shift-form.component.scss'],
    imports: [MatDialogTitle, FormsModule, MatDialogContent, MatFormFieldModule, MatInputModule, MatExpansionModule, NgxMaterialTimepickerModule, MatCheckboxModule, MatDialogActions, MatButtonModule, TranslateModule]
})
export class ShiftFormComponent implements OnInit {
  shift: Shift = new Shift();

  constructor(public dialogRef: MatDialogRef<ShiftFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: dialogShiftData, private staffService: StaffService) { }


  ngOnInit(): void {
    if (this.data.type === 'edit') {
      this.shift = this.data.shift;
    }
    this.convertTime();
  }

  dismiss(status: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: status, data: data });
  }


  submit(form: NgForm) {
    if (form.form.status === 'VALID') {
      this.convertTime();
      if (this.data.type === 'edit') {
        this.staffService.editShift(this.shift).subscribe({
          next: () => {
            this.dismiss('success');
          }
        })
      } else {
        this.staffService.addShift(this.shift).subscribe({
          next: () => {
            this.dismiss('success');
          }
        })
      }
    }
  }

  convertTime() {
    this.shift.sat_CheckInTime = moment(this.shift.sat_CheckInTime, ["h:mm A"]).format("HH:mm");
    this.shift.sat_CheckOutTime = moment(this.shift.sat_CheckOutTime, ["h:mm A"]).format("HH:mm");
    this.shift.sun_CheckInTime = moment(this.shift.sun_CheckInTime, ["h:mm A"]).format("HH:mm");
    this.shift.sun_CheckOutTime = moment(this.shift.sun_CheckOutTime, ["h:mm A"]).format("HH:mm");
    this.shift.mon_CheckInTime = moment(this.shift.mon_CheckInTime, ["h:mm A"]).format("HH:mm");
    this.shift.mon_CheckOutTime = moment(this.shift.mon_CheckOutTime, ["h:mm A"]).format("HH:mm");
    this.shift.tus_CheckInTime = moment(this.shift.tus_CheckInTime, ["h:mm A"]).format("HH:mm");
    this.shift.tus_CheckOutTime = moment(this.shift.tus_CheckOutTime, ["h:mm A"]).format("HH:mm");
    this.shift.wed_CheckInTime = moment(this.shift.wed_CheckInTime, ["h:mm A"]).format("HH:mm");
    this.shift.wed_CheckOutTime = moment(this.shift.wed_CheckOutTime, ["h:mm A"]).format("HH:mm");
    this.shift.thu_CheckInTime = moment(this.shift.thu_CheckInTime, ["h:mm A"]).format("HH:mm");
    this.shift.thu_CheckOutTime = moment(this.shift.thu_CheckOutTime, ["h:mm A"]).format("HH:mm");
    this.shift.fri_CheckInTime = moment(this.shift.fri_CheckInTime, ["h:mm A"]).format("HH:mm");
    this.shift.fri_CheckOutTime = moment(this.shift.fri_CheckOutTime, ["h:mm A"]).format("HH:mm");
  }

}
