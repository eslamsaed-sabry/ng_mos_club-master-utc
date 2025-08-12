import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { SearchConfig } from 'src/app/models/common.model';
import { LookupType, Redirection, Theme } from 'src/app/models/enums';
import { IDialogFoundByData, ILostItem } from 'src/app/models/extra.model';
import { Member } from 'src/app/models/member.model';
import { CommonService } from 'src/app/services/common.service';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AdvancedSearchComponent } from '../../../../shared/advanced-search/advanced-search.component';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';


@Component({
    selector: 'app-found-by-form',
    templateUrl: './found-by-form.component.html',
    styleUrls: ['./found-by-form.component.scss'],
    imports: [MatDialogTitle, MatDialogContent, MatRadioModule, FormsModule, AdvancedSearchComponent, MatFormFieldModule, MatSelectModule, MatOptionModule, MatDialogActions, MatButtonModule, MatDialogClose, TranslateModule]
})
export class FoundByFormComponent implements OnInit {
  referralType: 'MEMBER' | 'STAFF' = 'MEMBER';
  config: SearchConfig = {
    placeholder: this.translate.instant('common.topSearchPlaceholder'),
    redirectionType: Redirection.Monitoring,
    theme: Theme.Fixed
  };
  selectedMember: any;
  item: ILostItem = {} as ILostItem;
  staffMembers: any[] = [];
  finderName: string;
  finderId: number;
  constructor(private translate: TranslateService, private common: CommonService,
    public dialogRef: MatDialogRef<FoundByFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDialogFoundByData) { }

  ngOnInit(): void {
    if (this.data.item) {
      this.item = this.data.item;
      if (this.data.dialogType === 'FOUND_BY') {
        this.referralType = this.data.item.finderEmployeeId ? 'STAFF' : 'MEMBER';
        this.onSelectReferrer();
        this.finderName = this.data.item.finderName;
        this.finderId = this.data.item.finderEmployeeId!;
      };
    }
  }

  dismiss(status: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: status, data: data });
  }

  getStaffMembers() {
    this.common.getLookup(LookupType.Staff).subscribe({
      next: (res: any) => {
        this.staffMembers = res;
      }
    })
  }

  onSelectReferrer() {
    if (this.referralType === 'STAFF') {
      this.getStaffMembers();
    }
  }

  onSelectStaff() {
    this.selectedMember = this.staffMembers.find(s => s.id === this.finderId);
    this.finderName = this.selectedMember.name;
    if (this.data.dialogType === 'FOUND_BY') {
      this.item.finderMemberId = null;
      this.item.finderEmployeeId = this.finderId;
      this.item.finderName = this.finderName;
    } else {
      this.item.recipientMemberId = null;
      this.item.recipientEmployeeId = this.finderId;
      this.item.recipientEmployeeName = this.finderName;
    }
  }

  cancelSelection() {
    this.selectedMember = null;
  }

  getSelectedMember(member: Member) {
    this.selectedMember = member;
    this.finderName = this.selectedMember.nameEng;
    if (this.data.dialogType === 'FOUND_BY') {
      this.item.finderEmployeeId = null;
      this.item.finderMemberId = member.id;
    } else {
      this.item.recipientEmployeeId = null;
      this.item.recipientMemberId = member.id;
    }
  }

  submit() {
    if (this.data.dialogType === 'FOUND_BY') {
      this.dismiss('success', {
        referralType: this.referralType, employeeId: this.item.finderEmployeeId,
        memberId: this.item.finderMemberId,
        finderName: this.finderName
      })
    } else if (this.data.dialogType === 'DELIVER') {
      this.dismiss('success', this.item)
    }
  }
}
