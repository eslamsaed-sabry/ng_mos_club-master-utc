
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import moment from 'moment';
import { IAddClosingTransactions, IAddClosingTransactionsData } from 'src/app/models/management.model';
import { ManagementService } from 'src/app/services/management.service';

@Component({
    selector: 'app-closing-transactions-form',
    templateUrl: './closing-transactions-form.component.html',
    styleUrl: './closing-transactions-form.component.scss',
    imports: [MatDialogTitle, FormsModule, MatDialogContent, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatOptionModule, MatDatepickerModule, MatCheckboxModule, MatDialogActions,
    MatButtonModule, TranslateModule, RouterLink, MatIconModule]
})
export class ClosingTransactionsFormComponent {
  closingTransaction: IAddClosingTransactions = {} as IAddClosingTransactions;
  closingTransactionData: IAddClosingTransactionsData = {} as IAddClosingTransactionsData;

  public dialogRef = inject(MatDialogRef<ClosingTransactionsFormComponent>);
  private managementService = inject(ManagementService);
  private destroyRef = inject(DestroyRef);
  today = new Date();
  maxDateTime: string

  storageOver: number;

  ngOnInit(): void {
    const today = new Date();
    const format1 = "YYYY-MM-DD";
    this.closingTransaction.to = moment(today).format(format1) + 'T' + moment(today).format('HH:mm');
    this.maxDateTime = moment(today).format(format1) + 'T' + moment(today).format('HH:mm');

    this.storageOver = 0;
    this.getEndOfDayAmount();
  }

  getEndOfDayAmount() {
    this.managementService.getEndOfDayAmount(this.closingTransaction.to).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.closingTransactionData.fromDate = moment(res.data.fromDate).format('YYYY-MM-DD') + 'T' + moment(res.data.fromDate).format('HH:mm');
        this.closingTransactionData.cashAmount = res.data.cashAmount;
        this.closingTransactionData.visaAmount = res.data.visaAmount;
        this.closingTransactionData.membershipsCount = res.data.membershipsCount;
        this.closingTransactionData.monitoringMembershipsCount = res.data.monitoringMembershipsCount;
        this.closingTransactionData.sessionsCount = res.data.sessionsCount;
        this.closingTransactionData.cafeteriaCount = res.data.cafeteriaCount;
        this.closingTransactionData.debtsCount = res.data.debtsCount;
        this.closingTransactionData.upgradeCount = res.data.upgradeCount;
        this.closingTransactionData.transferCount = res.data.transferCount;
        this.closingTransactionData.freezeCount = res.data.freezeCount;
        this.closingTransactionData.reservationsCount = res.data.reservationsCount;
        this.closingTransactionData.otherRevenuesCount = res.data.otherRevenuesCount;
        this.closingTransactionData.expensesCount = res.data.expensesCount;
        this.closingTransactionData.refundCount = res.data.refundCount;
        this.closingTransactionData.downgradeCount = res.data.downgradeCount;
        this.closingTransactionData.staffFinancialsCount = res.data.staffFinancialsCount;
      }
    });
  }

  changeAmountInHand() {
    this.storageOver = this.closingTransaction.amountInHand - this.closingTransactionData.cashAmount - this.closingTransactionData.visaAmount;
  }

  dismiss(status: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: status, data: data });
  }

  submit(form: NgForm) {
    if (form.form.status === 'VALID') {
      this.closingTransaction.totalAmounts = this.closingTransactionData.cashAmount + this.closingTransactionData.visaAmount;
      this.managementService.addEndOfDaysTransaction(this.closingTransaction).subscribe({
        next: (res) => {
          this.dismiss('success');
        }
      });

    }
  }

  openProfitReport() {
    this.dismiss('success');
  }

}
