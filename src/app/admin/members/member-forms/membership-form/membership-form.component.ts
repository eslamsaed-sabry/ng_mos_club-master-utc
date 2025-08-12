import { Component, DestroyRef, OnInit, ViewChild, inject } from '@angular/core';
import { MemberFormsHelperService } from '../member-forms-helper.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormStepperComponent } from '../form-stepper/form-stepper.component';
import { FormsModule, NgForm } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { WeekPlannerComponent } from 'src/app/shared/week-planner/week-planner.component';
import { MatButtonModule } from '@angular/material/button';
import { PermissionsPipe } from 'src/app/pipes/permissions.pipe';
import { CounterInputComponent } from 'src/app/shared/counter-input/counter-input.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DateType } from 'src/app/pipes/standard-date.pipe';
import { Benefit, IPackage, Membership } from 'src/app/models/member.model';
import moment from 'moment';
import { WeekPlanner } from 'src/app/models/common.model';
import { GymConfig, LookupType, PackageTypes, ReceiptTypes } from 'src/app/models/enums';
import { forkJoin, map, of, switchMap } from 'rxjs';
import { MembershipPrintReceiptComponent } from '../../memberships/membership-print-receipt/membership-print-receipt.component';
import { MatDialog } from '@angular/material/dialog';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatIcon } from '@angular/material/icon';
import { MemberService } from 'src/app/services/member.service';

@Component({
    selector: 'app-membership-form',
    imports: [CommonModule, TranslateModule, FormStepperComponent, FormsModule,
        MatInputModule, MatSelectModule, MatDatepickerModule, WeekPlannerComponent, MatButtonModule,
        PermissionsPipe, CounterInputComponent, RouterLink, MatCheckbox, MatIcon],
    templateUrl: './membership-form.component.html',
    styleUrl: './membership-form.component.scss'
})
export class MembershipFormComponent implements OnInit {
  _helper = inject(MemberFormsHelperService);
  @ViewChild('planner') planner: WeekPlannerComponent;

  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private dialog = inject(MatDialog);
  private memberService = inject(MemberService);

  backUrl = this.route.snapshot.queryParams['backTo'];
  allBenefits: Benefit[] = [];
  selectedPackage: IPackage | any;
  packagePlannerSelected: Partial<WeekPlanner>;
  packageTypesEnum = PackageTypes;
  freeDays: number = 0;
  visaTypes: any[] = [];
  isPrint: boolean;
  today = new Date();
  weekPlanerToggler = false;
  expMessage: string;
  isShowReceiptNo: boolean = false;

  ngOnInit(): void {
    if (this._helper.formType === this._helper.formTypes.ADD_MEMBERSHIP) {
      this._helper.membership.branchId = this._helper.currentBranch.id;
    }
    if (this._helper.formType === this._helper.formTypes.EDIT_MEMBERSHIP) {
      this.packagePlannerSelected = this._helper.membership;
      this._helper.membership.sessionsCount = this._helper.membership.attendanceCount;
      this._helper.membership.paymentDate = moment(this._helper.membership.paymentDate).format('YYYY-MM-DDTHH:mm');
    }
    if (this._helper.member.id) {
      this._helper.membership.coachId = this._helper.member.trainerId;
      this._helper.membership.salesPersonId = this._helper.member.salesPersonId;
    }
    this.getAdditionalData();
    this.getIsShowReceiptNo();

  }

  getAdditionalData() {
    forkJoin({
      packageTypes: this._helper.getSpecificLookup(LookupType.PackageType),
      coaches: this._helper.getSpecificLookup(LookupType.Trainers),
      sales: this._helper.getSpecificLookup(LookupType.Sales),
      doctors: this._helper.getSpecificLookup(LookupType.Doctors)
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this._helper.packageTypes = res.packageTypes;
        this._helper.coaches = res.coaches;
        this._helper.sales = res.sales;
        this._helper.doctors = res.doctors;
        if (this._helper.formType === this._helper.formTypes.ADD_MEMBERSHIP) {
          this._helper.membership.packageTypeId = this._helper.packageTypes[0].id;
        }
        this.getAllBenefits();
        this.getVisaTypes();
        this.onSelectPackageType();
      }
    })
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

  getAllBenefits() {
    this._helper.memberService.getAllBenefits().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.allBenefits = res.data;
        if (this._helper.formType === this._helper.formTypes.ADD_MEMBERSHIP) {
          this._helper.membership.benfitList = res.data;
        } else {
          this.bindNewBenefits();
        }
      },
    });
  }

  onSelectPackageType() {
    this.selectedPackage = null;
    this._helper.membership.price = null as any;
    this._helper.membership.priceBeforeDiscount = null as any;
    this._helper.membership.remainingMoney = null as any;
    this._helper.memberService.getPackages(this._helper.membership.packageTypeId, this._helper.membership.branchId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this._helper.packages = res.data;
        if (this._helper.formType === this._helper.formTypes.EDIT_MEMBERSHIP) {
          this.selectedPackage = this._helper.packages.find(({ id }) => id === this._helper.membership.packageId);
        }
      },
    });
  }

  onSelectPackage(calc = true) {
    if (this._helper.packages && this._helper.packages.length > 0) {
      this._helper.membership.packageCategory = this._helper.packages.find(el => el.id === this._helper.membership.packageId)!.packageCategory;
    }

    if (this._helper.membership.packageCategory != this.packageTypesEnum.GYM) {
      this._helper.membership.salesPersonId = null;
    } else {
      this.onSelectSales();
    }
    this._helper.memberService.getPackageBenefits(this._helper.membership.packageId, this._helper.membership.packageTypeId).pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: any) => {
          this._helper.membership.benfitList = res.data;
          if (calc) {
            this.selectedPackage = null;
            this.calcPayment();
            this.calcExpDate();
          }
          this.bindNewBenefits();
        },
      });
  }

  onSelectSales() {
    if (this._helper.member.salesPersonId) {
      this._helper.membership.salesPersonId = this._helper.member.salesPersonId;
    }
  }

  calcExpDate() {

    if (!this._helper.membership.startDate)
      return

    if (!this._helper.membership.packageId)
      return

    let props = {
      "membershipId": this._helper.membership.id,
      "memberId": this._helper.membership.memberId,
      "startDate": this._helper.membership.startDate,
      "packageId": this._helper.membership.packageId,
      "freeDays": this.freeDays
    };
    this._helper.memberService.calcExpDate(props).subscribe({
      next: (res) => {
        this._helper.membership.expirationDate = new Date(res.data.date);
        this.expMessage = res.data.message;
      }
    })
  }

  onManualChangeTotal() {
    this.selectedPackage = this._helper.packages.filter(
      ({ id }) => id === this._helper.membership.packageId
    )[0];
    this.selectedPackage.price = this._helper.membership.priceBeforeDiscount;
    this.calcPayment();
  }

  calcPayment() {
    if (this._helper.membership.isDiscountPercentage === undefined) {
      this._helper.membership.isDiscountPercentage = false;
    }
    let totalPrice = 0;
    if (!this.selectedPackage) {
      this.selectedPackage = this._helper.packages.filter(
        ({ id }) => id === this._helper.membership.packageId
      )[0];
    }
    this.packagePlannerSelected = this.selectedPackage;
    // this.onSelectStartDate();

    this._helper.membership.sessionsCount = this.selectedPackage.attendanceCount;

    if (this._helper.membership.isDiscountPercentage) {
      totalPrice =
        this.selectedPackage.price -
        (this.selectedPackage.price * this._helper.membership.discount) / 100;
    } else {
      totalPrice = this.selectedPackage.price - (this._helper.membership.discount || 0);
    }
    this._helper.membership.price = totalPrice;
    this._helper.membership.priceBeforeDiscount = this.selectedPackage.price;
    // if (this._helper.membership.amountPaid)
    this.onInputAmountPaidCash();
  }

  bindNewBenefits() {
    this.allBenefits.forEach((all) => {
      all.count = 0;
      this._helper.membership.benfitList.forEach((el: any) => {
        if (all.id === el.id) {
          all.count = el.count;
        }
      });
    });
  }

  onChangeBenefit(benefit: Benefit) {
    if (benefit.symbol === 'ExtraDays' && benefit.count >= 0) {
      this.freeDays = benefit.count;
      // this.onSelectStartDate();
      this.calcExpDate();
    }
  }

  // onSelectStartDate() {
  //   if (!this.selectedPackage) {
  //     this.toastr.error('You should select a package first');
  //   } else {
  //     if (this.membership.startDate) {
  //       if (!this.selectedPackage.isDays)
  //         this.membership.expirationDate = new Date(
  //           new Date(this.membership.startDate).getTime() +
  //           (this.selectedPackage.duration * 30 + this.freeDays) * 86400000
  //         );
  //       else {
  //         let expDate = new Date(this.membership.startDate).getTime() + 1000 * 60 * 60 * 24 * (Number(this.selectedPackage.duration) + Number(this.freeDays));
  //         this.membership.expirationDate = new Date(expDate);
  //       }
  //     }
  //   }
  // }

  getVisaTypes() {
    this._helper.common.getLookup(LookupType.VisaTypes).subscribe({
      next: (res: any) => {
        this.visaTypes = res;
      }
    })
  }

  onInputAmountPaidCash() {
    if (!this._helper.membership.amountPaidVisa) this._helper.membership.amountPaidVisa = 0;
    let visa = this._helper.membership.amountPaidVisa ? this._helper.membership.amountPaidVisa : 0;
    let cash = this._helper.membership.amountPaid ? this._helper.membership.amountPaid : 0;
    this._helper.membership.remainingMoney = this._helper.membership.price - cash - visa;
  }

  printReceipt(membership: Membership) {
    this._helper.memberService.getGymConfig(GymConfig.receiptType).pipe(
      switchMap(res =>
        this._helper.memberService.getGymConfig(GymConfig.MembershipReceiptDisplayedFields).pipe(
          map(data => {
            return { receiptType: res, fields: data }
          }))
      ),
      takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (res) => {
          const _fields = res.fields.data.split(",").map(([firstLetter, ...rest]: [string]) => firstLetter.toLowerCase() + rest.join(''));
          membership.receiptType = res.receiptType.data;
          this.print(membership.id, _fields, res.receiptType.data);
        }
      })
  }

  print(membershipId: number, fields: string[], receiptType: ReceiptTypes) {
    // return
    let dialogRef = this.dialog.open(MembershipPrintReceiptComponent, {
      maxHeight: '90vh',
      width: '700px',
      data: { membershipId: membershipId, fields: fields, receiptType: receiptType },
      autoFocus: false,
      id: "printable-receipt"
    });

    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['/admin/member-profile', this._helper.membership.memberId]);
      setTimeout(() => {
        this._helper.resetForms();
      }, 100);
    });
  }

  submit(f: NgForm) {
    if (f.form.valid) {
      if (this._helper.formType === this._helper.formTypes.ADD_MEMBERSHIP) {
        let obj = { ...this._helper.membership };
        obj.benfitList = this.allBenefits;
        obj.periodId = obj.packageId;
        obj.price = this.selectedPackage.price;
        obj.comment = obj.notes;
        obj.paymentDate = this._helper.standardDate.transform(obj.paymentDate, DateType.TO_UTC);

        delete obj.expirationDate;
        let data = {
          memberCommand: this._helper.member,
          membershipCommand: { ...obj, ...this.planner.submit() }
        }

        this._helper.memberService.AddMembershipWithMember(data).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
          next: (res) => {
            this._helper.membership.id = res.data.membershipId;
            this._helper.membership.memberId = res.data.memberId;
            obj.id = res.data.membershipId;
            if (this.isPrint) {
              this.printReceipt(obj)
            } else {
              this.router.navigate(['/admin/member-profile', res.data.memberId]);
              this._helper.resetForms();
            }
          }
        })
      } else {
        this._helper.membership.benfitList = this.allBenefits;
        this._helper.membership.periodId = this._helper.membership.packageId;
        this._helper.membership.comment = this._helper.membership.notes;
        // this._helper.membership.sessionsCount = this._helper.membership.attendanceCount;
        this._helper.membership = { ...this._helper.membership, ...this.planner.submit() }

        this._helper.membership.paymentDate = this._helper.standardDate.transform(this._helper.membership.paymentDate, DateType.TO_UTC);

        this._helper.memberService.addMembership(this._helper.membership).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
          next: (res) => {
            if (this.backUrl === 'list') {
              this.router.navigate(['/admin/memberships']);
            } else {
              this.router.navigate(['/admin/member-profile', this._helper.membership.memberId]);
            }

            this._helper.resetForms();
          }
        })
      }
    }
  }

}
