import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { LookupType, Redirection, Theme } from 'src/app/models/enums';
import { IClassRoom, IDialogPrivateRoom, IPrivateRoom } from 'src/app/models/schedule.model';
import { ScheduleService } from 'src/app/services/schedule.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { DateType, StandardDatePipe } from 'src/app/pipes/standard-date.pipe';
import { RoleAttrDirective } from '../../../directives/role-attr.directive';
import { RoleDirective } from '../../../directives/role.directive';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import moment from 'moment';
import { CommonService } from 'src/app/services/common.service';
import { AdvancedSearchComponent } from 'src/app/shared/advanced-search/advanced-search.component';
import { SearchConfig } from 'src/app/models/common.model';
import { Member, Membership } from 'src/app/models/member.model';
@Component({
  selector: 'app-private-class-schedule-form',
  templateUrl: './private-class-schedule-form.component.html',
  imports: [MatDialogTitle, MatButtonModule, MatIconModule, FormsModule, MatDialogContent, MatFormFieldModule, MatSelectModule, MatOptionModule, MatInputModule, MatRadioModule, MatCheckboxModule, AdvancedSearchComponent, MatDialogActions, RoleDirective, RoleAttrDirective, TranslateModule, MatMenuModule, AsyncPipe],
  providers: [ScheduleService]
})
export class PrivateClassScheduleFormComponent implements OnInit {

  selectedClass: IPrivateRoom = {} as IPrivateRoom;
  rooms: IClassRoom[] = [];
  visaTypes: any[] = [];

  private scheduleService = inject(ScheduleService);
  private common = inject(CommonService);
  public dialogRef = inject(MatDialogRef<PrivateClassScheduleFormComponent>);
  public dialog = inject(MatDialog);
  private translate = inject(TranslateService);
  private standardDate = inject(StandardDatePipe);
  private destroyRef = inject(DestroyRef);
  public data = inject<IDialogPrivateRoom>(MAT_DIALOG_DATA);
  instructor$ = this.common.getLookup(LookupType.Instructors);
  config: SearchConfig = {
    placeholder: this.translate.instant('common.topSearchPlaceholder'),
    redirectionType: Redirection.Monitoring,
    theme: Theme.Page
  };
  memberships: Membership[];

  ngOnInit(): void {
    if (this.data.type === 'Save') {
      this.selectedClass = this.data.scheduledClass;
      this.selectedClass.startDate = this.standardDate.transform(this.data.scheduledClass.startDate, DateType.DATE_TIME_INPUT);
      this.selectedClass.endDate = this.standardDate.transform(this.data.scheduledClass.endDate, DateType.DATE_TIME_INPUT);
    } else {
      this.selectedClass.startDate = this.standardDate.transform(new Date(this.data.startTime), DateType.DATE_TIME_INPUT);
      this.selectedClass.endDate = this.standardDate.transform(new Date(moment(this.data.startTime).add(60, 'minute').format()), DateType.DATE_TIME_INPUT);
    }
    this.selectedClass.roomId = this.data.scheduledClass ? this.data.scheduledClass.roomId : null;
    this.getClassRooms();
  }


  dismiss(status: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: status, data: data });
  }


  getClassRooms() {
    this.scheduleService.getClassRooms().subscribe({
      next: (res) => {
        this.rooms = res.data;
      }
    })
  }

  deleteClass() {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxHeight: '80vh',
      data: { mainTitle: this.translate.instant('classSchedule.msgToDeletedPrivateRoom') },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'yes') {
        this.scheduleService.deletePrivateRoom(this.selectedClass.id!).subscribe({
          next: (res) => {
            this.dismiss('success');
          }
        })
      }
    });
  }

  submit(form: NgForm) {
    if (form.form.status === 'VALID') {
      if (this.data.type === 'Add') {
        this.scheduleService.addPrivateRoom(this.selectedClass).subscribe({
          next: (res) => {
            if (res) {
              this.dismiss('success');
            }
          }
        });
      } else {
        this.selectedClass.Id = this.selectedClass.id;
        this.scheduleService.editPrivateRoom(this.selectedClass).subscribe({
          next: (res) => {
            if (res) {
              this.dismiss('success');
            }
          }
        });
      }
    }
  }

  getSelectedMember(member: Member) {
    this.selectedClass.memberName = member.nameEng;
    this.selectedClass.memberId = member.id;
    this.scheduleService.selectSubscription(member.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.memberships = res.data;
      }
    });
  }

}
