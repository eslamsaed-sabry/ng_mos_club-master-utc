import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { dialogMembershipChangeStartDate } from 'src/app/models/member.model';
import { DateType, StandardDatePipe } from 'src/app/pipes/standard-date.pipe';
import { BrandService } from 'src/app/services/brand.service';
import { MemberService } from 'src/app/services/member.service';

@Component({
    selector: 'app-membership-change-start-date-modal',
    templateUrl: './membership-change-start-date-modal.component.html',
    styleUrl: './membership-change-start-date-modal.component.scss',
    imports: [MatDialogTitle, FormsModule, MatDialogContent, MatFormFieldModule, MatInputModule,
        MatOptionModule, MatDialogActions, MatButtonModule, TranslateModule, MatDatepickerModule]
})
export class MembershipChangeStartDateModalComponent implements OnInit {
  startDate: string;
  notes: string;
  constructor(public dialogRef: MatDialogRef<MembershipChangeStartDateModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: dialogMembershipChangeStartDate, private memberService: MemberService,
    private standardDate: StandardDatePipe, private brandService: BrandService) { }

  ngOnInit(): void {
    this.startDate = this.data.membership.startDate;
  }

  dismiss(status: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: status, data: data });
  }

  submit(f: NgForm) {
    if (f.form.status === 'VALID') {
      let startDate = this.standardDate.transform(this.startDate, DateType.TO_UTC);
      let obj = {
        membershipId: this.data.membership.id,
        startDate: startDate,
        notes: this.notes,
      }
      this.memberService.changeStartDate(obj).subscribe({
        next: (res) => {
          if (res.statusCode === 200) {
            this.dismiss('success')
          }
        }
      })
    }
  }
}
