import { BrandService } from './../../../../services/brand.service';
import { Component, Inject, OnInit } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogActions } from '@angular/material/dialog';
import { forEach } from 'lodash-es';
import { IAllowedBranche, IBranch } from 'src/app/models/common.model';
import { ChangeMembershipBranche, ChangeMoney, dialogMembershipData } from 'src/app/models/member.model';
import { MemberService } from 'src/app/services/member.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';


@Component({
    selector: 'app-change-branches-modal',
    templateUrl: './change-branches-modal.component.html',
    styleUrl: './change-branches-modal.component.scss',
    imports: [MatDialogTitle, FormsModule, MatCheckboxModule, MatDialogActions, MatButtonModule, TranslateModule]
})
export class ChangeBranchesModalComponent implements OnInit {
  allBranches: IBranch[] = [];
  allowedBrancheIds: number[] = [];
  allowedBranches: IAllowedBranche[] = [];
  allowedBranch: IAllowedBranche = {} as IAllowedBranche;
  constructor(public dialogRef: MatDialogRef<ChangeBranchesModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: dialogMembershipData, private memberService: MemberService,
    private brandService: BrandService) { }

  ngOnInit(): void {
    this.getAllBranches();
    this.getAllowedBranchesIds();
  }

  getAllBranches() {
    this.allBranches = this.brandService.branches;
  }

  getAllowedBranchesIds() {
    this.allowedBranches = [];

    this.memberService.getAllowedBranchesIds(this.data.membership.id).subscribe({
      next: (res) => {
        this.allowedBrancheIds = res.data;

        this.allBranches.forEach(branch => {
          let container: IAllowedBranche = {} as IAllowedBranche;
          container.id = branch.id;
          container.name = branch.name;

          if (this.allowedBrancheIds.find(x => x == branch.id))
            container.isAllowed = true;
          else
            container.isAllowed = false;

          this.allowedBranches.push(container);
        });
      }
    })
  }

  dismiss(status: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: status, data: data });
  }

  submit() {
    let data: ChangeMembershipBranche = {} as ChangeMembershipBranche;
    data.membershipId = this.data.membership.id;
    data.branchesIds = this.allowedBranches.filter(b => b.isAllowed == true).map(b => b.id);

    this.memberService.changeMembershipAllowedBranches(data).subscribe({
      next: (res) => {
        this.dismiss('success');
      }
    })
  }
}
