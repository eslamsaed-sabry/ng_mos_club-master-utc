import { Component, OnInit, Inject } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { Member } from 'src/app/models/member.model';
import { SearchConfig } from 'src/app/models/common.model';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { LookupType, Redirection, Theme } from 'src/app/models/enums';
import { IComplaint, dialogComplaintData } from 'src/app/models/extra.model';
import { ExtraService } from 'src/app/services/extra.service';
import { CommonService } from 'src/app/services/common.service';
import moment from 'moment';
import { DateType, StandardDatePipe } from 'src/app/pipes/standard-date.pipe';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AdvancedSearchComponent } from '../../../../shared/advanced-search/advanced-search.component';

@Component({
    selector: 'app-complaints-form',
    templateUrl: './complaints-form.component.html',
    styleUrls: ['./complaints-form.component.scss'],
    imports: [MatDialogTitle, FormsModule, MatDialogContent, AdvancedSearchComponent, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatDialogActions, MatButtonModule, TranslateModule],
    providers: [ExtraService]
})
export class ComplaintsFormComponent implements OnInit {
  complaint: IComplaint = {} as IComplaint;
  gymSections: any[] = [];
  priorities: any[] = [];
  config: SearchConfig = {
    placeholder: this.translate.instant('common.topSearchPlaceholder'),
    redirectionType: Redirection.Monitoring,
    theme: Theme.Header
  };
  memberData: Member = {} as Member;
  constructor(public dialogRef: MatDialogRef<ComplaintsFormComponent>, private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: dialogComplaintData, private extraService: ExtraService,
    private commonService: CommonService, private standardDate: StandardDatePipe) { }

  ngOnInit(): void {
    this.getGymSections();
    this.getPriorities();

    if (this.data.type === 'add') {
      this.complaint.actionDate = moment(new Date()).format('YYYY-MM-DD') + 'T' + moment(new Date()).format('HH:mm');
    }
    else {
      this.complaint = this.data.complaint!;
      this.complaint.actionDate = moment(this.data.complaint?.actionDate).format('YYYY-MM-DD') + 'T' + moment(this.data.complaint?.actionDate).format('HH:mm');
    }

    if (this.data.complaint) {
      this.complaint = this.data.complaint;
      this.memberData.applicationNo = this.data.complaint.memberContractNo;
      this.memberData.code = this.data.complaint.memberCode;
      this.memberData.phoneNo = this.data.complaint.memberPhone;
      this.memberData.nameEng = this.data.complaint.memberName;
      this.complaint.description = this.complaint.complaintDescription;
      this.complaint.subject = this.complaint.complaintSubject;
    }
  }

  getGymSections() {
    this.commonService.getLookup(LookupType.GymSections).subscribe({
      next: (res: any) => {
        this.gymSections = res;
      }
    })
  }

  getPriorities() {
    this.commonService.getLookup(LookupType.Priorities).subscribe({
      next: (res: any) => {
        this.priorities = res;
      }
    })
  }

  dismiss(status: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: status, data: data });
  }

  submit(f: NgForm) {
    if (f.form.status === 'VALID') {
      if (this.data.type === 'add') {
        this.extraService.addComplaint(this.complaint).subscribe({
          next: (res) => {
            this.dismiss('success')
          }
        })
      } else {
        this.extraService.editComplaint(this.complaint).subscribe({
          next: (res) => {
            this.dismiss('success')
          }
        })
      }
    }
  }


  getSelectedMember(member: Member) {
    this.memberData = member;
    this.complaint.memberId = member.id;
  }

}
