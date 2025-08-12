import { Component, Inject, OnInit } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { Gender, LookupType } from 'src/app/models/enums';
import { ChangeSalesForm } from 'src/app/models/staff.model';
import { CommonService } from 'src/app/services/common.service';
import { StaffService } from 'src/app/services/staff.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatOptionModule } from '@angular/material/core';

import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'app-change-sales-form',
    templateUrl: './change-sales-form.component.html',
    styleUrls: ['./change-sales-form.component.scss'],
    imports: [MatDialogTitle, FormsModule, MatDialogContent, MatCheckboxModule, MatFormFieldModule, MatSelectModule, MatOptionModule, MatRadioModule, MatInputModule, MatDatepickerModule, MatDialogActions, MatButtonModule, TranslateModule]
})
export class ChangeSalesFormComponent implements OnInit {
  salesPersonData: ChangeSalesForm = new ChangeSalesForm();
  sales: any[] = [];
  gender = Gender;
  onDataSize: boolean = false;
  isActive: boolean = true;
  constructor(public dialogRef: MatDialogRef<ChangeSalesFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private staffService: StaffService, private commonService: CommonService) { }

  ngOnInit(): void {
    if (!this.salesPersonData.isPotential) {
      this.salesPersonData.changeLatestMembership = true;
    }
    this.getSales();
  }

  getSales() {
    this.commonService.getLookup(LookupType.Sales, this.isActive).subscribe({
      next: (res: any) => {
        if(!this.isActive){
          this.sales = [...res, ...this.sales];
        } else{
          this.sales = res;
        }
      }
    })
  }

  dismiss(status: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: status, data: data });
  }

  onChange(fieldName: keyof ChangeSalesForm, value: MatCheckboxChange) {
    if (!value.checked) {
      this.salesPersonData[fieldName] = <never>null;
    } else {
      this.salesPersonData[fieldName] = <never>new Date();;
    }
  }


  submit(f: NgForm) {
    if (f.form.status === 'VALID') {
      this.staffService.changeSalesPerson(this.salesPersonData).subscribe({
        next: (res) => {
          this.dismiss('success');
        }
      })

    }
  }


}
