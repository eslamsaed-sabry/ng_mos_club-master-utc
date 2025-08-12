import { Component, DestroyRef, Inject, OnInit, inject } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { IFinancial, dialogFinancialData } from 'src/app/models/accounts.model';
import { Accounts, LookupType } from 'src/app/models/enums';
import { IAuthorizedUser } from 'src/app/models/user.model';
import { AccountsService } from 'src/app/services/accounts.service';
import { BrandService } from 'src/app/services/brand.service';
import { CommonService } from 'src/app/services/common.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MatRadioModule } from '@angular/material/radio';
import { MemberService } from 'src/app/services/member.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-deduction-form',
    templateUrl: './deduction-form.component.html',
    styleUrls: ['./deduction-form.component.scss'],
    imports: [MatDialogTitle, FormsModule, MatDialogContent, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatSelectModule, MatOptionModule, MatDialogActions, MatButtonModule, TranslateModule, MatRadioModule],
    providers: [AccountsService]
})
export class DeductionFormComponent implements OnInit {
  deductions: IFinancial = {} as IFinancial;
  user: IAuthorizedUser = JSON.parse(localStorage.getItem('mosUser')!);
  staffMembers: any[] = [];
  branchName: string;
  visaTypes: any[] = [];

  public dialogRef = inject(MatDialogRef<DeductionFormComponent>);
  private commonService = inject(CommonService);
  private accountService = inject(AccountsService);
  private brandService = inject(BrandService);
  private memberService = inject(MemberService);
  private destroyRef = inject(DestroyRef);

  constructor(@Inject(MAT_DIALOG_DATA) public data: dialogFinancialData) { }

  ngOnInit(): void {
    this.getStaffMembers();
    this.getVisaTypes();

    if (this.data.type === 'edit') {
      this.deductions = this.data.financial;
    }
    else {
      this.getBranch();
      this.deductions.isCash = true;
    }

    if (!this.deductions.actionDate) {
      this.deductions.actionDate = new Date();
    }
  }

  getStaffMembers() {
    this.commonService.getLookup(LookupType.Staff).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res: any) => {
        this.staffMembers = res;
      }
    })
  }

  getVisaTypes() {
    this.memberService.getLookup(LookupType.VisaTypes).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res: any) => {
        this.visaTypes = res;
      }
    })
  }

  dismiss(status: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: status, data: data });
  }

  submit(form: NgForm) {
    if (form.form.status === 'VALID') {
      this.deductions.userId = this.user.id;
      this.deductions.typeId = Accounts.DEDUCTIONS;
      if (this.data.type === 'add') {
        this.deductions.branchId = this.brandService.currentBranch.id;
        this.accountService.addFinancial(this.deductions).subscribe({
          next: () => {
            this.dismiss('success');
          }
        })
      } else {
        this.accountService.editFinancial(this.deductions).subscribe({
          next: () => {
            this.dismiss('success');
          }
        })
      }
    }
  }

  getBranch() {
    this.branchName = this.brandService.currentBranch.name;
  }

}
