import { Component, DestroyRef, Inject, OnInit, inject } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import moment from 'moment';
import { dialogRevenueData, IOtherRevenue } from 'src/app/models/accounts.model';
import { IAuthorizedUser } from 'src/app/models/user.model';
import { StandardDatePipe } from 'src/app/pipes/standard-date.pipe';
import { AccountsService } from 'src/app/services/accounts.service';
import { BrandService } from 'src/app/services/brand.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { LookupType } from 'src/app/models/enums';
import { MemberService } from 'src/app/services/member.service';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-other-revenue-form',
  templateUrl: './other-revenue-form.component.html',
  styleUrls: ['./other-revenue-form.component.scss'],
  imports: [MatDialogTitle, FormsModule, MatDialogContent, MatFormFieldModule, MatInputModule, MatDialogActions, MatButtonModule, TranslateModule, MatSelectModule, MatOptionModule],
  providers: [AccountsService]
})
export class OtherRevenueFormComponent implements OnInit {
  revenue: IOtherRevenue = {} as IOtherRevenue;
  user: IAuthorizedUser = JSON.parse(localStorage.getItem('mosUser')!);
  isCashed: boolean = true;
  branchName: string;
  visaTypes: any[] = [];
  incomeTypes: any[] = [];

  public dialogRef = inject(MatDialogRef<OtherRevenueFormComponent>);
  private accountService = inject(AccountsService);
  private standardDate = inject(StandardDatePipe);
  private brandService = inject(BrandService);
  private memberService = inject(MemberService);
  private destroyRef = inject(DestroyRef);

  constructor(@Inject(MAT_DIALOG_DATA) public data: dialogRevenueData) { }

  ngOnInit(): void {
    this.getVisaTypes();
    this.getIncomeType();

    if (this.data.type === 'edit') {
      this.revenue = this.data.revenue;
      this.revenue.actionDate = moment(this.data.revenue.actionDate).format('YYYY-MM-DD') + 'T' + moment(this.data.revenue.actionDate).format('HH:mm');
    }
    else {
      this.getBranch();
    }
    if (!this.revenue.actionDate) {
      this.revenue.actionDate = moment(new Date()).format('YYYY-MM-DD') + 'T' + moment(new Date()).format('HH:mm');
    }
  }

  getVisaTypes() {
    this.memberService.getLookup(LookupType.VisaTypes).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res: any) => {
        this.visaTypes = res;
      }
    })
  }

  getIncomeType() {
    this.memberService.getLookup(LookupType.IncomeType).subscribe({
      next: (res: any) => {
        this.incomeTypes = res;
      }
    })
  }

  dismiss(status: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: status, data: data });
  }


  submit(form: NgForm) {
    if (form.form.status === 'VALID') {
      this.revenue.userId = this.user.id;
      if (this.data.type === 'add') {
        this.revenue.branchId = this.brandService.currentBranch.id;

        this.accountService.addRevenue(this.revenue).subscribe({
          next: () => {
            this.dismiss('success');
          }
        })
      } else {
        this.accountService.editRevenue(this.revenue).subscribe({
          next: () => {
            this.dismiss('success');
          }
        })
      }
    }
  }

  onInputAmountPaidCash(type: string, amount: any) {
    if (type === "amountCash") {
      if (amount.target.value > 0)
        this.isCashed = true;
      else {
        this.revenue.price = 0;
        this.isCashed = false;
      }
    }
    else {
      if (amount.target.value > 0)
        this.isCashed = false;
      else {
        this.revenue.amountVisa = 0;
        this.isCashed = true;
      }
    }
  }

  getBranch() {
    this.branchName = this.brandService.currentBranch.name;
  }
}
