import { Component, OnInit, Inject, OnDestroy, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { map } from 'rxjs';
import { IMembershipReceipt } from 'src/app/models/member.model';
import { IAuthorizedUser } from 'src/app/models/user.model';
import { MemberService } from 'src/app/services/member.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ReceiptTypes } from 'src/app/models/enums';
import * as env from '../../../../../environments/environment';
import { MatButtonModule } from '@angular/material/button';
import { NgStyle, DatePipe, CommonModule } from '@angular/common';
import { HiddenParentDirective } from 'src/app/directives/hidden-parent.directive';
import { BrandService } from 'src/app/services/brand.service';
import { DigitalSignatureComponent } from 'src/app/shared/digital-signature/digital-signature.component';
@Component({
    selector: 'app-membership-print-receipt',
    templateUrl: './membership-print-receipt.component.html',
    styleUrls: ['./membership-print-receipt.component.scss'],
    imports: [CommonModule, NgStyle, MatDialogTitle, MatDialogContent, MatDialogActions, MatButtonModule, DatePipe, TranslateModule, HiddenParentDirective, DigitalSignatureComponent]
})
export class MembershipPrintReceiptComponent implements OnInit, OnDestroy {
  user: IAuthorizedUser = JSON.parse(localStorage.getItem('mosUser')!);
  private memberService = inject(MemberService);
  private translate = inject(TranslateService);
  today = new Date();
  endMsg: string;
  receiptTypes = ReceiptTypes;
  currentLang: string = this.translate.getDefaultLang();
  direction: string = 'ltr';
  receiptFormat: 'SMALL' | 'LARGE';
  brandService = inject(BrandService);
  logo = env.environment.server + this.brandService.brand.reportLogo;
  membership: IMembershipReceipt = {} as IMembershipReceipt;

  receiptData$ = this.memberService.getMembershipReceiptData(this.data.membershipId).pipe(map(res => this.defineDisplayedKeys(res.data) as IMembershipReceipt));
  constructor(public dialogRef: MatDialogRef<MembershipPrintReceiptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { membershipId: number }) { }

  ngOnInit(): void {
    this.dialogRef.updatePosition({ top: `50px` });
  }



  defineReceiptLang() {
    switch (this.membership.receiptType) {
      case this.receiptTypes.SM_EN:
        this.receiptFormat = 'SMALL';
        this.translate.use('en');
        this.direction = 'ltr';
        break;
      case this.receiptTypes.W_F:
        this.receiptFormat = 'LARGE';
        this.translate.use('en');
        this.direction = 'ltr';
        this.dialogRef.updateSize('850px');
        break;
      case this.receiptTypes.W_F_AR:
        this.receiptFormat = 'LARGE';
        this.translate.use('ar');
        this.direction = 'rtl';
        this.dialogRef.updateSize('850px');
        break;
      default:
        this.receiptFormat = 'SMALL';
        this.translate.use('ar');
        this.direction = 'rtl';
        break;
    }
  }

  dismiss(status: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: status, data: data });
  }

  defineDisplayedKeys(membership: IMembershipReceipt) {

    this.membership = membership;
    this.defineReceiptLang();
    const _fields = this.membership.displayedFields.split(",").map(([firstLetter, ...rest]) => firstLetter.toLowerCase() + rest.join(''));
    const filteredMembership = _fields.reduce((obj: any, field: string) => {
      let _F = field as keyof IMembershipReceipt;
      if (membership.hasOwnProperty(field)) {
        obj[field] = membership[_F];
      } else {
        obj[field] = null;
      }
      return obj;
    }, {});
    return filteredMembership;
  }



  // getMsgs() {
  //   forkJoin({
  //     rules: this.memberService.getGymRules(),
  //     endMsg: this.memberService.getGymConfig(GymConfig.receiptEndMsg)
  //   }).subscribe({
  //     next: (res) => {
  //       this.rules = res.rules.data;
  //       this.endMsg = res.endMsg.data;
  //     }
  //   })
  // }

  print() {
    this.memberService.preparePrintContainer(this.membership.receiptType);
  }

  ngOnDestroy(): void {
    this.translate.use(this.currentLang);
    this.memberService.removePrintArea();
  }
}
