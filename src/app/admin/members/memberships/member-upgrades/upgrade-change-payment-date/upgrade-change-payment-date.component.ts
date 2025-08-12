import { UpgradeData } from './../../../../../models/member.model';
import { Component, Inject, OnInit } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import moment from 'moment';
import { IMembershipUpgrade, dialogUpgradeData } from 'src/app/models/member.model';
import { DateType, StandardDatePipe } from 'src/app/pipes/standard-date.pipe';
import { MemberService } from 'src/app/services/member.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'app-upgrade-change-payment-date',
    templateUrl: './upgrade-change-payment-date.component.html',
    styleUrl: './upgrade-change-payment-date.component.scss',
    imports: [MatDialogTitle, FormsModule, MatDialogContent, MatFormFieldModule, MatInputModule, MatDialogActions, MatButtonModule, TranslateModule]
})
export class UpgradeChangePaymentDateComponent implements OnInit {
  membershipUpgrade: IMembershipUpgrade = {} as IMembershipUpgrade;
  visaTypes: any[] = [];
  reasons: any[] = [];
  constructor(public dialogRef: MatDialogRef<UpgradeChangePaymentDateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: dialogUpgradeData, private memberService: MemberService,
    private standardDate: StandardDatePipe) { }

  ngOnInit(): void {
    this.membershipUpgrade = this.data.upgrade;

    if (!this.membershipUpgrade.paymentDate) {
      this.membershipUpgrade.paymentDate = this.standardDate.transform(new Date(), DateType.DATE_TIME_INPUT);
    } else {
      this.membershipUpgrade.paymentDate = this.standardDate.transform(this.membershipUpgrade.paymentDate, DateType.DATE_TIME_INPUT);
    }
  }

  dismiss(status: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: status, data: data });
  }

  submit(f: NgForm) {

    if (f.form.status === 'VALID') {
      let data: UpgradeData = {} as UpgradeData;
      data.upgradeId = this.membershipUpgrade.id;
      data.paymentDate = this.membershipUpgrade.paymentDate;
      this.memberService.membershipUpgradeChangePaymentDate(data).subscribe({
        next: (res) => {
          this.dismiss('success');
        }
      })
    }
  }
}
