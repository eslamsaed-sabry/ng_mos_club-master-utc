
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { IBranch } from 'src/app/models/common.model';
import { ChangePaymentBranchData, dialogChangePaymentBranchData } from 'src/app/models/member.model';
import { BrandService } from 'src/app/services/brand.service';
import { CommonService } from 'src/app/services/common.service';
import { MemberService } from 'src/app/services/member.service';

@Component({
    selector: 'app-change-payment-branch',
    imports: [MatDialogTitle, FormsModule, MatDialogContent, MatFormFieldModule, MatSelectModule, MatOptionModule, MatDialogActions, MatButtonModule, TranslateModule],
    templateUrl: './change-payment-branch.component.html',
    styleUrl: './change-payment-branch.component.scss'
})
export class ChangePaymentBranchComponent implements OnInit {
  allBranches: IBranch[] = [];
  dataChanged: ChangePaymentBranchData = {} as ChangePaymentBranchData;

  constructor(public dialogRef: MatDialogRef<ChangePaymentBranchComponent>,
    @Inject(MAT_DIALOG_DATA) public data: dialogChangePaymentBranchData, private memberService: MemberService,
    private brandService: BrandService, private common: CommonService) { }

  ngOnInit(): void {
    this.dataChanged = this.data;
    this.getAllBranches();
  }

  getAllBranches() {
    this.allBranches = this.brandService.branches;
  }


  dismiss(status: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: status, data: data });
  }

  submit() {
    this.common.changePaymentBranche(this.dataChanged).subscribe({
      next: (res) => {
        this.dismiss('success');
      }
    })
  }
}
