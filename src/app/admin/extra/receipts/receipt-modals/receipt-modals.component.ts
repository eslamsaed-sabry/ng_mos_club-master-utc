import { Component, Inject, OnInit, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogClose, MatDialog } from '@angular/material/dialog';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ContextType, MemberProfileTabs } from 'src/app/models/enums';
import { IApproveDecline, IDialogReceiptModal } from 'src/app/models/extra.model';
import { ExtraService } from 'src/app/services/extra.service';
import { MemberService } from 'src/app/services/member.service';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe } from '@angular/common';
import { GenderPipe } from 'src/app/pipes/gender.pipe';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-receipt-modals',
  templateUrl: './receipt-modals.component.html',
  styleUrls: ['./receipt-modals.component.scss'],
  imports: [MatDialogTitle, MatDialogContent, MatButtonModule, MatDialogClose, RouterLink, DatePipe, TranslateModule, GenderPipe, MatIconModule],
  providers: [ExtraService]
})
export class ReceiptModalsComponent implements OnInit {
  receiptTypes = ContextType;
  modalTitle: string;
  entityData: any;
  showData: boolean;
  memberService = inject(MemberService);
  profileTabs = MemberProfileTabs;
  public dialog = inject(MatDialog);
  constructor(public dialogRef: MatDialogRef<ReceiptModalsComponent>, @Inject(MAT_DIALOG_DATA) public data: IDialogReceiptModal,
    private translate: TranslateService, private extraService: ExtraService) { }


  ngOnInit(): void {
    this.initType();
  }

  dismiss(status: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: status, data: data });
  }

  initType() {
    switch (this.data.contextTypeId) {
      case ContextType.FREEZE:
        this.modalTitle = this.translate.instant('receipts.freezeDetails');
        this.getFreeze();
        break;

      case ContextType.INSTALLMENT:
        this.modalTitle = this.translate.instant('receipts.installmentDetails');
        this.getInstallment();
        break;

      case ContextType.SESSION:
        this.modalTitle = this.translate.instant('receipts.sessionDetails');
        this.getSession();
        break;

      case ContextType.UPGRADE:
        this.modalTitle = this.translate.instant('receipts.upgradeDetails');
        this.getUpgrade();
        break;

      case ContextType.MEMBERSHIP:
      case ContextType.PRIVATE:
        this.modalTitle = this.translate.instant('receipts.membershipDetails');
        this.getMembership();
        break;
    }
  }

  getInstallment() {
    this.extraService.getInstallmentById(this.data.contextId).subscribe({
      next: (res) => {
        this.entityData = res.data;
        this.showData = true;
      }
    })
  }

  getFreeze() {
    this.extraService.getFreezeById(this.data.contextId).subscribe({
      next: (res) => {
        this.entityData = res.data;
        this.showData = true;
      }
    })
  }

  getUpgrade() {
    this.extraService.getUpgradeById(this.data.contextId).subscribe({
      next: (res) => {
        this.entityData = res.data;
        this.showData = true;
      }
    })
  }

  getSession() {
    this.extraService.getSessionById(this.data.contextId).subscribe({
      next: (res) => {
        this.entityData = res.data;
        this.showData = true;
      }
    })
  }

  getMembership() {
    this.memberService.getMembershipById(this.data.contextId).subscribe({
      next: (res) => {
        this.entityData = res.data;
        this.showData = true;
      }
    })
  }

  onApprove(event: any) {
    event.stopPropagation();
    event.preventDefault();
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxHeight: '80vh',
      data: { mainTitle: this.translate.instant('extra.msgToApproveRecord') },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'yes') {
        this.approve();
      }
    });
  }

  confirm() {
    this.dialogRef.close({ status: 'yes' });
  }

  approve() {
    if (this.data.approveStatus == 1) {
      this.extraService.finalApprove(this.data.contextTypeId, this.data.contextId).subscribe({
        next: (res) => {
          this.confirm();
        }
      });
    } else {
      this.extraService.approve(this.data.contextTypeId, this.data.contextId).subscribe({
        next: (res) => {
          this.confirm();
        }
      });
    }
  };

  onReject(event: any) {
    event.stopPropagation();
    event.preventDefault();
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxHeight: '80vh',
      data: { mainTitle: this.translate.instant('extra.msgToRejectRecord') },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'yes') {
        this.reject();
      }
    });
  }

  reject() {
    this.extraService.reject(this.data.contextTypeId, this.data.contextId).subscribe({
      next: (res) => {
        this.confirm();
      }
    });
  };

}
