
import { Component, Inject, inject, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { DateAdapter, MatOptionModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { MY_FORMATS } from 'src/app/admin/reports/sales-commission-report/sales-commission-report-filters/sales-commission-report-filters.component';
import { RangePercentageSymbol } from 'src/app/models/enums';
import { IDialogRange, IRange } from 'src/app/models/management.model';
import { ManagementService } from 'src/app/services/management.service';

@Component({
    selector: 'app-ranges-form',
    templateUrl: './ranges-form.component.html',
    styleUrl: './ranges-form.component.scss',
    providers: [{
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        }, { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }],
    imports: [MatDialogTitle, FormsModule, MatDialogContent, MatRadioModule, MatFormFieldModule, MatSelectModule, MatOptionModule,
    MatInputModule, MatDatepickerModule, MatDialogActions, MatButtonModule, TranslateModule]
})
export class RangesFormComponent implements OnInit {

  form!: IRange;

  public dialogRef = inject(MatDialogRef<RangesFormComponent>);
  private managementService = inject(ManagementService);
  staffMembers: any[] = [];
  symbols = RangePercentageSymbol;
  constructor(@Inject(MAT_DIALOG_DATA) public data: IDialogRange) { }

  ngOnInit(): void {
    this.form = { ...this.data.range };
  }

  dismiss(status: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: status, data: data });
  }

  submit(form: NgForm) {
    if (form.form.status === 'VALID') {
      if (this.data.actionType === 'add') {
        this.managementService.addRange(this.form.rangeFrom, this.form.rangeTo, this.data.symbol).subscribe({
          next: () => {
            this.dismiss('success');

          }
        })
      } else {
        this.managementService.editRange(this.form.rangeFrom, this.form.rangeTo, this.form.id).subscribe({
          next: () => {
            this.dismiss('success');
          }
        })
      }
    }
  }




}
