import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { Member } from 'src/app/models/member.model';
import { MemberService } from 'src/app/services/member.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';


@Component({
    selector: 'app-block-user',
    templateUrl: './block-user.component.html',
    styleUrls: ['./block-user.component.scss'],
    imports: [MatDialogTitle, MatDialogContent, MatFormFieldModule, MatInputModule, FormsModule, MatDialogActions, MatButtonModule, MatDialogClose, TranslateModule]
})
export class BlockUserComponent implements OnInit {
  reason: string;
  constructor(public dialogRef: MatDialogRef<BlockUserComponent>, @Inject(MAT_DIALOG_DATA) public member: Member, private memberService: MemberService) { }


  ngOnInit(): void {
  }

  dismiss(status: any = { action: 'cancelled', data: null }): void {
    this.dialogRef.close(status);
  }

  apply() {
    if (this.member.isBlocked) {
      this.memberService.unblockMember(this.member.id).subscribe(({
        next: (res) => {
          this.member.isBlocked = false;
          this.dismiss({ action: 'success', data: this.member })
        }
      }))
    } else {
      this.memberService.blockMember(this.member.id, this.reason).subscribe(({
        next: (res) => {
          this.member.isBlocked = true;
          this.dismiss({ action: 'success', data: this.member })
        }
      }))
    }

  }

}
