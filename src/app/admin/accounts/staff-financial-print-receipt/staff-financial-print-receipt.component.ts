import { NgStyle, DatePipe } from '@angular/common';
import { Component, DestroyRef, Inject, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { GymConfig, ReceiptTypes } from 'src/app/models/enums';
import { IAuthorizedUser } from 'src/app/models/user.model';
import * as env from '../../../../environments/environment';
import { IFinancial } from 'src/app/models/accounts.model';
import { MemberService } from 'src/app/services/member.service';
import { forkJoin } from 'rxjs';
import { BrandService } from 'src/app/services/brand.service';


@Component({
    selector: 'app-staff-financial-print-receipt',
    templateUrl: './staff-financial-print-receipt.component.html',
    styleUrl: './staff-financial-print-receipt.component.scss',
    imports: [NgStyle, MatDialogTitle, MatDialogContent, MatDialogActions, MatButtonModule, DatePipe, TranslateModule]
})
export class StaffFinancialPrintReceiptComponent {
  public dialogRef = inject(MatDialogRef<StaffFinancialPrintReceiptComponent>);
  private translate = inject(TranslateService);
  private memberService = inject(MemberService);
  private destroyRef = inject(DestroyRef);

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

  constructor(@Inject(MAT_DIALOG_DATA) public data: IFinancial) { }

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
      endMsg: this.memberService.getGymConfig(GymConfig.receiptEndMsg)
    }).subscribe({
      next: (res) => {
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
