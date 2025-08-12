import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { IAuthorizedUser } from 'src/app/models/user.model';
import { AdministrationService } from 'src/app/services/administration.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-change-user-password',
    templateUrl: './change-user-password.component.html',
    styleUrls: ['./change-user-password.component.scss'],
    imports: [MatDialogTitle, FormsModule, MatDialogContent, MatFormFieldModule, MatInputModule, MatIconModule, MatDialogActions, MatButtonModule, MatDialogClose, TranslateModule]
})
export class ChangeUserPasswordComponent implements OnInit {
  password: string;
  pwType1: string = 'password';
  pwType2: string = 'password';
  currentPassword: string|null;
  constructor(public dialogRef: MatDialogRef<ChangeUserPasswordComponent>, @Inject(MAT_DIALOG_DATA) public data: { showCurrentPW: boolean, user: IAuthorizedUser }, private adminService: AdministrationService) { }


  ngOnInit(): void {
    if (!this.data.showCurrentPW) {
      this.currentPassword = null;
    }
  }

  toggleType(type: number) {
    switch (type) {
      case 1:
        if (this.pwType1 === 'password') {
          this.pwType1 = 'text';
        } else {
          this.pwType1 = 'password'
        }
        break;

      default:
        if (this.pwType2 === 'password') {
          this.pwType2 = 'text';
        } else {
          this.pwType2 = 'password'
        }
        break;
    }

  }

  dismiss(status: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: status, data: data });
  }

  apply() {
    let props = {
      userId: this.data.user.id,
      currentPassword: this.currentPassword,
      password: this.password,
      isAdmin: this.data.user.isAdmin
    }
    this.adminService.changeUserPassword(props).subscribe({
      next: () => {
        this.dismiss('success')
      }
    });
  }
}
