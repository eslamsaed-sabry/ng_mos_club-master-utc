import { Component, Inject, OnInit, inject } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { LookupType, RangePercentageSymbol } from 'src/app/models/enums';
import { IDialogTarget, ITarget } from 'src/app/models/management.model';
import { CommonService } from 'src/app/services/common.service';
import { ManagementService } from 'src/app/services/management.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';

import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
    selector: 'app-target-form',
    templateUrl: './target-form.component.html',
    styleUrl: './target-form.component.scss',
    providers: [{
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        }, { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }],
    imports: [MatDialogTitle, FormsModule, MatDialogContent, MatRadioModule, MatFormFieldModule, MatSelectModule, MatOptionModule, MatInputModule, MatDatepickerModule, MatDialogActions, MatButtonModule, TranslateModule]
})
export class TargetFormComponent implements OnInit {

  form!: ITarget;

  public dialogRef = inject(MatDialogRef<TargetFormComponent>);
  private common = inject(CommonService);
  private managementService = inject(ManagementService);
  staffMembers: any[] = [];
  symbols = RangePercentageSymbol;
  constructor(@Inject(MAT_DIALOG_DATA) public data: IDialogTarget) { }

  ngOnInit(): void {
    this.form = {...this.data.target};
    if (this.data.actionType === 'edit') {
      this.form.fullDate = new Date(`${this.form.targetMonth}-02-${this.form.targetYear}`);
    } else {
      this.form.fullDate = new Date();
    }
    this.getStaffMembers();
  }

  getStaffMembers() {
    if (this.data.symbol === RangePercentageSymbol.SALES_PERSON) {
      this.common.getLookup(LookupType.Sales).subscribe({
        next: (res: any) => {
          this.staffMembers = res;
        }
      })
    }
    else {
      this.common.getLookup(LookupType.Trainers).subscribe({
        next: (res: any) => {
          this.staffMembers = res;
        }
      })
    }
  }


  dismiss(status: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: status, data: data });
  }


  submit(form: NgForm) {
    if (form.form.status === 'VALID') {
      if (this.data.actionType === 'add') {
        this.form.targetMonth = new Date(this.form.fullDate).getMonth() + 1;
        this.form.targetYear = new Date(this.form.fullDate).getFullYear();
        if (this.form.staffMemberId === 0) {
          delete this.form.staffMemberId
        }
        this.managementService.addTarget(this.data.symbol, this.form).subscribe({
          next: () => {
            this.dismiss('success');
          }
        })
      } else {
        this.managementService.editTarget(this.form.id, this.form.targetValue).subscribe({
          next: () => {
            this.dismiss('success');
          }
        })
      }
    }
  }




}
