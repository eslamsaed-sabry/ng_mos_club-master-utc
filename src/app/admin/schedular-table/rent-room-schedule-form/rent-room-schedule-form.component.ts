

import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { LookupType } from 'src/app/models/enums';
import { IClassRoom, IDialogRentRoom, IRentRoom } from 'src/app/models/schedule.model';
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

import { MatMenuModule } from '@angular/material/menu';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import moment from 'moment';
import { MemberService } from 'src/app/services/member.service';
@Component({
  selector: 'app-rent-room-schedule-form',
  templateUrl: './rent-room-schedule-form.component.html',
  imports: [MatDialogTitle, MatButtonModule, MatIconModule, FormsModule, MatDialogContent, MatFormFieldModule, MatSelectModule, MatOptionModule, MatInputModule, MatRadioModule, MatCheckboxModule, MatDialogActions, RoleDirective, RoleAttrDirective, TranslateModule, MatMenuModule],
  providers: [ScheduleService]
})
export class RentRoomScheduleFormComponent implements OnInit {

  selectedClass: IRentRoom = { isCash: true } as IRentRoom;
  rooms: IClassRoom[] = [];
  visaTypes: any[] = [];

  private scheduleService = inject(ScheduleService);
  private memberService = inject(MemberService);
  public dialogRef = inject(MatDialogRef<RentRoomScheduleFormComponent>);
  public dialog = inject(MatDialog);
  private translate = inject(TranslateService);
  private standardDate = inject(StandardDatePipe);
  private destroyRef = inject(DestroyRef);
  public data = inject<IDialogRentRoom>(MAT_DIALOG_DATA);

  ngOnInit(): void {
    if (this.data.type === 'Save') {
      this.selectedClass = this.data.scheduledClass;
      this.selectedClass.fromDate = this.standardDate.transform(this.data.scheduledClass.fromDate, DateType.DATE_TIME_INPUT);
      this.selectedClass.toDate = this.standardDate.transform(this.data.scheduledClass.toDate, DateType.DATE_TIME_INPUT);
      this.selectedClass.paymentDate = this.standardDate.transform(this.data.scheduledClass.paymentDate, DateType.DATE_TIME_INPUT);
      this.getVisaTypes();
    } else {
      this.selectedClass.fromDate = this.standardDate.transform(new Date(this.data.startTime), DateType.DATE_TIME_INPUT);
      this.selectedClass.toDate = this.standardDate.transform(new Date(moment(this.data.startTime).add(30, 'minute').format()), DateType.DATE_TIME_INPUT);
      this.selectedClass.paymentDate = this.standardDate.transform(new Date(), DateType.DATE_TIME_INPUT);
    }
    this.selectedClass.roomId = this.data.scheduledClass ? this.data.scheduledClass.roomId : null;
    this.getClassRooms();
  }

  getVisaTypes() {
    if (!this.selectedClass.isCash)
      this.memberService.getLookup(LookupType.VisaTypes).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (res: any) => {
          this.visaTypes = res;
        }
      })
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
      data: { mainTitle: this.translate.instant('classSchedule.msgToDeletedRentRoom') },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'yes') {
        this.scheduleService.deleteRentRoom(this.selectedClass.id!).subscribe({
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
        this.scheduleService.addRentRoom(this.selectedClass).subscribe({
          next: (res) => {
            if (res) {
              this.dismiss('success');
            }
          }
        });
      } else {
        this.scheduleService.editRentRoom(this.selectedClass).subscribe({
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
