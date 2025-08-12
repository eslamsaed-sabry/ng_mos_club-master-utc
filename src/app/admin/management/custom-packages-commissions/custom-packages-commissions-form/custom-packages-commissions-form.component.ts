import { Component, Inject, OnInit } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { IPackagesCommissionsMonths, dialogPackagesCommissionsMonthsData } from 'src/app/models/management.model';
import { ManagementService } from 'src/app/services/management.service';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

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
    selector: 'app-custom-packages-commissions-form',
    templateUrl: './custom-packages-commissions-form.component.html',
    styleUrls: ['./custom-packages-commissions-form.component.scss'],
    providers: [{
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        }, { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }],
    imports: [MatDialogTitle, FormsModule, MatDialogContent, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatDialogActions, MatButtonModule, TranslateModule]
})

export class CustomPackagesCommissionsFormComponent implements OnInit {
  packagesCommissions: IPackagesCommissionsMonths = {} as IPackagesCommissionsMonths;
  fullDate: Date = new Date();
  constructor(public dialogRef: MatDialogRef<CustomPackagesCommissionsFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: dialogPackagesCommissionsMonthsData, private apiService: ManagementService) { }

  ngOnInit(): void {

  }

  dismiss(status: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: status, data: data });
  }

  submit(form: NgForm) {
    if (form.form.status === 'VALID') {
      if (this.data.type === 'add') {
        this.packagesCommissions.year = new Date(this.fullDate).getFullYear();
        this.packagesCommissions.month = new Date(this.fullDate).getMonth() + 1;
        this.apiService.addPackagesCommissionsMonths(this.packagesCommissions).subscribe({
          next: (res) => {
            this.dismiss('success');
          }
        });
      }
      else {
        this.packagesCommissions.year = this.data.packagesCommissionsMonths?.year;
        this.packagesCommissions.month = this.data.packagesCommissionsMonths?.month;
        this.packagesCommissions.copyFromYear = new Date(this.fullDate).getFullYear();
        this.packagesCommissions.copyFromMonth = new Date(this.fullDate).getMonth() + 1;
        this.apiService.copyPackagesCommissionsFromOtherMonth(this.packagesCommissions).subscribe({
          next: (res) => {
            this.dismiss('success');
          }
        });
      }
    }
  }
}
