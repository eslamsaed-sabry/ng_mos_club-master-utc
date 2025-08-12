import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { Member } from 'src/app/models/member.model';
import { MemberService } from 'src/app/services/member.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss'],
    imports: [MatDialogTitle, MatDialogContent, MatFormFieldModule, MatInputModule, FormsModule, MatIconModule, MatDialogActions, MatButtonModule, MatDialogClose, TranslateModule]
})
export class ChangePasswordComponent implements OnInit {
  password: string;
  pwType: string = 'password';

  constructor(public dialogRef: MatDialogRef<ChangePasswordComponent>, @Inject(MAT_DIALOG_DATA) public member: Member, private memberService: MemberService) { }


  ngOnInit(): void {
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


  apply() {
    this.memberService.changeMemberPassword(this.member.id, this.password).subscribe({
      next: () => {
        this.dismiss('success',  this.member)
      }
    });
  }
}
