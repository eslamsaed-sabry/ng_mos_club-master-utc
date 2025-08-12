import { Component, DestroyRef, Inject, OnInit, inject } from '@angular/core';
import { IFinancial, dialogFinancialData } from 'src/app/models/accounts.model';
import { IAuthorizedUser } from 'src/app/models/user.model';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { AccountsService } from 'src/app/services/accounts.service';
import { CommonService } from 'src/app/services/common.service';
import { Accounts, LookupType } from 'src/app/models/enums';
import { NgForm, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';

import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MemberService } from 'src/app/services/member.service';
import { MatRadioModule } from '@angular/material/radio';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-salaries-form',
    templateUrl: './salaries-form.component.html',
    styleUrls: ['./salaries-form.component.scss'],
    imports: [MatDialogTitle, FormsModule, MatDialogContent, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatSelectModule, MatOptionModule, MatDialogActions, MatButtonModule, TranslateModule, MatRadioModule],
    providers: [AccountsService]
})
export class SalariesFormComponent implements OnInit {
  salaries: IFinancial = {} as IFinancial;
  user: IAuthorizedUser = JSON.parse(localStorage.getItem('mosUser')!);
  staffMembers: any[] = [];
  visaTypes: any[] = [];

  public dialogRef = inject(MatDialogRef<SalariesFormComponent>);
  private commonService = inject(CommonService);
  private accountService = inject(AccountsService);
  private memberService = inject(MemberService);
  private destroyRef = inject(DestroyRef);

  constructor(@Inject(MAT_DIALOG_DATA) public data: dialogFinancialData) { }


  ngOnInit(): void {
    this.getStaffMembers();
    this.getVisaTypes();

    if (this.data.type === 'edit') {
      this.salaries = this.data.financial;
    }
    else {
      this.salaries.isCash = true;
    }
    if (!this.salaries.actionDate) {
      this.salaries.actionDate = new Date();
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
      this.salaries.userId = this.user.id;
      this.salaries.typeId = Accounts.SALARIES;
      if (this.data.type === 'add') {
        this.accountService.addFinancial(this.salaries).subscribe({
          next: () => {
            this.dismiss('success');
          }
        })
      } else {
        this.accountService.editFinancial(this.salaries).subscribe({
          next: () => {
            this.dismiss('success');
          }
        })
      }
    }
  }

}

