import { Component, OnInit, Inject, DestroyRef, inject } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { GymConfig, LookupType } from 'src/app/models/enums';
import { dialogMembershipData, IPackage } from 'src/app/models/member.model';
import { DateType, StandardDatePipe } from 'src/app/pipes/standard-date.pipe';
import { BrandService } from 'src/app/services/brand.service';
import { MemberService } from 'src/app/services/member.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';

import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-upgrade-modal',
    templateUrl: './upgrade-modal.component.html',
    styleUrls: ['./upgrade-modal.component.scss'],
    imports: [MatDialogTitle, FormsModule, MatDialogContent, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatDialogActions, MatButtonModule, TranslateModule]
})
export class UpgradeModalComponent implements OnInit {
  packages: IPackage[] = [];
  paymentDate: string;
  packageId: number | null;
  difference: number | null;
  amountPaidCash: number;
  amountPaidVisa: number;
  newPackagePrice: number | null;
  visaTypeId: number;
  branchId: number;
  visaTypes: any[] = [];
  remainingMoney: number;
  refundAmount: number | null;
  minPrice: number;
  maxPrice: number;
  branchName: string;
  isShowReceiptNo: boolean = false;
  receiptNo: string;

  private destroyRef = inject(DestroyRef);

  constructor(public dialogRef: MatDialogRef<UpgradeModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: dialogMembershipData, private memberService: MemberService,
    private toastr: ToastrService, private standardDate: StandardDatePipe, private brandService: BrandService) { }

  ngOnInit(): void {
    this.paymentDate = moment(new Date()).format("YYYY-MM-DD") + 'T' + moment(new Date()).format('HH:mm');
    this.getPackages();
    this.getVisaTypes();
    this.getBranch();
    this.getIsShowReceiptNo();
  }

  dismiss(status: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: status, data: data });
  }

  getVisaTypes() {
    this.memberService.getLookup(LookupType.VisaTypes).subscribe({
      next: (res: any) => {
        this.visaTypes = res;
      }
    })
  }

  getPackages() {
    this.memberService.getPackages(this.data.membership.packageCategory).subscribe({
      next: (res) => {
        this.packages = res.data;
      },
    });
  }

  onSelectPackage() {
    let selectedPackage = this.packages.find((el: IPackage) => el.id === this.packageId);
    this.newPackagePrice = selectedPackage!.price;
    this.getPriceDiff();
  }

  getPriceDiff() {
    if (!this.packageId) {
      this.toastr.error('Please select upgrade package first!');
      return
    }

    if (this.data.type === 'upgrade') {
      this.difference = this.newPackagePrice! - this.data.membership.price;
      if (this.difference < 0) {
        this.toastr.error('The upgrade package price must be greater than current package price');
        this.minPrice = this.data.membership.price;
        // this.packageId = null;
        // this.difference = null;
        // this.newPackagePrice = null;
      }
    } else {
      this.difference = this.data.membership.price - this.newPackagePrice!;
      if (this.difference < 0) {
        this.toastr.error('The downgrade package price must be less than current package price');
        this.maxPrice = this.data.membership.price;
        this.refundAmount = null;
        // this.packageId = null;
        // this.difference = null;
        // this.newPackagePrice = null;
        return
      }
      this.refundAmount = this.difference > this.data.membership.debts ? this.difference - this.data.membership.debts : 0;
    }
  }

  submit(f: NgForm) {
    this.getPriceDiff();
    if (f.form.status === 'VALID') {
      let paymentDate = this.standardDate.transform(this.paymentDate, DateType.TO_UTC);
      if (this.data.type === 'upgrade') {
        let obj = {
          membershipId: this.data.membership.id,
          upgradePeriodId: this.packageId,
          paymentDate: paymentDate,
          paymentAmount: this.difference,
          amountPaid: this.amountPaidCash ? this.amountPaidCash : 0,
          amountPaidVisa: this.amountPaidVisa ? this.amountPaidVisa : 0,
          dueDate: paymentDate,
          receiptNo: this.receiptNo,
          visaTypeId: this.visaTypeId,
          branchId: this.brandService.currentBranch.id,
        }
        this.memberService.upgradeMembership(obj).subscribe({
          next: (res) => {
            if (res.statusCode === 200) {
              this.dismiss('success')
            }
          }
        })
      } else {
        let obj = {
          membershipId: this.data.membership.id,
          upgradePeriodId: this.packageId,
          downgradeDate: paymentDate,
          downgradePrice: this.newPackagePrice,
          isCash: this.visaTypeId ? false : true,
          withDeleteRemaining: true,
          visaTypeId: this.visaTypeId,
          branchId: this.brandService.currentBranch.id,
        }
        this.memberService.downgradeMembership(obj).subscribe({
          next: (res) => {
            if (res.statusCode === 200) {
              this.dismiss('success')
            }
          }
        })
      }
    }
  }

  getBranch() {
    this.branchName = this.brandService.currentBranch.name;
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

}
