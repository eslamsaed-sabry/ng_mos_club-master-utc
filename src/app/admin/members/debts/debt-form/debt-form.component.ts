import { Component, OnInit, Output, EventEmitter, Inject, inject, DestroyRef } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import moment from 'moment';
import { GymConfig, LookupType } from 'src/app/models/enums';
import { dialogMemberInstallmentData, Installment } from 'src/app/models/member.model';
import { DateType, StandardDatePipe } from 'src/app/pipes/standard-date.pipe';
import { BrandService } from 'src/app/services/brand.service';
import { MemberService } from 'src/app/services/member.service';
import { TranslateModule } from '@ngx-translate/core';
import { PermissionsPipe } from '../../../../pipes/permissions.pipe';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-debt-form',
    templateUrl: './debt-form.component.html',
    styleUrls: ['./debt-form.component.scss'],
    imports: [MatDialogTitle, FormsModule, MatDialogContent, MatFormFieldModule, MatInputModule, MatDatepickerModule, NgxMaterialTimepickerModule, MatRadioModule, MatSelectModule, MatOptionModule, MatDialogActions, MatButtonModule, PermissionsPipe, TranslateModule]
})
export class DebtFormComponent implements OnInit {
  @Output('onSubmit') onSubmit = new EventEmitter();

  installment: Installment = {} as Installment;
  today = new Date();
  dueAmount: number;
  visaTypes: any[] = [];
  amount: number;
  branchName: string;
  time: any;
  isShowReceiptNo: boolean = false;

  private destroyRef = inject(DestroyRef);

  constructor(public dialogRef: MatDialogRef<DebtFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: dialogMemberInstallmentData, private memberService: MemberService,
    private standardDate: StandardDatePipe, private brandService: BrandService) { }

  ngOnInit(): void {

    if (this.data.type !== 'addInstallment') {
      this.installment = this.data.installment;
    }

    this.getIsShowReceiptNo();

    if (this.data.type === 'payoff') {
      this.dueAmount = this.data.installment.amount;
      this.getBranch();
    }
    this.getVisaTypes();

    if (!this.installment.paymentDate) {
      this.installment.paymentDate = this.standardDate.transform(new Date(), DateType.DATE_TIME_INPUT);

    } else {
      this.installment.paymentDate = this.standardDate.transform(this.installment.paymentDate, DateType.DATE_TIME_INPUT);
    }

    this.installment.dueDate = this.standardDate.transform(new Date(this.installment.dueDate), DateType.DATE_TIME_INPUT);
    this.installment.settlementDate = this.standardDate.transform(new Date(this.installment.settlementDate), DateType.DATE_TIME_INPUT);
    this.installment.nextDueDate = this.standardDate.transform(new Date(), DateType.DATE_TIME_INPUT);

    if (this.installment.settlementDate) {
      this.installment.settlementDate = this.standardDate.transform(new Date(this.installment.settlementDate), DateType.DATE_TIME_INPUT);
      this.time = moment(this.installment.settlementDate).format('h:mm A');

    }
  }

  getIsShowReceiptNo() {
    this.memberService.getGymConfig(GymConfig.EnableManualReceipts).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        var data = res.data;
        if (data == "true")
          this.isShowReceiptNo = true;
        else
          this.isShowReceiptNo = false;
      }
    })
  }

  getBranch() {
    this.branchName = this.brandService.currentBranch.name;
  }

  dismiss(status = { action: 'cancelled', data: null }): void {
    this.dialogRef.close(status);
  }

  addInstallment(f: NgForm) {

  }

  getVisaTypes() {
    this.memberService.getLookup(LookupType.VisaTypes).subscribe({
      next: (res: any) => {
        this.visaTypes = res;
      }
    })
  }

  payoffInstallment(f: NgForm) {
    if (f.form.status === 'VALID') {
      let obj = {
        "installmentId": this.installment.id,
        "paymentDate": this.standardDate.transform(this.installment.paymentDate, DateType.TO_UTC),
        "amount": this.amount,
        "isCash": this.installment.isCash,
        "nextDueDate": this.standardDate.transform(this.installment.nextDueDate, DateType.TO_UTC),
        "receiptNo": this.installment.receiptNo,
        "visaTypeId": this.installment.visaTypeId,
        "branchId": this.brandService.currentBranch.id,
      }


      this.memberService.payoffInstallment(obj).subscribe({
        next: (res) => {
          this.dismiss({ action: 'success', data: null })
        }
      })
    }
  }

  editInstallment(f: NgForm) {
    if (f.form.status === 'VALID') {
      if (!this.time) {
        this.getTime('11:00 am');
      }
      let obj = {
        "id": this.installment.id,
        "paymentDate": this.standardDate.transform(this.installment.settlementDate, DateType.TO_UTC),
        "amount": this.installment.amount,
        "isCash": this.installment.isCash,
        "dueDate": this.data.type != 'settlementDate' ? this.standardDate.transform(this.installment.dueDate, DateType.TO_UTC) : null,
        "settlementDate": this.data.type === 'settlementDate' ? this.standardDate.transform(this.installment.settlementDate, DateType.TO_UTC) : null,
        "receiptNo": this.installment.receiptNo,
        "visaTypeId": this.installment.visaTypeId
      }

      this.memberService.editInstallment(obj).subscribe({
        next: (res) => {
          this.dismiss({ action: 'success', data: null })
        }
      })
    }
  }

  getTime(e: string) {
    let date = moment(this.installment.settlementDate).format('DD/MM/YYYY');
    this.time = moment(e, ["h:mm A"]).format('HH:mm');
    let dateTime: any = moment(date + ' ' + this.time, 'DD/MM/YYYY HH:mm').format();
    this.installment.settlementDate = dateTime;
  }

}
