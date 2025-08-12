
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import moment from 'moment';
import { SearchConfig } from 'src/app/models/common.model';
import { LookupType, Redirection, Theme } from 'src/app/models/enums';
import { dialogRequestData, IRequest } from 'src/app/models/extra.model';
import { Member } from 'src/app/models/member.model';
import { StandardDatePipe } from 'src/app/pipes/standard-date.pipe';
import { CommonService } from 'src/app/services/common.service';
import { ExtraService } from 'src/app/services/extra.service';
import { AdvancedSearchComponent } from 'src/app/shared/advanced-search/advanced-search.component';

@Component({
  selector: 'app-requests-form',
  templateUrl: './requests-form.component.html',
  styleUrl: './requests-form.component.scss',
  imports: [MatDialogTitle, FormsModule, MatDialogContent, AdvancedSearchComponent, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatDialogActions, MatButtonModule, TranslateModule],
  providers: [ExtraService]
})
export class RequestsFormComponent implements OnInit {
  request: IRequest = {} as IRequest;
  requestType: any[] = [];
  config: SearchConfig = {
    placeholder: this.translate.instant('common.topSearchPlaceholder'),
    redirectionType: Redirection.Monitoring,
    theme: Theme.Header
  };
  memberData: Member = {} as Member;
  constructor(public dialogRef: MatDialogRef<RequestsFormComponent>, private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: dialogRequestData, private extraService: ExtraService,
    private commonService: CommonService, private standardDate: StandardDatePipe) { }

  ngOnInit(): void {
    this.getRequestsType();

    if (this.data.type === 'edit') {
      this.request = this.data.request!;
    }

    if (this.data.request) {
      this.request = this.data.request;
      this.memberData.applicationNo = this.data.request.memberContractNo;
      this.memberData.code = this.data.request.memberAccessCode;
      this.memberData.phoneNo = this.data.request.memberPhone;
      this.memberData.nameEng = this.data.request.memberName;
      this.request.description = this.request.requestDescription;
    }
  }

  getRequestsType() {
    this.commonService.getLookup(LookupType.RequestsTypes).subscribe({
      next: (res: any) => {
        this.requestType = res;
      }
    })
  }

  dismiss(status: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: status, data: data });
  }

  submit(f: NgForm) {
    if (f.form.status === 'VALID') {
      if (this.data.type === 'add') {
        this.extraService.addRequest(this.request).subscribe({
          next: (res) => {
            this.dismiss('success')
          }
        })
      } else {
        this.extraService.editRequest(this.request).subscribe({
          next: (res) => {
            this.dismiss('success')
          }
        })
      }
    }
  }

  getSelectedMember(member: Member) {
    this.memberData = member;
    this.request.memberId = member.id;
  }

}
