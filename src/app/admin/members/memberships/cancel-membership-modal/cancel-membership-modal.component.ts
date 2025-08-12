import { Component, OnInit, Inject } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import moment from 'moment';
import { LookupType } from 'src/app/models/enums';
import { CancelMembership, dialogMembershipData } from 'src/app/models/member.model';
import { DateType, StandardDatePipe } from 'src/app/pipes/standard-date.pipe';
import { BrandService } from 'src/app/services/brand.service';
import { MemberService } from 'src/app/services/member.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'app-cancel-membership-modal',
    templateUrl: './cancel-membership-modal.component.html',
    styleUrls: ['./cancel-membership-modal.component.scss'],
    imports: [MatDialogTitle, FormsModule, MatDialogContent, MatFormFieldModule, MatInputModule, MatRadioModule, MatSelectModule, MatOptionModule, MatDialogActions, MatButtonModule, TranslateModule]
})
export class CancelMembershipModalComponent implements OnInit {
  cancelMembershipForm: CancelMembership = {} as CancelMembership;
  visaTypes: any[] = [];
  reasons: any[] = [];
  branchName: string;

  constructor(public dialogRef: MatDialogRef<CancelMembershipModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: dialogMembershipData, private memberService: MemberService,
    private standardDate: StandardDatePipe, private brandService: BrandService) { }

  ngOnInit(): void {

    if (!this.cancelMembershipForm.refundDate) {
      this.cancelMembershipForm.isCash = true;
      this.cancelMembershipForm.refundDate = moment(new Date()).format('YYYY-MM-DD') + 'T' + moment(new Date()).format('HH:mm');
    }
    else {
      this.cancelMembershipForm.refundDate = moment(this.cancelMembershipForm.refundDate).format('YYYY-MM-DD') + 'T' + moment(this.cancelMembershipForm.refundDate).format('HH:mm');
    }

    this.getReasons();
    this.getVisaTypes();
    this.getBranch();
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

  getReasons() {
    this.memberService.getLookup(LookupType.MembershipCancellationReasons).subscribe({
      next: (res: any) => {
        this.reasons = res;
      }
    })
  }

  getBranch() {
    this.branchName = this.brandService.currentBranch.name;
  }

  submit(f: NgForm) {
    this.cancelMembershipForm.membershipId = this.data.membership.id;
    this.cancelMembershipForm.branchId = this.brandService.currentBranch.id;
    if (f.form.status === 'VALID') {
      this.memberService.cancelMembership(this.cancelMembershipForm).subscribe({
        next: (res) => {
          this.dismiss('success');
        }
      })
    }
  }
}
