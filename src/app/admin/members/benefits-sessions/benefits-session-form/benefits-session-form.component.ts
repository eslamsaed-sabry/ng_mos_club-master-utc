import { Component, Inject, OnInit } from '@angular/core';

import { dialogMemberBenefitsSessionData, BenefitSession } from 'src/app/models/member.model';
import { MemberService } from 'src/app/services/member.service';
import moment from 'moment';
import { NgForm, FormsModule } from '@angular/forms';
import { IAuthorizedUser } from 'src/app/models/user.model';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { LookupType, StaffTypes } from 'src/app/models/enums';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { IBenefitSession } from 'src/app/models/common.model';

@Component({
  selector: 'app-benefits-session-form',
  templateUrl: './benefits-session-form.component.html',
  styleUrls: ['./benefits-session-form.component.scss'],
  imports: [MatDialogTitle, FormsModule, MatDialogContent, MatFormFieldModule, MatInputModule, MatDatepickerModule, NgxMaterialTimepickerModule, MatSelectModule, MatOptionModule, MatDialogActions, MatButtonModule, TranslateModule]
})
export class BenefitsSessionFormComponent implements OnInit {
  session: BenefitSession = {} as BenefitSession;
  sales: any[] = [];
  trainers: any[] = [];
  doctors: any[] = [];
  sessionTypes: any[] = [];
  staff: any[] = [];
  time: any;
  user: IAuthorizedUser = JSON.parse(localStorage.getItem('mosUser') || '');
  paymentMethodErr: boolean;
  disablePhone: boolean;
  disableName: boolean;
  today = new Date();
  staffTypes = StaffTypes;
  constructor(public dialogRef: MatDialogRef<BenefitsSessionFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: dialogMemberBenefitsSessionData, private memberService: MemberService) { }

  ngOnInit(): void {
    if (this.data.type === 'editSession') {
      this.session = this.data.session;
      this.time = moment(this.session.sessionDate).format('h:mm A')
    }

    if (!this.session.sessionDate) {
      this.session.sessionDate = new Date();
      this.time = moment(new Date()).format('h:mm A')
    }

    switch (this.data.benefit.staffType) {
      case StaffTypes.AllStaff:
        this.getStaff();
        break;
      case StaffTypes.Trainer:
        if (this.data.type === 'editSession')
          this.session.staffMemberId = this.data.session.trainerId;
        this.getTrainers();
        break;
      case StaffTypes.SalesPerson:
        if (this.data.type === 'editSession')
          this.session.staffMemberId = this.data.session.salesPersonId;
        this.getSales();
        break;
      case StaffTypes.Doctor:
        if (this.data.type === 'editSession')
          this.session.staffMemberId = this.data.session.staffMemberId;
        this.getDoctors();
        break;

      default:
        break;
    }
  }

  getDoctors() {
    this.memberService.getLookup(LookupType.Doctors).subscribe({
      next: (res: any) => {
        this.doctors = res;
      }
    })
  }

  getSales() {
    this.memberService.getLookup(LookupType.Sales).subscribe({
      next: (res: any) => {
        this.sales = res;
      }
    })
  }
  getTrainers() {
    this.memberService.getLookup(LookupType.Trainers).subscribe({
      next: (res: any) => {
        this.trainers = res;
      }
    })
  }
  getStaff() {
    this.memberService.getLookup(LookupType.Staff).subscribe({
      next: (res: any) => {
        this.staff = res;
      }
    })
  }

  dismiss(action: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: action, data: data });
  }

  getTime(e: string) {
    let date = moment(this.session.sessionDate).format('DD/MM/YYYY');
    this.time = moment(e, ["h:mm A"]).format('HH:mm');
    let dateTime: any = moment(date + ' ' + this.time, 'DD/MM/YYYY HH:mm').format();
    this.session.sessionDate = dateTime;
  }

  addSession(f: NgForm) {
    if (f.form.status === 'VALID') {
      let obj: IBenefitSession = {
        attendanceDate: this.session.sessionDate,
        membershipId: this.data.membershipId,
        benfitId: this.data.benefit.id,
        staffMemberId: this.session.staffMemberId
      }

      this.memberService.addBenefitSession(obj).subscribe({
        next: (res) => {
          this.dismiss('success');
        }
      })
    }
  }

  editSession(f: NgForm) {
    if (f.form.status === 'VALID') {
      let obj = {
        attendanceDate: this.session.sessionDate,
        membershipId: this.data.membershipId,
        id: this.session.id,
        staffMemberId: this.session.staffMemberId
      }
      this.memberService.editBenefitSession(obj).subscribe({
        next: (res) => {
          this.dismiss('success')
        }
      })
    }
  }


}
