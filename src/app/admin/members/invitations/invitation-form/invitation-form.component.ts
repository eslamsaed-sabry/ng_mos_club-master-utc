import { Component, OnInit, Output, EventEmitter, Inject, inject, DestroyRef } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { ICountryCode } from 'src/app/models/common.model';
import { Gender, LookupType, PageNames } from 'src/app/models/enums';
import { dialogMemberInvitationData, Invitee } from 'src/app/models/member.model';
import { CommonService } from 'src/app/services/common.service';
import { MemberService } from 'src/app/services/member.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-invitation-form',
    templateUrl: './invitation-form.component.html',
    styleUrls: ['./invitation-form.component.scss'],
    imports: [MatDialogTitle, FormsModule, MatDialogContent, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatRadioModule, MatDialogActions, MatButtonModule, TranslateModule]
})
export class InvitationFormComponent implements OnInit {
  @Output('onSubmit') onSubmit = new EventEmitter();
  invitation: Invitee = {} as Invitee;
  sales: any[] = [];
  numberOfDays: any[] = [];
  invitationCount: number | null;
  gender = Gender;
  countryCodes: ICountryCode[] = [];
  requiredFields: string[] = [];
  disabledSales: boolean = false;

  public dialogRef = inject(MatDialogRef<InvitationFormComponent>)
  private memberService = inject(MemberService);
  public common = inject(CommonService);
  destroyRef = inject(DestroyRef);

  constructor(@Inject(MAT_DIALOG_DATA) public data: dialogMemberInvitationData) { }

  ngOnInit(): void {
    this.getCountryCodes();
    if (this.data.type === 'editInvitation') {
      this.invitation = this.data.invitation;
    }

    if (this.data.membershipId) {
      this.invitation.membershipId = this.data.membershipId
    }

    if (!this.data.memberData || this.data.rotateInvitation) {
      this.getSales();
      this.getRequiredFields();
    }

    this.getNumberOfDays();
    this.data.hideSales = true;
  }

  getCountryCodes() {
    this.common.getCountryCodes().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.countryCodes = res.data;
        this.invitation.phoneFormatId = this.countryCodes[0].id;
      }
    })
  }

  getRequiredFields() {
    this.memberService.getRequiredFields(PageNames.MEMBER_FORM).subscribe({
      next: (res: any) => {
        this.requiredFields = res.map((el: any) => el.fieldDevName.charAt(0).toLowerCase() + el.fieldDevName.slice(1));
      }
    })
  }

  dismiss(status = { action: 'cancelled', data: null }): void {
    this.dialogRef.close(status);
  }

  addInvite(f: NgForm) {
    if (this.common.validatePhoneNumber(this.invitation.inviteePhone, this.invitation.phoneFormatId, this.countryCodes)) {
      if (f.form.status === 'VALID') {
        this.memberService.addInvitation(this.invitation).subscribe({
          next: (res) => {
            if (this.data.type === 'addInvitation') {
              this.dismiss({ action: 'success', data: null })
            } else {
              this.onSubmit.emit();
            }
          }
        })
      }
    }
  }

  getSales() {
    this.common.getLookup(LookupType.Sales).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((res: any) => {
      this.sales = res;
    });
  }

  getNumberOfDays() {
    this.common.getLookup(LookupType.NumberOfDays).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((res: any) => {
      this.numberOfDays = res;

      if (this.numberOfDays.length == 1) {
        this.invitation.numberOfDays = this.numberOfDays[0].id;
      }
    });
  }

  typeAhead(fieldName: string, fieldVal: any) {
    if (fieldVal.trim().length > 0) {
      this.invitationCount = null;
      let value = fieldName === 'phone' ? this.invitation.inviteePhone : this.invitation.inviteeNationalId;
      if (value.trim().length > 0) {
        this.memberService.invitationTypeAhead(value).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
          next: (res) => {
            if (res.data.id != 0) {
              this.invitationCount = res.data.invitationCount;
              this.invitation.inviteeId = res.data.id;
              this.invitation.inviteeNameAR = res.data.nameAr;
              this.invitation.inviteeNameEng = res.data.nameEn;
              this.invitation.inviteeNationalId = res.data.nationalId;
              this.invitation.inviteePhone = res.data.phoneNo;
              this.invitation.gender = res.data.gender;
              this.invitation.salesPersonId = res.data.salesPersonId;
              this.data.hideSales = true;

              if (this.invitation.salesPersonId)
                this.disabledSales = true;
              else
                this.disabledSales = false;

            } else {
              this.disabledSales = false;
              this.getActiveSales();
            }
          }
        })
      }
    }
  }

  getActiveSales() {
    this.memberService.getIsSalesPersonActive(this.data.membershipId).subscribe({
      next: (res) => {
        if (!res.data) {
          this.data.hideSales = false;
          this.getSales();
          this.getRequiredFields();
        }
      }
    })
  }

  copyName() {
    if (this.data.type === 'addInvitation') {
      this.invitation.inviteeNameAR = this.invitation.inviteeNameEng;
    }
  }

}
