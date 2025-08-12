import { Component, Inject, OnInit } from '@angular/core';
import { dialogMemberAttendanceData } from 'src/app/models/member.model';
import { MemberService } from 'src/app/services/member.service';
import moment from 'moment';
import { IAuthorizedUser } from 'src/app/models/user.model';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { LookupType } from 'src/app/models/enums';
import { NgForm, FormsModule } from '@angular/forms';
import { DateType, StandardDatePipe } from 'src/app/pipes/standard-date.pipe';
import { BrandService } from 'src/app/services/brand.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';


@Component({
    selector: 'app-add-attendance',
    templateUrl: './add-attendance.component.html',
    styleUrls: ['./add-attendance.component.scss'],
    imports: [MatDialogTitle, FormsModule, MatDialogContent, MatFormFieldModule, MatSelectModule, MatOptionModule, MatInputModule, MatDatepickerModule, NgxMaterialTimepickerModule, MatDialogActions, MatButtonModule, TranslateModule]
})
export class AddAttendanceComponent implements OnInit {
  attDate: any;
  time: any;
  user: IAuthorizedUser = JSON.parse(localStorage.getItem('mosUser') || '');
  currentTime = moment(new Date(), ["h:mm A"]).format('HH:mm');
  coaches: any[] = [];
  rates: any[] = [];
  selectedRate: number;
  selectedCoach: number;
  branchName: string;
  constructor(public dialogRef: MatDialogRef<AddAttendanceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: dialogMemberAttendanceData, private memberService: MemberService,
    private standardDate: StandardDatePipe, private brandService: BrandService) { }

  ngOnInit(): void {
    if (this.data.membership.packageCategory > 1) {
      this.selectedCoach = this.data.membership.coachId
      this.getCoaches();
      this.getRates();
    }
    this.getBranch();

  }

  getBranch() {
    this.branchName = this.brandService.currentBranch.name;
  }

  getRates() {
    this.memberService.getRates(this.selectedCoach).subscribe(
      (res: any) => {
        this.rates = res.data
      });
  }

  getCoaches() {
    this.memberService.getLookup(LookupType.Trainers).subscribe(
      (res: any) => {
        this.coaches = res
      });
  }

  dismiss(action: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: action, data: data });
  }

  addAttendance(form: NgForm) {
    if (form.form.status === 'VALID') {
      this.attDate = this.standardDate.transform(this.attDate, DateType.TO_UTC);
      if (!this.time) {
        this.getTime(this.currentTime);
      }
      let props = {
        attendanceDate: this.attDate,
        membershipId: this.data.membership.id,
        userID: this.user.id,
        forceAdd: true,
        trainerId: this.selectedCoach,
        rateId: this.selectedRate,
        branchId: this.brandService.currentBranch.id,
      }



      this.memberService.addAttendance(props).subscribe({
        next: (res) => {
          if (res.statusCode === 200) {
            this.dismiss('success')
          }
        }
      })
    }
  }

  getTime(e: string) {
    let date = moment(this.attDate).format('DD/MM/YYYY');
    this.time = moment(e, ["h:mm A"]).format('HH:mm');
    let dateTime: any = moment(date + ' ' + this.time, 'DD/MM/YYYY HH:mm').format();
    this.attDate = dateTime;
  }

}
