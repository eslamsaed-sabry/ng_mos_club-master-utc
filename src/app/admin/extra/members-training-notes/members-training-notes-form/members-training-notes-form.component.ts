
import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import moment from 'moment';
import { SearchConfig } from 'src/app/models/common.model';
import { Redirection, Theme } from 'src/app/models/enums';
import { dialogMembersTrainingNotesData } from 'src/app/models/extra.model';
import { Member, Note } from 'src/app/models/member.model';
import { StandardDatePipe } from 'src/app/pipes/standard-date.pipe';
import { MemberService } from 'src/app/services/member.service';
import { AdvancedSearchComponent } from 'src/app/shared/advanced-search/advanced-search.component';

@Component({
    selector: 'app-members-training-notes-form',
    templateUrl: './members-training-notes-form.component.html',
    styleUrl: './members-training-notes-form.component.scss',
    imports: [MatDialogTitle, FormsModule, MatDialogContent, AdvancedSearchComponent, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatDialogActions, MatButtonModule, TranslateModule, MatCheckboxModule, MatDatepickerModule]
})
export class MembersTrainingNotesFormComponent implements OnInit {
  note: Note = {} as Note;
  hasReminderDate: boolean = false;

  config: SearchConfig = {
    placeholder: this.translate.instant('common.topSearchPlaceholder'),
    redirectionType: Redirection.Monitoring,
    theme: Theme.Header
  };
  memberData: Member = {} as Member;

  public dialogRef = inject(MatDialogRef<MembersTrainingNotesFormComponent>);
  private memberService = inject(MemberService);

  constructor(@Inject(MAT_DIALOG_DATA) public data: dialogMembersTrainingNotesData,
    private standardDate: StandardDatePipe, private translate: TranslateService) { }

  ngOnInit(): void {
    this.note.isTrainingNote = true;
    if (this.data.memberId) {
      this.note.memberId = this.data.memberId;
    }
    if (this.data.type === 'add') {
      this.note.reminderDate = moment(new Date()).format('YYYY-MM-DD') + 'T' + moment(new Date()).format('HH:mm');
    }
    else {
      this.note = this.data.membersTrainingNotes!;
      this.getMember();

      if (this.note.reminderDate) {
        this.note.reminderDate = moment(this.data.membersTrainingNotes?.reminderDate).format('YYYY-MM-DD') + 'T' + moment(this.data.membersTrainingNotes?.reminderDate).format('HH:mm');
      }
    }
  }

  dismiss(status: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: status, data: data });
  }

  submit(f: NgForm) {
    if (f.form.status === 'VALID') {
      if (this.data.type === 'add') {
        if (!this.hasReminderDate) {
          this.note.reminderDate = null;
        }
        this.memberService.addNote(this.note).subscribe({
          next: (res) => {
            this.dismiss('success')
          }
        })
      } else {
        this.memberService.editNote(this.note).subscribe({
          next: (res) => {
            this.dismiss('success')
          }
        })
      }
    }
  }

  getSelectedMember(member: Member) {
    this.memberData = member;
    this.note.memberId = member.id;
  }

  getMember() {
    this.memberService.getMemberData(this.note.memberId!).subscribe({
      next: (res) => {
        this.memberData = res.data.personalData;
      }
    })
  }

  hasReminder(isReminder: any) {
    console.log(isReminder);

    this.hasReminderDate = !isReminder;
  }

}
