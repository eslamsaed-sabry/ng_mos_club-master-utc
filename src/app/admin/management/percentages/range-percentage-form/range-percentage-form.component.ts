import { Component, Inject, OnInit } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { RangePercentageSymbol } from 'src/app/models/enums';
import { dialogRangePercentageData, IRangePercentage, IRange } from 'src/app/models/management.model';
import { ManagementService } from 'src/app/services/management.service';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatOptionModule } from '@angular/material/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
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
    selector: 'app-range-percentage-form',
    templateUrl: './range-percentage-form.component.html',
    styleUrls: ['./range-percentage-form.component.scss'],
    providers: [{
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        }, { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }],
    imports: [MatDialogTitle, FormsModule, MatDialogContent, MatFormFieldModule, MatSelectModule, MatOptionModule, MatInputModule, MatDatepickerModule, MatDialogActions, MatButtonModule, TranslateModule]
})
export class RangePercentageFormComponent implements OnInit {
  percentages: IRangePercentage = {} as IRangePercentage;
  symbols = RangePercentageSymbol;
  selectedSymbol: RangePercentageSymbol;

  constructor(public dialogRef: MatDialogRef<RangePercentageFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: dialogRangePercentageData, private managementService: ManagementService) { }


  ngOnInit(): void {
    this.selectedSymbol = this.data.symbol;
    if (this.data.type === 'edit') {
      this.percentages = this.data.percentage;
      this.percentages.fullDate = new Date(this.data.percentage.percentageMonth + '-02-' + this.data.percentage.percentageYear)
    } else {
      this.percentages.fullDate = new Date();
      this.getRanges();
    }
  }

  dismiss(status: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: status, data: data });
  }

  getRanges() {
    this.managementService.getRanges(this.data.symbol).subscribe({
      next: (res) => {
        this.percentages.percentages = res.data;
      }
    })
  }


  submit(form: NgForm) {
    if (form.form.status === 'VALID') {
      if (this.data.type === 'add') {
        this.percentages.percentageMonth = new Date(this.percentages.fullDate).getMonth() + 1;
        this.percentages.percentageYear = new Date(this.percentages.fullDate).getFullYear();

        this.managementService.addRangePercentage(this.selectedSymbol, this.percentages).subscribe({
          next: () => {
            this.dismiss('success');
          }
        })
      } else {
        this.managementService.editRangePercentage(this.selectedSymbol, this.percentages).subscribe({
          next: () => {
            this.dismiss('success');
          }
        })
      }
    }
  }

}
