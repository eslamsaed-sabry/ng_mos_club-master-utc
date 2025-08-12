import { Component, OnInit, Inject } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { dialogMemberFreezeData } from 'src/app/models/member.model';
import { PermissionsPipe } from 'src/app/pipes/permissions.pipe';
import { BrandService } from 'src/app/services/brand.service';
import { MemberService } from 'src/app/services/member.service';
import { TranslateModule } from '@ngx-translate/core';
import { PermissionsPipe as PermissionsPipe_1 } from '../../../../pipes/permissions.pipe';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';


@Component({
    selector: 'app-freeze-form',
    templateUrl: './freeze-form.component.html',
    styleUrls: ['./freeze-form.component.scss'],
    providers: [PermissionsPipe],
    imports: [MatDialogTitle, FormsModule, MatDialogContent, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatDialogActions, MatButtonModule, PermissionsPipe_1, TranslateModule]
})
export class FreezeFormComponent implements OnInit {
  atDate: Date = new Date();
  noDays: number;
  amount: number = 0;
  paymentDate: Date = new Date();
  comment: string;
  action: string;
  today = new Date();
  branchName: string;
  setMin: boolean = this.permissionPipe.transform('hasNo', 'membershipsBasic', 'RetroactiveFreeze');
  constructor(public dialogRef: MatDialogRef<FreezeFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: dialogMemberFreezeData, private memberService: MemberService,
    private permissionPipe: PermissionsPipe, private brandService: BrandService) { }

  ngOnInit(): void {
    this.action = this.data.type === 'addFreeze' || this.data.type === 'freeze' ? 'Freeze' : 'Unfreeze';
    this.getBranch();

  }

  dismiss(status: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: status, data: data });
  }

  getBranch() {
    this.branchName = this.brandService.currentBranch.name;
  }

  toggleFreeze(f: NgForm) {
    if (f.form.status === 'VALID') {
      // Freeze / Unfreeze
      let props = this.action === 'Unfreeze' ? {
        "membershipId": this.data.membership.id,
        "atDate": this.atDate
      } : {
        "membershipId": this.data.membership.id,
        "noDays": this.noDays,
        "atDate": this.atDate,
        "amount": this.amount,
        "paymentDate": this.paymentDate,
        "comment": this.comment,
        "branchId": this.brandService.currentBranch.id,
        "isMedical": this.data.freeze.isMedical,
      }
      this.memberService.freezeOrUn(props, this.action).subscribe({
        next: (res) => {
          this.dismiss('success', this.data.membership)
        }
      })
    }
  }

}
