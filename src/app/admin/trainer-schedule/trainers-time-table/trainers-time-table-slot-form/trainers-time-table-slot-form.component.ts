
import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import moment from 'moment';
import { RoleDirective } from 'src/app/directives/role.directive';
import { SearchConfig, TrainersTimeTableSlotForm } from 'src/app/models/common.model';
import { LookupType, Redirection, Theme } from 'src/app/models/enums';
import { Member, dialogTrainersTimeTableSlot } from 'src/app/models/member.model';
import { CommonService } from 'src/app/services/common.service';
import { SalesScheduleService } from 'src/app/services/sales-schedule.service';
import { SlotFormComponent } from '../../slot-form/slot-form.component';
import { AdvancedSearchComponent } from 'src/app/shared/advanced-search/advanced-search.component';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-trainers-time-table-slot-form',
    templateUrl: './trainers-time-table-slot-form.component.html',
    styleUrl: './trainers-time-table-slot-form.component.scss',
    imports: [MatDialogTitle, FormsModule, MatDialogContent, MatCheckboxModule, AdvancedSearchComponent, MatFormFieldModule, MatInputModule, RoleDirective, MatSelectModule, MatOptionModule, MatDialogActions, MatButtonModule, TranslateModule]
})

export class TrainersTimeTableSlotFormComponent implements OnInit {
  private translate = inject(TranslateService);
  private toaster = inject(ToastrService);
  public dialogRef = inject(MatDialogRef<SlotFormComponent>);
  private salesScheduleService = inject(SalesScheduleService);
  private common = inject(CommonService);

  timeTableSlot: TrainersTimeTableSlotForm = new TrainersTimeTableSlotForm();
  repeatEveryWeek: boolean;
  trainers: any[] = [];
  reservationTypes: any[] = [];
  config: SearchConfig = {
    placeholder: this.translate.instant('common.topSearchPlaceholder'),
    redirectionType: Redirection.Monitoring,
    theme: Theme.Header
  };




  constructor(@Inject(MAT_DIALOG_DATA) public data: dialogTrainersTimeTableSlot) { }


  ngOnInit(): void {
    if (this.data.type === 'add') {
      this.timeTableSlot.startDate = moment(this.data.slotData!.startDate).format('YYYY-MM-DD') + 'T' + moment(this.data.slotData!.startDate).format('HH:mm');
      if (this.data.employeeId)
        this.timeTableSlot.employeeId = this.data.employeeId
    }

    if (this.data.type === 'edit') {
      this.timeTableSlot = this.data.slotData!;
      this.timeTableSlot.startDate = moment(this.data.slotData!.startDate).format('YYYY-MM-DD') + 'T' + moment(this.data.slotData!.startDate).format('HH:mm');
    }

    this.getTrainers();
    this.getReservationTypes();
  }

  getTrainers() {
    this.common.getLookup(LookupType.Trainers).subscribe({
      next: (res) => {
        this.trainers = res;
      }
    })
  }

  getReservationTypes() {
    this.common.getLookup(LookupType.ReservationTypes).subscribe({
      next: (res) => {
        this.reservationTypes = res;
      }
    })
  }

  getSelectedMember(member: Member) {
    this.timeTableSlot.memberId = member.id;
    this.timeTableSlot.memberName = member.nameEng;
  }

  dismiss(status: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: status, data: data });
  }

  submit(form: NgForm) {
    if (!this.timeTableSlot.memberId) {
      this.toaster.error(this.translate.instant('members.msgToSelectMember'))
      return
    }
    else {

      if (form.form.status === 'VALID') {
        if (this.data.type === 'add') {
          this.salesScheduleService.addTrainerTimeTableSlot(this.timeTableSlot).subscribe({
            next: (res) => {
              this.dismiss('success');
            }
          })
        } else {
          this.salesScheduleService.editTrainerTimeTableSlot(this.timeTableSlot).subscribe({
            next: (res) => {
              this.dismiss('success');
            }
          })
        }
      }
    }
  }

}
