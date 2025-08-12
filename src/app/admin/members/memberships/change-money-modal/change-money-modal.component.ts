import { Component, OnInit, Inject } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { LookupType } from 'src/app/models/enums';
import { ChangeMoney, dialogMembershipData } from 'src/app/models/member.model';
import { MemberService } from 'src/app/services/member.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';

import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'app-change-money-modal',
    templateUrl: './change-money-modal.component.html',
    styleUrls: ['./change-money-modal.component.scss'],
    imports: [MatDialogTitle, FormsModule, MatDialogContent, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatDialogActions, MatButtonModule, TranslateModule]
})
export class ChangeMoneyModalComponent implements OnInit {
  changeMoneyForm: ChangeMoney = {} as ChangeMoney;
  visaTypes: any[] = [];
  remainingMoney: number;
  constructor(public dialogRef: MatDialogRef<ChangeMoneyModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: dialogMembershipData, private memberService: MemberService) { }

  ngOnInit(): void {
    if (!this.changeMoneyForm.cashAmountPaid) {
      this.changeMoneyForm.cashAmountPaid = 0;
      this.changeMoneyForm.visaAmountPaid = 0;
    }
    this.getVisaTypes();
    this.calc();
  }

  dismiss(status: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: status, data: data });
  }

  getVisaTypes() {
    this.memberService.getLookup(LookupType.VisaTypes).subscribe({
      next: (res: any) => {
        this.visaTypes = res;
      }
    })
  }

  calc() {
    if (this.changeMoneyForm.price) {
      this.remainingMoney = this.changeMoneyForm.price - (this.changeMoneyForm.cashAmountPaid + this.changeMoneyForm.visaAmountPaid);
    }
  }


  submit(f: NgForm) {
    this.changeMoneyForm.membershipId = this.data.membership.id;
    if (f.form.status === 'VALID') {
      this.memberService.changeMoney(this.changeMoneyForm).subscribe({
        next: (res) => {
          this.dismiss('success');
        }
      })
    }
  }
}
