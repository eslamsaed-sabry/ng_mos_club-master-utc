import { Component, Inject, OnInit } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { IRole } from 'src/app/models/common.model';
import { dialogRoleData } from 'src/app/models/member.model';
import { AdministrationService } from 'src/app/services/administration.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'app-role-form',
    templateUrl: './role-form.component.html',
    styleUrls: ['./role-form.component.scss'],
    imports: [MatDialogTitle, FormsModule, MatDialogContent, MatFormFieldModule, MatInputModule, MatDialogActions, MatButtonModule, TranslateModule]
})
export class RoleFormComponent implements OnInit {
  role: IRole = {} as IRole;

  constructor(public dialogRef: MatDialogRef<RoleFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: dialogRoleData, private adminService: AdministrationService) { }

  ngOnInit(): void {
    if (this.data.type === 'edit') {
      this.role = this.data.role
    }
  }


  dismiss(status: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: status, data: data });
  }

  submit(f: NgForm) {
    if (f.form.status === 'VALID') {
      if (this.data.type === 'add') {
        this.adminService.addRole(this.role).subscribe({
          next: (res) => {
            this.dismiss('success')
          }
        })
      } else {
        this.adminService.editRole(this.role).subscribe({
          next: (res) => {
            this.dismiss('success')
          }
        })
      }
    }
  }

}
