import { Component, OnInit, TemplateRef, ViewChild, inject, DestroyRef } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { Gender, LookupType } from 'src/app/models/enums';
import { dialogScheduleClassData, IClassRoom, IClassType, IInstructor, ISchedule } from 'src/app/models/schedule.model';
import { ScheduleService } from 'src/app/services/schedule.service';
import { map, tap } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { CommonService } from 'src/app/services/common.service';
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
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe, AsyncPipe } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import moment from 'moment';
@Component({
  selector: 'app-class-schedule-form',
  templateUrl: './class-schedule-form.component.html',
  imports: [MatDialogTitle, MatButtonModule, RouterLink, MatIconModule, FormsModule, MatDialogContent, MatFormFieldModule, MatSelectModule, MatOptionModule, MatInputModule, MatRadioModule, MatCheckboxModule, MatDialogActions, RoleDirective, RoleAttrDirective, DatePipe, TranslateModule, MatMenuModule, AsyncPipe],
  providers: [ScheduleService]
})
export class ClassScheduleFormComponent implements OnInit {
  @ViewChild('cancellationReasonModal') public cancellationReasonModal: TemplateRef<any>;
  @ViewChild('repeatClassDialogRef') public repeatClassDialogRef: TemplateRef<any>;
  @ViewChild('confirmEditTempRef') public confirmEditTempRef: TemplateRef<any>;

  selectedClass: ISchedule = {} as ISchedule;
  instructors: IInstructor[] = [];
  classTypes: IClassType[] = [];
  rooms: IClassRoom[] = [];
  gender = Gender;
  cancellationReasons: any[] = [];
  cancelReason: string;
  isCancelUpcomingRelatedClasses: boolean;
  reasonId: number;
  repeatEveryWeek: boolean;
  repeatTillDate: string;
  private scheduleService = inject(ScheduleService);
  public dialogRef = inject(MatDialogRef<ClassScheduleFormComponent>);
  public dialog = inject(MatDialog);
  private toastr = inject(ToastrService);
  private translate = inject(TranslateService);
  private commonService = inject(CommonService);
  private standardDate = inject(StandardDatePipe);
  private destroyRef = inject(DestroyRef);
  classProgram$ = this.commonService.getLookup(LookupType.ClassPrograms);
  public data = inject<dialogScheduleClassData>(MAT_DIALOG_DATA);

  ngOnInit(): void {

    if (this.data.type === 'Save') {
      this.selectedClass = this.data.scheduledClass;
      this.onSelectClassType();
      this.repeatEveryWeek = !!this.data.scheduledClass.repeatTillDate;
      this.selectedClass.startDate = this.standardDate.transform(this.data.scheduledClass.startDate, DateType.DATE_TIME_INPUT);
      this.selectedClass.endDate = this.standardDate.transform(this.data.scheduledClass.endDate, DateType.DATE_TIME_INPUT);
      this.selectedClass.bookingStartsAt = this.standardDate.transform(this.data.scheduledClass.bookingStartsAt, DateType.DATE_TIME_INPUT);
      this.selectedClass.bookingEndsAt = this.standardDate.transform(this.data.scheduledClass.bookingEndsAt, DateType.DATE_TIME_INPUT);
      this.selectedClass.repeatTillDate = this.standardDate.transform(this.data.scheduledClass.repeatTillDate, DateType.DATE_TIME_INPUT);
    } else {
      // this.selectedClass.memberPrice = 0;
      // this.selectedClass.nonMemberPrice = 0;
      this.selectedClass.startDate = this.standardDate.transform(new Date(this.data.startTime), DateType.DATE_TIME_INPUT);
      this.selectedClass.endDate = this.standardDate.transform(new Date(this.data.startTime), DateType.DATE_TIME_INPUT);
      this.selectedClass.bookingStartsAt = this.standardDate.transform(new Date(this.data.startTime), DateType.DATE_TIME_INPUT);
      this.selectedClass.bookingEndsAt = this.standardDate.transform(new Date(this.data.startTime), DateType.DATE_TIME_INPUT);
      this.selectedClass.allowDropIns = true;
      this.getDefaults();
    }
    this.selectedClass.roomId = this.data.scheduledClass ? this.data.scheduledClass.roomId : null;
    this.getClassRooms();
    this.getClasses();
  }

  getDefaults() {
    this.scheduleService.getClassDefaults().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.selectedClass.maxWaitingListCount = res.defaultMaxWaitingListCount;
        this.selectedClass.endDate = this.calcDate(this.selectedClass.startDate, res.defaultClassDuration, 'add');
        this.selectedClass.bookingStartsAt = this.calcDate(this.selectedClass.startDate, res.defaultClassBookingStartsAt, 'sub');
        this.selectedClass.bookingEndsAt = this.calcDate(this.selectedClass.startDate, res.defaultClassBookingEndsAt, 'sub');
        this.selectedClass.minBookingCancellationMinutes = res.defaultClassBookingCancelationDuration;
        this.selectedClass.maxAttendeesCount = res.defaultClassMaxAttendees;
        this.selectedClass.allowedGender = res.defaultClassGender;
        this.selectedClass.punishmentInDays = res.defaultClassPunishment;
        this.selectedClass.enableOnlineBooking = res.defaultClassEnableForOnlineBooking;
        this.selectedClass.enableForActiveMembershipOnly = res.defaultClassForActiveMembershipOnly;
        this.selectedClass.showAttendeesToPublic = res.defaultClassShowAttendeesToPublic;
        this.selectedClass.isShowCapacity = res.defaultClassShowCapacity;
        this.selectedClass.autoCancelAttendeesLimit = res.defaultClassAutoCancelAttendeesLimit;
        this.selectedClass.autoCancelDelay = res.defaultClassAutoCancelDelay;
      }
    });
  }

  calcDate(date: string, duration: number, calcType: 'add' | 'sub') {
    let _Date: any;
    if (calcType === 'add') {
      _Date = moment(date).add(duration, 'minutes');
    } else {
      _Date = moment(date).subtract(duration, 'minutes');
    }
    return this.standardDate.transform(new Date(_Date), DateType.DATE_TIME_INPUT);
  }

  dismiss(status: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: status, data: data });
  }

  onSelectClassType() {
    this.scheduleService.getMatchedInstructors(this.selectedClass.classTypeId).subscribe({
      next: (res) => {
        this.instructors = res.data;
      }
    })
  }

  getClasses() {
    this.commonService.getLookup(LookupType.ClassesTypes).subscribe({
      next: (res) => {
        this.classTypes = res;
      }
    })
  }

  getClassRooms() {
    this.scheduleService.getClassRooms().subscribe({
      next: (res) => {
        this.rooms = res.data;
      }
    })
  }

  onSelectProgram() {
    this.scheduleService.getClassesNames(this.selectedClass.programId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.classTypes = res.data;
      }
    })
  }

  publishClass() {
    this.scheduleService.publishClass(this.selectedClass.id).subscribe({
      next: (res) => {
        this.dismiss('success');
      }
    });
  }

  getCancellationReasons() {
    return this.scheduleService.getClassCancellationReasons().pipe(map((res: any) => res.data))
  }

  onCancelClass() {
    this.getCancellationReasons().pipe(
      tap((reasons) => {
        this.cancellationReasons = reasons;
      })
    ).subscribe({
      next: () => {
        this.dialog.open(this.cancellationReasonModal);
      }
    })

  }

  cancelClass(form: NgForm) {
    if (form.form.status === 'VALID') {
      let obj = {
        classId: this.selectedClass.id,
        reasonId: this.reasonId,
        reasonDescription: this.cancelReason,
        isCancelUpcomingRelatedClasses: this.isCancelUpcomingRelatedClasses
      }
      this.scheduleService.cancelClass(obj).subscribe({
        next: (res) => {
          this.dismiss('success');
          this.dialog.closeAll();
        }
      });
    }
  };

  deleteClass() {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxHeight: '80vh',
      data: { mainTitle: this.translate.instant('classSchedule.msgToDeletedClass') },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'yes') {
        this.scheduleService.deleteScheduleClass(this.selectedClass.id).subscribe({
          next: (res) => {
            this.dismiss('success');
          }
        })
      }
    });
  }

  dateValidator(): boolean {
    let valid = true;
    let classStartDate = new Date(this.selectedClass.startDate).getTime();
    let classEndDate = new Date(this.selectedClass.endDate).getTime();
    let bookingStartDate = new Date(this.selectedClass.bookingStartsAt).getTime();
    let bookingEndDate = new Date(this.selectedClass.bookingEndsAt).getTime();
    if (classEndDate <= classStartDate) {
      valid = false;
      this.toastr.error(this.translate.instant('classSchedule.classDateValidation'))
    } else if (bookingEndDate <= bookingStartDate) {
      valid = false;
      this.toastr.error(this.translate.instant('classSchedule.bookingDateValidation'))
    } else if (classStartDate <= bookingStartDate) {
      valid = false;
      this.toastr.error(this.translate.instant('classSchedule.bookingClassStartDateValidation'))
    } else if (classStartDate <= bookingEndDate) {
      valid = false;
      this.toastr.error(this.translate.instant('classSchedule.bookingClassEndDateValidation'))
    }

    return valid;
  }


  confirmEditChanges() {
    this.dialog.open(this.confirmEditTempRef, {
      width: '350px',
      disableClose: true,
      autoFocus: false
    })
  }

  editClass(editAlsoRelatedClasses: boolean) {
    this.selectedClass.editAlsoRelatedClasses = editAlsoRelatedClasses;
    this.scheduleService.editScheduleClass(this.selectedClass).subscribe({
      next: (res) => {
        if (res) {
          this.dismiss('success');
          setTimeout(() => {
            this.dialog.closeAll();
          }, 500);
        }
      }
    });
  }

  submit(form: NgForm) {
    if (form.form.status === 'VALID') {
      if (this.dateValidator()) {
        delete this.selectedClass.Id;
        if (this.data.type === 'Save') {
          this.confirmEditChanges();
        } else {
          this.scheduleService.addScheduleClass(this.selectedClass).subscribe({
            next: (res) => {
              if (res) {
                this.dismiss('success');
              }
            }
          });
        }
      }
    }
  }

  onRepeat() {
    this.dialog.open(this.repeatClassDialogRef, {
      width: '350px'
    })
  }

  updateRepeatCount(form: NgForm) {
    if (form.form.valid) {
      const data = {
        classId: this.selectedClass.id,
        repeatTillDate: this.repeatTillDate
      }
      this.scheduleService.repeatClass(data).subscribe({
        next: () => { this.dialog.closeAll(); }
      });
    }
  }

  getInsPrice() {
    this.scheduleService.getInstructorPrice(this.selectedClass.instructorId, this.selectedClass.classTypeId, this.selectedClass.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.selectedClass.instructorPrice = res.data
      }
    })
  }
}
