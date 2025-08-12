import { Component, Inject } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import moment from 'moment';
import { ScheduleService } from 'src/app/services/schedule.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'app-publish-classes-form',
    templateUrl: './publish-classes-form.component.html',
    styleUrls: ['./publish-classes-form.component.scss'],
    imports: [MatDialogTitle, FormsModule, MatDialogContent, MatFormFieldModule, MatInputModule, MatDialogActions, MatButtonModule, TranslateModule],
    providers: [ScheduleService]
})
export class PublishClassesFormComponent {
  format1 = "YYYY-MM-DDTHH:mm";
  fromDate: string = moment(new Date()).format(this.format1);
  toDate: string = moment(new Date()).format(this.format1);

  constructor(public dialogRef: MatDialogRef<PublishClassesFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private scheduleService: ScheduleService) { }


  dismiss(status: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: status, data: data });
  }



  submit(form: NgForm) {
    if (form.form.status === 'VALID') {
      let data = {
        "fromDate": this.fromDate,
        "toDate": this.toDate,
      }
      this.scheduleService.publishAllClass(data).subscribe({
        next: () => {
          this.dismiss('success')
        }
      })
    }
  }
}
