import { Component, OnInit, Inject, inject, DestroyRef } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { CallMember, dialogMemberCallData, Member } from 'src/app/models/member.model';
import { MemberService } from 'src/app/services/member.service';
import { SearchConfig } from 'src/app/models/common.model';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Redirection, Theme } from 'src/app/models/enums';
import { DateType, StandardDatePipe } from 'src/app/pipes/standard-date.pipe';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { RoleAttrDirective } from '../../../../directives/role-attr.directive';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { RoleDirective } from '../../../../directives/role.directive';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AdvancedSearchComponent } from '../../../../shared/advanced-search/advanced-search.component';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import moment from 'moment';

@Component({
    selector: 'app-call-form',
    templateUrl: './call-form.component.html',
    styleUrls: ['./call-form.component.scss'],
    imports: [MatDialogTitle, FormsModule, MatDialogContent, AdvancedSearchComponent, MatFormFieldModule, MatInputModule, RoleDirective, MatDatepickerModule, 
      RoleAttrDirective, NgxMaterialTimepickerModule, MatSelectModule, MatOptionModule, 
      MatDialogActions, MatButtonModule, TranslateModule, MatTooltipModule, MatIconModule]
})
export class CallFormComponent implements OnInit {
  private memberService = inject(MemberService);
  private standardDate = inject(StandardDatePipe);
  private translate = inject(TranslateService);
  private destroyRef = inject(DestroyRef);

  showFollowUpDate: boolean = false;
  isSummaryMandatory: boolean = false;
  call: CallMember = {} as CallMember;
  minDate = new Date();
  feedBack: any[] = [];
  config: SearchConfig = {
    placeholder: this.translate.instant('common.topSearchPlaceholder'),
    redirectionType: Redirection.Monitoring,
    theme: Theme.Header
  };
  currentTime = moment(new Date(), ["h:mm A"]).format('HH:mm');
  currentFollowUpTime = moment(new Date(), ["h:mm A"]).format('HH:mm');
  constructor(public dialogRef: MatDialogRef<CallFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: dialogMemberCallData) { }

  ngOnInit(): void {
    if (this.data.type === 'editCall') {
      this.call = { ...this.data.call };
      this.currentTime = moment(new Date(this.data.call.callDate), ["h:mm A"]).format('HH:mm');

      if (this.data.call.followUpDate) {
        this.currentFollowUpTime = moment(new Date(this.data.call.followUpDate), ["h:mm A"]).format('HH:mm');
        this.showFollowUpDate = true;
      }

      if (this.data.call.summary) {
        this.isSummaryMandatory = true;
      }
    }

    if (!this.data.memberData) {
      this.data.memberData = {} as Member;
    }
    if (!this.call.callDate) {
      this.call.callDate = new Date();
      this.getTime(this.currentTime, 'call');
    }

    this.getFeedbackDD();
  }

  getFeedbackDD() {
    this.memberService.getCallFeedback().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.feedBack = res.data;
      }
    })
  }

  // dismiss(status = { action: 'cancelled', data: null }): void {
  //   console.log(status);

  //   this.dialogRef.close(status);
  // }

  dismiss(status: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: status, data: data });
  }

  addCall(f: NgForm) {
    if (f.form.status === 'VALID') {
      this.call.memberId = this.data.memberData.id;
      this.call.reasonId = 5;
      this.call.callDate = this.standardDate.transform(this.call.callDate, DateType.TO_UTC);
      if (this.showFollowUpDate)
        this.call.followUpDate = this.standardDate.transform(this.call.followUpDate, DateType.TO_UTC);
      if (!f.form.value.summary) {
        this.call.summary = "";
      }

      this.memberService.addCall(this.call).subscribe({
        next: (res) => {
          this.dismiss('success', this.call)
        }
      })
    }
  }

  editCall(f: NgForm) {
    if (f.form.status === 'VALID') {
      this.call.memberId = this.data.memberData.id;
      this.call.reasonId = 5;
      this.memberService.editCall(this.call).subscribe({
        next: (res) => {
          this.dismiss('success')
        }
      })
    }
  }

  getTime(e: string, from: string) {
    if (from === 'call') {
      let date = moment(this.call.callDate).format('DD/MM/YYYY');
      let time = moment(e, ["h:mm A"]).format('HH:mm');
      let dateTime: any = moment(date + ' ' + time, 'DD/MM/YYYY HH:mm').format();
      this.call.callDate = dateTime;
    } else {
      let date = moment(this.call.followUpDate).format('DD/MM/YYYY');
      let time = moment(e, ["h:mm A"]).format('HH:mm');
      let dateTime: any = moment(date + ' ' + time, 'DD/MM/YYYY HH:mm').format();
      this.call.followUpDate = dateTime;
    }
  }

  getSelectedMember(member: Member) {
    this.data.memberData = member;
    this.call.memberId = member.id;
  }

  onChange(e: any) {
    this.feedBack.forEach(element => {
      if (element.id === e.value) {
        this.showFollowUpDate = element.showFollowUpDate;
        this.isSummaryMandatory = element.isSummaryMandatory;

        if (!this.showFollowUpDate)
          this.call.followUpDate = null;
      }
    });
  }

  isHighPotential() {
    if (this.data.memberData.isHighPotential) {
      this.memberService.unMarkAsHighPotential(this.data.memberData.id).subscribe({
        next: (res) => {
          this.data.memberData.isHighPotential = !this.data.memberData.isHighPotential;
        },
      });
    }
    else {
      this.memberService.markAsHighPotential(this.data.memberData.id).subscribe({
        next: (res) => {
          this.data.memberData.isHighPotential = !this.data.memberData.isHighPotential;
        },
      });
    }
  }
}
