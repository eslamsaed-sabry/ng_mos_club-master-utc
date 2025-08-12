import { Component, Inject, OnInit } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { IBranch, IRole } from 'src/app/models/common.model';
import { LookupType } from 'src/app/models/enums';
import { dialogUserData } from 'src/app/models/member.model';
import { IUser } from 'src/app/models/user.model';
import { AdministrationService } from 'src/app/services/administration.service';
import { MemberService } from 'src/app/services/member.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';

import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonService } from 'src/app/services/common.service';

@Component({
    selector: 'app-user-form',
    templateUrl: './user-form.component.html',
    styleUrls: ['./user-form.component.scss'],
    imports: [MatDialogTitle, FormsModule, MatDialogContent, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatDialogActions, MatButtonModule, TranslateModule]
})
export class UserFormComponent implements OnInit {
  user: IUser = {} as IUser;
  roles: IRole[] = [];
  pwType: string = 'password';
  branches: any[] = [];
  constructor(public dialogRef: MatDialogRef<UserFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: dialogUserData, private adminService: AdministrationService,
    private memberService: MemberService, private common: CommonService) { }

  ngOnInit(): void {
    this.getRoles();
    if (this.data.type === 'edit') {
      this.getPackageBranches();
      this.user.id = this.data.user.id
      this.user.nameAR = this.data.user.arabicName
      this.user.nameEng = this.data.user.englishName
      this.user.roleId = this.data.user.roleId;
      this.user.userName = this.data.user.userName;
    }
  }

  getRoles() {
    this.adminService.getRoles().subscribe({
      next: (res) => {
        this.roles = res.data;
      }
    })
  }

  toggleType() {
    if (this.pwType === 'password') {
      this.pwType = 'text';
    } else {
      this.pwType = 'password'
    }
  }

  dismiss(status: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: status, data: data });
  }

  submit(f: NgForm) {
    this.user.password = '';
    if (f.form.status === 'VALID') {
      this.user.branchesIds = this.user.branchesIds.filter(b => b != 0);

      if (this.data.type === 'add') {
        this.adminService.addUser(this.user).subscribe({
          next: (res) => {
            this.dismiss('success')
          }
        })
      } else {
        this.adminService.editUser(this.user).subscribe({
          next: (res) => {
            this.dismiss('success')
          }
        })
      }
    }
  }

  getPackageBranches() {
    let currentBranches: number[] = [];

    forkJoin([
      this.adminService.getUserBranchesId(this.data.user.id),
      this.common.getCurrentUserBranches()
    ]).subscribe({
      next: ([packageBranches, allBranches]) => {
        let branches: any = allBranches.data;
        branches.forEach((c: IBranch) => {
          packageBranches.data.forEach((n: number) => {
            if (c.id === n) {
              currentBranches.push(c.id);
            }
          })
        });

        this.branches = branches;
        this.user.branchesIds = currentBranches;
      }
    })
  }

  onSelect() {

    if (this.user.branchesIds.includes(0)) {
      this.user.branchesIds = [0, ...this.branches.map(el => el.id)];
    } else {
      this.user.branchesIds = [];
    }
  }
}
