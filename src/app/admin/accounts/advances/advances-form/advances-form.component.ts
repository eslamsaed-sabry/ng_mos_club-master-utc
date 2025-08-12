import { Component, Inject, OnInit } from '@angular/core';
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


@Component({
    selector: 'app-advances-form',
    templateUrl: './advances-form.component.html',
    styleUrls: ['./advances-form.component.scss'],
    imports: [MatDialogTitle, FormsModule, MatDialogContent, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatSelectModule, MatOptionModule, MatDialogActions, MatButtonModule, TranslateModule],
    providers: [AccountsService]
})
export class AdvancesFormComponent implements OnInit {
  advances: IFinancial = {} as IFinancial;
  user: IAuthorizedUser = JSON.parse(localStorage.getItem('mosUser')!);
  staffMembers: any[] = [];
  branchName: string;

  constructor(public dialogRef: MatDialogRef<AdvancesFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: dialogFinancialData, private accountService: AccountsService,
    private commonService: CommonService, private brandService: BrandService) { }


  ngOnInit(): void {
    this.getStaffMembers();
    if (this.data.type === 'edit') {
      this.advances = this.data.financial;
    }
    else
      this.getBranch();

    if (!this.advances.actionDate) {
      this.advances.actionDate = new Date();
    }
  }

  getStaffMembers() {
    this.commonService.getLookup(LookupType.Staff).subscribe({
      next: (res: any) => {
        this.staffMembers = res;
      }
    })
  }



  dismiss(status: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: status, data: data });
  }


  submit(form: NgForm) {
    if (form.form.status === 'VALID') {
      this.advances.userId = this.user.id;
      this.advances.typeId = Accounts.ADVANCES;
      if (this.data.type === 'add') {
        this.advances.branchId = this.brandService.currentBranch.id;
        this.accountService.addFinancial(this.advances).subscribe({
          next: () => {
            this.dismiss('success');
          }
        })
      } else {
        this.accountService.editFinancial(this.advances).subscribe({
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
