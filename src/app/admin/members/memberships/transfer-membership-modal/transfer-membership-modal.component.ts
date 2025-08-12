import { Component, OnInit, Inject, inject, DestroyRef } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import moment from 'moment';
import { SearchConfig } from 'src/app/models/common.model';
import { GymConfig, LookupType, Redirection, Theme } from 'src/app/models/enums';
import { dialogMembershipData, dialogPossibleMemberData, Member, TransferMembership } from 'src/app/models/member.model';
import { StandardDatePipe } from 'src/app/pipes/standard-date.pipe';
import { BrandService } from 'src/app/services/brand.service';
import { MemberService } from 'src/app/services/member.service';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MatButtonModule } from '@angular/material/button';
import { AdvancedSearchComponent } from '../../../../shared/advanced-search/advanced-search.component';
import { Router } from '@angular/router';
import { PotentialMemberFormComponent } from '../../potential-members/potential-member-form/potential-member-form.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-transfer-membership-modal',
    templateUrl: './transfer-membership-modal.component.html',
    styleUrls: ['./transfer-membership-modal.component.scss'],
    imports: [MatDialogTitle, FormsModule, MatDialogContent, AdvancedSearchComponent, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatDialogActions, TranslateModule]
})
export class TransferMembershipModalComponent implements OnInit {
  transferMembershipForm: TransferMembership = {} as TransferMembership;
  private memberService = inject(MemberService);
  private translate = inject(TranslateService);
  public dialog = inject(MatDialog);
  private brandService = inject(BrandService);
  private router = inject(Router);
  visaTypes: any[] = [];
  reasons: any[] = [];
  member: Member;
  config: SearchConfig = {
    placeholder: this.translate.instant('members.transferPlaceholder'),
    redirectionType: Redirection.Monitoring,
    theme: Theme.Header
  };
  branchName: string;
  isShowReceiptNo: boolean = false;
  private destroyRef = inject(DestroyRef);

  constructor(public dialogRef: MatDialogRef<TransferMembershipModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: dialogMembershipData) { }

  ngOnInit(): void {
    this.getVisaTypes();
    this.getBranch();
    this.getIsShowReceiptNo();

    this.transferMembershipForm.membershipId = this.data.membership.id;

    if (!this.transferMembershipForm.paymentDate) {
      this.transferMembershipForm.paymentDate = moment(new Date()).format('YYYY-MM-DD') + 'T' + moment(new Date()).format('HH:mm');
      this.transferMembershipForm.startDate = moment(new Date()).format('YYYY-MM-DD') + 'T' + moment(new Date()).format('HH:mm');
    }
    else {
      this.transferMembershipForm.paymentDate = moment(this.transferMembershipForm.paymentDate).format('YYYY-MM-DD') + 'T' + moment(this.transferMembershipForm.paymentDate).format('HH:mm');
      this.transferMembershipForm.startDate = moment(this.transferMembershipForm.startDate).format('YYYY-MM-DD') + 'T' + moment(this.transferMembershipForm.startDate).format('HH:mm');
    }
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

  submit(f: NgForm) {
    if (f.form.status === 'VALID') {
      if (!this.transferMembershipForm.cashAmount) this.transferMembershipForm.cashAmount = 0;
      if (!this.transferMembershipForm.visaAmount) this.transferMembershipForm.visaAmount = 0;

      this.transferMembershipForm.branchId = this.brandService.currentBranch.id;

      this.memberService.transferMembership(this.transferMembershipForm).subscribe({
        next: (res) => {
          this.dismiss('success');
        }
      })
    }
  }

  getSelectedMember(member: Member) {
    this.member = member;
    this.transferMembershipForm.newMemberId = member.id;
  }

  addMember() {
    //TODO
    // this.router.navigate(['/admin/form/member/add']);


    let data = {} as dialogPossibleMemberData;
    data.type = 'addMember';

    let dialogRef = this.dialog.open(PotentialMemberFormComponent, {
      maxHeight: '80vh',
      width: '500px',
      data: data,
      disableClose: true,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'success') {
        this.getSelectedMember(result.data)
      }
    });

    // let dialogRef = this.dialog.open(MemberFormComponent, {
    //   maxHeight: '80vh',
    //   width: '900px',
    //   data: { type: 'addMemberOnly', memberData: null },
    //   disableClose: true,
    //   autoFocus: false
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result.status === 'success') {
    //     this.getSelectedMember(result.data)
    //   }
    // });
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
