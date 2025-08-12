import { Component, Inject, OnInit, inject } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { TrainerSlotForm } from 'src/app/models/common.model';
import { LookupType, ScheduleType } from 'src/app/models/enums';
import { dialogTrainerSlot } from 'src/app/models/member.model';
import { CommonService } from 'src/app/services/common.service';
import { SalesScheduleService } from 'src/app/services/sales-schedule.service';
import moment from 'moment';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgClass } from '@angular/common';
import { RoleAttrDirective } from 'src/app/directives/role-attr.directive';

@Component({
    selector: 'app-slot-form',
    templateUrl: './slot-form.component.html',
    styleUrls: ['./slot-form.component.scss'],
    imports: [MatDialogTitle, FormsModule, MatDialogContent, MatCheckboxModule, NgClass, MatFormFieldModule, RoleAttrDirective, MatInputModule, MatSelectModule, MatOptionModule, MatDialogActions, MatButtonModule, TranslateModule]
})
export class SlotFormComponent implements OnInit {
  slot: TrainerSlotForm = new TrainerSlotForm();
  repeatEveryWeek: boolean;
  trainers: any[] = [];
  doctors: any[] = [];
  multipleSlot: boolean;
  scheduleType = ScheduleType;

  private salesScheduleService = inject(SalesScheduleService);
  public dialogRef = inject(MatDialogRef<SlotFormComponent>);
  private common = inject(CommonService);

  constructor(@Inject(MAT_DIALOG_DATA) public data: dialogTrainerSlot) { }


  ngOnInit(): void {
    if (this.data.type === 'add') {
      this.slot.startDate = moment(new Date()).format('YYYY-MM-DD') + 'T' + moment(new Date()).format('HH:mm');
      if (this.data.trainerId)
        this.slot.trainerId = this.data.trainerId
    }
    if (this.data.slotDate) {
      this.slot.startDate = moment(this.data.slotDate).format('YYYY-MM-DD') + 'T' + moment(this.data.slotDate).format('HH:mm');
    }

    if (this.data.type === 'edit') {
      this.slot = this.data.slotData!;
      this.slot.startDate = moment(this.data.slotData!.happeningDate).format('YYYY-MM-DD') + 'T' + moment(this.data.slotData!.happeningDate).format('HH:mm');
    }

    if (this.data.scheduleType == ScheduleType.trainerSchedule)
      this.getTrainers();
    else if (this.data.scheduleType == ScheduleType.DoctorsSchedule)
      this.getDoctors();

  }

  getTrainers() {
    this.common.getLookup(LookupType.Trainers).subscribe({
      next: (res) => {
        this.trainers = res;
      }
    })
  }

  getDoctors() {
    this.common.getLookup(LookupType.Doctors).subscribe({
      next: (res) => {
        this.doctors = res;
      }
    })
  }

  dismiss(status: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: status, data: data });
  }

  submit(form: NgForm) {
    if (form.form.status === 'VALID') {
      if (this.data.type === 'add') {
        this.salesScheduleService.addTrainerSlot(this.slot).subscribe({
          next: (res) => {
            this.dismiss('success');
          }
        })
      } else {
        this.slot.id = this.slot.contextId;
        this.salesScheduleService.editTrainerSlot(this.slot).subscribe({
          next: (res) => {
            this.dismiss('success');
          }
        })
      }
    }
  }

}
