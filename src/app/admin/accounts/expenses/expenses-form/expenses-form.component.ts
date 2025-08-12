import { Component, DestroyRef, Inject, OnInit, inject } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import moment from 'moment';
import { dialogExpensesData, IExpense, IExpenses } from 'src/app/models/accounts.model';
import { LookupType } from 'src/app/models/enums';
import { IAuthorizedUser } from 'src/app/models/user.model';
import { AccountsService } from 'src/app/services/accounts.service';
import { BrandService } from 'src/app/services/brand.service';
import { CommonService } from 'src/app/services/common.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MemberService } from 'src/app/services/member.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-expenses-form',
    templateUrl: './expenses-form.component.html',
    styleUrls: ['./expenses-form.component.scss'],
    imports: [MatDialogTitle, FormsModule, MatDialogContent, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatDialogActions, MatButtonModule, TranslateModule],
    providers: [AccountsService]
})
export class ExpensesFormComponent implements OnInit {
  expenses: IExpenses = {} as IExpenses;
  user: IAuthorizedUser = JSON.parse(localStorage.getItem('mosUser')!);
  expensesTypes: IExpense[] = [];
  isCashed: boolean = true;
  branchName: string;
  visaTypes: any[] = [];

  public dialogRef = inject(MatDialogRef<ExpensesFormComponent>);
  private accountService = inject(AccountsService);
  private common = inject(CommonService);
  private brandService = inject(BrandService);
  private memberService = inject(MemberService);
  private destroyRef = inject(DestroyRef);

  constructor(@Inject(MAT_DIALOG_DATA) public data: dialogExpensesData) { }

  ngOnInit(): void {
    this.getExpensesTypes();
    this.getVisaTypes();

    if (this.data.type === 'edit') {
      this.expenses = this.data.revenue;
      this.expenses.actionDate = moment(this.data.revenue.actionDate).format('YYYY-MM-DD') + 'T' + moment(this.data.revenue.actionDate).format('HH:mm');
    }
    else {
      this.getBranch();
    }
    if (!this.expenses.actionDate) {
      this.expenses.actionDate = moment(new Date()).format('YYYY-MM-DD') + 'T' + moment(new Date()).format('HH:mm');
    }
  }

  getExpensesTypes() {
    this.common.getLookup(LookupType.ExpensesTypes).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res: any) => {
        this.expensesTypes = res;
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
      this.expenses.userId = this.user.id;
      if (this.data.type === 'add') {
        this.expenses.branchId = this.brandService.currentBranch.id;

        this.accountService.addExpenses(this.expenses).subscribe({
          next: () => {
            this.dismiss('success');
          }
        })
      } else {
        this.accountService.editExpenses(this.expenses).subscribe({
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
        this.expenses.price = 0;
        this.isCashed = false;
      }
    }
    else {
      if (amount.target.value > 0)
        this.isCashed = false;
      else {
        this.expenses.amountVisa = 0;
        this.isCashed = true;
      }
    }
  }

  getBranch() {
    this.branchName = this.brandService.currentBranch.name;
  }
}
