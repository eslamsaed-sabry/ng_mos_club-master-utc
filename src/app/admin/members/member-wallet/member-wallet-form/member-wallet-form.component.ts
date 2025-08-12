
import { Component, DestroyRef, Inject, inject, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RoleAttrDirective } from 'src/app/directives/role-attr.directive';
import { RoleDirective } from 'src/app/directives/role.directive';
import { dialogMemberData } from 'src/app/models/member.model';
import { MemberService } from 'src/app/services/member.service';

@Component({
  selector: 'app-member-wallet-form',
  templateUrl: './member-wallet-form.component.html',
  styleUrl: './member-wallet-form.component.scss',
  imports: [MatDialogTitle, FormsModule, MatDialogContent, MatFormFieldModule, MatInputModule, MatDialogActions, MatButtonModule, TranslateModule, MatIconModule]
})

export class MemberWalletFormComponent implements OnInit {
  private memberService = inject(MemberService);


  amount: number;

  constructor(public dialogRef: MatDialogRef<MemberWalletFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: dialogMemberData) { }

  ngOnInit(): void {

  }

  dismiss(status: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: status, data: data });
  }

  submit(f: NgForm) {
    if (f.form.status === 'VALID') {
      if (this.data.type === 'Deposit')
        this.DepositIntoWallet();
      else if (this.data.type === 'Withdraw')
        this.WithdrawFromWallet();
    }
  }


  DepositIntoWallet() {
    let obj = {
      memberId: this.data.memberData.id,
      amount: this.amount,
    }
    this.memberService.DepositIntoWallet(obj).subscribe({
      next: (res) => {
        this.dismiss('success', obj)
      }
    })
  }

  WithdrawFromWallet() {
    let obj = {
      memberId: this.data.memberData.id,
      amount: this.amount,
    }

    this.memberService.WithdrawFromWallet(obj).subscribe({
      next: (res) => {
        this.dismiss('success')
      }
    })
  }


}