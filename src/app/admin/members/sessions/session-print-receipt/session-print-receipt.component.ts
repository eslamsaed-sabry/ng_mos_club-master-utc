import { Component, OnInit, Inject, OnDestroy, AfterViewInit, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { Session } from 'src/app/models/member.model';
import { IAuthorizedUser } from 'src/app/models/user.model';
import { MemberService } from 'src/app/services/member.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import * as env from '../../../../../environments/environment';
import { GymConfig, ReceiptTypes } from 'src/app/models/enums';
import { MatButtonModule } from '@angular/material/button';
import { NgStyle, DatePipe } from '@angular/common';
import { BrandService } from 'src/app/services/brand.service';
@Component({
    selector: 'app-session-print-receipt',
    templateUrl: './session-print-receipt.component.html',
    styleUrls: ['./session-print-receipt.component.scss'],
    imports: [NgStyle, MatDialogTitle, MatDialogContent, MatDialogActions, MatButtonModule, DatePipe, TranslateModule]
})
export class SessionPrintReceiptComponent implements OnInit, OnDestroy, AfterViewInit {
  user: IAuthorizedUser = JSON.parse(localStorage.getItem('mosUser')!);
  today = new Date();
  rules: any[];
  endMsg: string;
  receiptTypes = ReceiptTypes;
  currentLang: string = this.translate.getDefaultLang();
  direction: string;
  receiptFormat: 'SMALL' | 'LARGE';
  brandService = inject(BrandService);
  logo = env.environment.server + this.brandService.brand.reportLogo;
  constructor(public dialogRef: MatDialogRef<SessionPrintReceiptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Session, private memberService: MemberService, private translate: TranslateService) { }

  ngOnInit(): void {
    this.dialogRef.updatePosition({ top: `50px` });
    this.getMsgs();
  }

  ngAfterViewInit(): void {
    this.defineReceiptLang();
  }

  defineReceiptLang() {
    switch (this.data.receiptType) {
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

  getMsgs() {
    forkJoin({
      rules: this.memberService.getGymRules(),
      endMsg: this.memberService.getGymConfig(GymConfig.receiptEndMsg)
    }).subscribe({
      next: (res) => {
        this.rules = res.rules.data;
        this.endMsg = res.endMsg.data;
      }
    })
  }

  print() {
    this.memberService.preparePrintContainer(this.data.receiptType);
  }

  ngOnDestroy(): void {
    this.translate.use(this.currentLang);
  }
}
