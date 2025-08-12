import { Component, OnInit, Inject } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { dialogMemberReminder, Member } from 'src/app/models/member.model';
import { MemberService } from 'src/app/services/member.service';
import { IUserReminder, SearchConfig } from 'src/app/models/common.model';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { LookupType, Redirection, Theme } from 'src/app/models/enums';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { SalesScheduleService } from 'src/app/services/sales-schedule.service';
import { DateType, StandardDatePipe } from 'src/app/pipes/standard-date.pipe';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { RoleDirective } from '../../../directives/role.directive';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AdvancedSearchComponent } from '../../../shared/advanced-search/advanced-search.component';


@Component({
    selector: 'app-member-reminder-form',
    templateUrl: './member-reminder-form.component.html',
    styleUrls: ['./member-reminder-form.component.scss'],
    imports: [MatDialogTitle, FormsModule, MatDialogContent, AdvancedSearchComponent, MatFormFieldModule, MatInputModule, RoleDirective, MatSelectModule, MatOptionModule, MatDialogActions, MatButtonModule, TranslateModule]
})
export class MemberReminderFormComponent implements OnInit {
  selectedMember: Partial<Member>;
  reminder: IUserReminder = {} as IUserReminder;
  minDate = new Date();
  config: SearchConfig = {
    placeholder: this.translate.instant('common.topSearchPlaceholder'),
    redirectionType: Redirection.Monitoring,
    theme: Theme.Header
  };
  users: any[] = [];
  constructor(public dialogRef: MatDialogRef<MemberReminderFormComponent>, private translate: TranslateService, private salesScheduleService: SalesScheduleService,
    @Inject(MAT_DIALOG_DATA) public data: dialogMemberReminder, private memberService: MemberService, private toastr: ToastrService, private standardDate: StandardDatePipe) { }

  ngOnInit(): void {
    if (this.data.type === 'add') {
      this.reminder.reminderDate = moment(new Date()).format('YYYY-MM-DD') + 'T' + moment(new Date()).format('HH:mm');
    }
    if (this.data.reminderDate) {
      this.reminder.reminderDate = moment(this.data.reminderDate).format('YYYY-MM-DD') + 'T' + moment(new Date()).format('HH:mm');
    }

    if (this.data.memberData) {
      this.selectedMember = this.data.memberData;
      this.reminder.memberId = this.data.memberData.id;
    }
    this.getUsers();
  }

  getUsers() {
    this.memberService.getLookup(LookupType.Users).subscribe({
      next: (res: any) => {
        this.users = res;
      }
    })
  }

  dismiss(status: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: status, data: data });
  }

  submit(f: NgForm) {
    if (!this.reminder.memberId) {
      this.toastr.error('Please select a member.');
      return
    }
    if (f.form.status === 'VALID') {
      this.salesScheduleService.addUserReminder(this.reminder).subscribe({
        next: (res) => {
          this.dismiss('success')
        }
      })
    }
  }

  getSelectedMember(member: Member) {
    this.selectedMember = member;
    this.reminder.memberId = member.id;
  }

}
