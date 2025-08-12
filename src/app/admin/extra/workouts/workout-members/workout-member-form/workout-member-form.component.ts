import { Component, OnInit, Inject } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { SearchConfig } from 'src/app/models/common.model';
import { Redirection, Theme } from 'src/app/models/enums';
import { IWorkOutMember, dialogWorkoutMemberData } from 'src/app/models/management.model';
import { Member } from 'src/app/models/member.model';
import { ExtraService } from 'src/app/services/extra.service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { AdvancedSearchComponent } from '../../../../../shared/advanced-search/advanced-search.component';

@Component({
    selector: 'app-workout-member-form',
    templateUrl: './workout-member-form.component.html',
    styleUrls: ['./workout-member-form.component.scss'],
    imports: [MatDialogTitle, FormsModule, MatDialogContent, AdvancedSearchComponent, MatFormFieldModule, MatInputModule, MatDialogActions, MatButtonModule, TranslateModule],
    providers: [ExtraService]
})
export class WorkoutMemberFormComponent implements OnInit {
  bookedMember: IWorkOutMember = {} as IWorkOutMember;
  config: SearchConfig = {
    placeholder: this.translate.instant('common.topSearchPlaceholder'),
    redirectionType: Redirection.Monitoring,
    theme: Theme.Fixed
  };
  constructor(private translate: TranslateService, public dialogRef: MatDialogRef<WorkoutMemberFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: dialogWorkoutMemberData, private extraService: ExtraService) { }

  ngOnInit(): void { }

  dismiss(status: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: status, data: data });
  }


  getSelectedMember(member: Member) {
    this.bookedMember.memberName = member.nameEng;
    this.bookedMember.memberId = member.id;
    this.bookedMember.memberCode = member.code;
    this.bookedMember.memberContractNo = member.applicationNo;
    this.bookedMember.workoutId = this.data.workout.id;
  }

  submit(form: NgForm) {
    if (form.form.status === 'VALID') {
      this.extraService.addWorkoutMember(this.bookedMember).subscribe({
        next: (res) => {
          this.dismiss('success');
        }
      })
    }
  }

}
