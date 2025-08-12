import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogActions } from '@angular/material/dialog';
import { LookupType } from 'src/app/models/enums';
import { dialogMemberData, Invitee, Member } from 'src/app/models/member.model';
import { MemberService } from 'src/app/services/member.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatOptionModule } from '@angular/material/core';

import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'app-invitee-form',
    templateUrl: './invitee-form.component.html',
    styleUrls: ['./invitee-form.component.scss'],
    imports: [FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatRadioModule, MatDialogActions, MatButtonModule, TranslateModule]
})
export class InviteeFormComponent implements OnInit {
  @Output('onSubmit') onSubmit = new EventEmitter();

  member: Member = {} as Member;
  invitation: Invitee = {} as Invitee;
  sales: any[] = [];
  constructor(public dialogRef: MatDialogRef<InviteeFormComponent>, private memberService: MemberService, @Inject(MAT_DIALOG_DATA) public data: dialogMemberData) { }

  ngOnInit(): void {
    if (!this.data.memberData) {
      this.data.memberData = {} as Member
    }
    this.getSales();
  }

  dismiss(status = { action: 'cancelled', data: null }): void {
    this.dialogRef.close(status);
  }

  addInvite(f: NgForm) {
    if (f.form.status === 'VALID') {
      this.invitation.memberId = this.data.memberData.id;
      this.memberService.addInvitation(this.invitation).subscribe({
        next: (res) => {
          if (this.data.type === 'add') {
            this.dismiss({ action: 'success', data: null })
          } else {
            this.onSubmit.emit();
          }
        }
      })
    }
  }

  getSales() {
    this.memberService.getLookup(LookupType.Sales).subscribe((res:any) => {
      this.sales = res;
    });
  }

}
