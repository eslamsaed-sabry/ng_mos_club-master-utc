import { BrandService } from 'src/app/services/brand.service';
import { Component, DestroyRef, Inject, OnInit, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialog } from '@angular/material/dialog';
import { dialogMemberSessionData, MemberFilters, Session } from 'src/app/models/member.model';
import { MemberService } from 'src/app/services/member.service';
import moment from 'moment';
import { NgForm, FormsModule } from '@angular/forms';
import { IAuthorizedUser } from 'src/app/models/user.model';
import { Gender, GymConfig, LookupType } from 'src/app/models/enums';
import { CommonService } from 'src/app/services/common.service';
import { ICountryCode } from 'src/app/models/common.model';
import { DateType, StandardDatePipe } from 'src/app/pipes/standard-date.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { RoleAttrDirective } from '../../../../directives/role-attr.directive';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RoleDirective } from '../../../../directives/role.directive';

import { SessionPrintReceiptComponent } from '../session-print-receipt/session-print-receipt.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-session-form',
    templateUrl: './session-form.component.html',
    styleUrls: ['./session-form.component.scss'],
    imports: [MatDialogTitle, FormsModule, MatDialogContent, RoleDirective, MatFormFieldModule, MatInputModule, MatDatepickerModule, NgxMaterialTimepickerModule, MatSelectModule, MatOptionModule, MatProgressSpinnerModule, MatRadioModule, RoleAttrDirective, MatDialogActions, MatButtonModule, TranslateModule, MatCheckboxModule],
    providers: [MemberService]
})
export class SessionFormComponent implements OnInit {
  session: Session = {} as Session;
  sales: any[] = [];
  sessionTypes: any[] = [];
  user: IAuthorizedUser = JSON.parse(localStorage.getItem('mosUser') || '');
  paymentMethodErr: boolean;
  disablePhone: boolean;
  disableName: boolean;
  today = new Date();
  visaTypes: any[] = [];
  countryCodes: ICountryCode[] = [];
  phoneTypeAheadLoading: boolean;
  gender = Gender;
  branchName: string;
  isPrint: boolean;
  isShowReceiptNo: boolean = false;

  public dialogRef = inject(MatDialogRef<SessionFormComponent>)
  private memberService = inject(MemberService)
  public common = inject(CommonService)
  private standardDate = inject(StandardDatePipe)
  private brandService = inject(BrandService)
  public dialog = inject(MatDialog)
  private destroyRef = inject(DestroyRef);

  constructor(@Inject(MAT_DIALOG_DATA) public data: dialogMemberSessionData) { }

  ngOnInit(): void {
    this.getCountryCodes();
    this.getSales();
    this.getSessionsTypes();
    this.getVisaTypes();
    this.getIsShowReceiptNo();

    if (this.data.type === 'addSession') {
      this.session.phoneFormatId = 1;
      this.session.sessionDate = this.standardDate.transform(new Date(), DateType.DATE_TIME_INPUT);
      this.getBranch();
    }
    if (this.data.type === 'editSession') {
      this.session = this.data.session;
      this.session.name = this.data.session.memberName;
      this.session.sessionDate = this.standardDate.transform(this.session.sessionDate, DateType.DATE_TIME_INPUT);
      this.disablePhone = true;
      this.disableName = true;
    }

    if (this.data.memberData) {
      this.session.name = this.data.memberData.nameEng;
      this.session.phone = this.data.memberData.phoneNo;
      this.disablePhone = true;
      this.disableName = true;
    }

    if (!this.session.sessionDate) {
      this.session.isCash = true;
    }
  }

  getCountryCodes() {
    this.common.getCountryCodes().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.countryCodes = res.data;
      }
    })
  }

  dismiss(action: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: action, data: data });
  }

  getVisaTypes() {
    this.memberService.getLookup(LookupType.VisaTypes).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res: any) => {
        this.visaTypes = res;
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

  getSales() {
    this.memberService.getLookup(LookupType.Sales).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res: any) => {
        this.sales = res;
      }
    })
  }

  getSessionsTypes() {
    this.memberService.getSessionsTypes().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.sessionTypes = res.data;
      }
    })
  }


  addSession(f: NgForm) {
    if (this.common.validatePhoneNumber(this.session.phone, this.session.phoneFormatId, this.countryCodes)) {
      this.validate();
      if (f.form.status === 'VALID') {
        this.session.branchId = this.brandService.currentBranch.id;
        this.session.sessionDate = this.standardDate.transform(this.session.sessionDate, DateType.TO_UTC);
        this.session.userId = this.user.id;
        this.memberService.addSession(this.session).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
          next: (res) => {
            if (this.isPrint) {
              this.getSession(res.data)
            } else {
              this.dismiss('success');
            }
          }
        })
      }
    }
  }

  editSession(f: NgForm) {
    this.validate();
    if (f.form.status === 'VALID') {
      delete this.session.type;
      delete this.session.visaTypeId;
      this.session.sessionDate = this.standardDate.transform(this.session.sessionDate, DateType.TO_UTC);
      this.memberService.editSession(this.session).subscribe({
        next: (res) => {
          this.dismiss('success')
        }
      })
    }
  }

  onSelectPrice() {
    this.sessionTypes.forEach(s => {
      if (s.id === this.session.typeId) {
        this.session.price = s.price;
      }
    })
  }

  validate() {
    if (this.session.isCash === undefined) {
      this.paymentMethodErr = true;
    } else {
      this.paymentMethodErr = false;
    }
  }

  searchPhone() {
    this.disableName = false;
    this.phoneTypeAheadLoading = true;
    let props = {
      phoneNo: this.session.phone,
      skipCount: 0,
      takeCount: 1,
      showSuccessToastr: 'false',
      showSpinner: 'false'
    } as MemberFilters;

    this.memberService.getMembers(props).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res: any) => {
        this.phoneTypeAheadLoading = false;
        if (res.data.length > 0) {
          this.session.phoneFormatId = res.data[0].phoneFormatId;
          this.session.name = res.data[0].nameEng;
          this.session.gender = res.data[0].gender;
          this.disableName = true;
        }
      },
    });
  }

  getBranch() {
    this.branchName = this.brandService.currentBranch.name;
  }

  getSession(sessionId: number) {
    this.memberService.getSession(sessionId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.printReceipt(res.data)
      }
    })
  }

  printReceipt(session: Session) {
    this.memberService.getGymConfig(GymConfig.receiptType).subscribe({
      next: (res) => {
        session.receiptType = res.data;
        if (this.session.isCash)
          session.cashAmount = session.price;
        else
          session.visaAmount = session.price;

        let dialogRef = this.dialog.open(SessionPrintReceiptComponent, {
          maxHeight: '90vh',
          width: '700px',
          data: session,
          autoFocus: false,
          id: "printable-receipt"
        });

        dialogRef.afterClosed().subscribe(result => {
          this.dismiss('success')
        });

      }
    })
  }


}
