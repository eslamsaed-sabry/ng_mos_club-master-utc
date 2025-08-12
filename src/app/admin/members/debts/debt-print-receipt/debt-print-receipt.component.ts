import { Component, OnInit, Inject, OnDestroy, AfterViewInit, inject, DestroyRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { Installment } from 'src/app/models/member.model';
import { IAuthorizedUser } from 'src/app/models/user.model';
import { MemberService } from 'src/app/services/member.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { GymConfig, ReceiptTypes } from 'src/app/models/enums';
import * as env from '../../../../../environments/environment';
import { MatButtonModule } from '@angular/material/button';
import { NgStyle, DatePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BrandService } from 'src/app/services/brand.service';
@Component({
    selector: 'app-debt-print-receipt',
    templateUrl: './debt-print-receipt.component.html',
    styleUrls: ['./debt-print-receipt.component.scss'],
    imports: [NgStyle, MatDialogTitle, MatDialogContent, MatDialogActions, MatButtonModule, DatePipe, TranslateModule]
})
export class DebtPrintReceiptComponent implements OnInit, OnDestroy, AfterViewInit {
  user: IAuthorizedUser = JSON.parse(localStorage.getItem('mosUser')!);
  private memberService = inject(MemberService);
  private translate = inject(TranslateService);
  private destroyRef = inject(DestroyRef);
  today = new Date();
  rules: any[];
  endMsg: string;
  receiptTypes = ReceiptTypes;
  currentLang: string = this.translate.getDefaultLang();
  direction: string;
  receiptFormat: 'SMALL' | 'LARGE';
  brandService = inject(BrandService);
  logo = env.environment.server + this.brandService.brand.reportLogo;
  constructor(public dialogRef: MatDialogRef<DebtPrintReceiptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Installment) { }

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
      // rules: this.memberService.getGymRules(),
      endMsg: this.memberService.getGymConfig(GymConfig.receiptEndMsg)
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        // this.rules = res.rules.data;
        this.endMsg = res.endMsg.data;
      }
    })
  }

  print() {
    this.memberService.preparePrintContainer(this.data.receiptType);
  }

  ngOnDestroy(): void {
    this.translate.use(this.currentLang);
    this.memberService.removePrintArea();
  }
}
