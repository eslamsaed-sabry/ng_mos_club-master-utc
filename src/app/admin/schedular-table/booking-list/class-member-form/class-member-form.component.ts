import { Component, DestroyRef, Inject, inject } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { SearchConfig } from 'src/app/models/common.model';
import { Redirection, Theme } from 'src/app/models/enums';
import { Member, Membership } from 'src/app/models/member.model';
import { IBookedMember, dialogBookingClassData } from 'src/app/models/schedule.model';
import { ScheduleService } from 'src/app/services/schedule.service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AdvancedSearchComponent } from '../../../../shared/advanced-search/advanced-search.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSelectModule } from '@angular/material/select';


@Component({
    selector: 'app-class-member-form',
    templateUrl: './class-member-form.component.html',
    styleUrls: ['./class-member-form.component.scss'],
    imports: [MatDialogTitle, FormsModule, MatDialogContent, AdvancedSearchComponent, MatFormFieldModule, MatInputModule, MatDialogActions, MatButtonModule, TranslateModule, MatSelectModule],
    providers: [ScheduleService]
})
export class ClassMemberFormComponent {
  private translate = inject(TranslateService);
  public dialogRef = inject(MatDialogRef<ClassMemberFormComponent>);
  private scheduleService = inject(ScheduleService);
  private destroyRef = inject(DestroyRef);

  bookedMember: IBookedMember = {} as IBookedMember;
  config: SearchConfig = {
    placeholder: this.translate.instant('common.topSearchPlaceholder'),
    redirectionType: Redirection.Monitoring,
    theme: Theme.Fixed
  };
  selectedMember: Member;
  memberships: Membership[] = [];
  constructor(@Inject(MAT_DIALOG_DATA) public data: dialogBookingClassData) { }


  dismiss(status: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: status, data: data });
  }


  getSelectedMember(member: Member) {
    this.selectedMember = member;
    this.bookedMember.memberName = member.nameEng + ' (' + member.nameAR + ')';
    this.getSubscription();
  }

  getSubscription() {
    this.scheduleService.selectSubscription(this.selectedMember.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.memberships = res.data;
        if (res.data.length) {
          this.bookedMember.membershipId = res.data[0].id;
        } else {
          delete this.bookedMember.membershipId;
        }
      }
    });
  }

  submit(form: NgForm) {
    if (form.form.valid) {
      this.scheduleService.bookClass(this.data.class.id, this.selectedMember.id, this.bookedMember.membershipId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (res) => {
          this.dismiss('success');
        }
      })
    }
  }

}
