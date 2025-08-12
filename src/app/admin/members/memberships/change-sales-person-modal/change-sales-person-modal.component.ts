import { Component, Inject, OnInit } from '@angular/core';

import { ChangeEmployee, dialogMembershipData, IChangeSalesDialog } from 'src/app/models/member.model';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MemberService } from 'src/app/services/member.service';
import { LookupType } from 'src/app/models/enums';
import { NgForm, FormsModule } from '@angular/forms';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-change-sales-person-modal',
  templateUrl: './change-sales-person-modal.component.html',
  imports: [MatDialogTitle, FormsModule, MatDialogContent, MatFormFieldModule, MatSelectModule, MatOptionModule, MatDialogActions, MatButtonModule, TranslateModule]
})
export class ChangeSalesPersonModalComponent implements OnInit {
  changeEmployeeForm: ChangeEmployee = {} as ChangeEmployee;
  sales: any[] = [];
  trainers: any[] = [];
  pageName: string;
  constructor(public dialogRef: MatDialogRef<ChangeSalesPersonModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IChangeSalesDialog, private memberService: MemberService,
    private translate: TranslateService) { }

  ngOnInit(): void {
    if (!this.data.isBulk)
      this.changeEmployeeForm.membershipId = this.data.membershipId!;

    if (this.data.type === "salesPerson") {
      this.changeEmployeeForm.salesPersonId = this.data.id;
      this.pageName = this.translate.instant('staff.changeSalesPerson');
      this.getSales();
    }
    else if (this.data.type === "trainer") {
      this.changeEmployeeForm.trainerId = this.data.id;
      this.pageName = this.translate.instant('staff.changeTrainer');
      this.getTrainer();
    }
  }

  dismiss(status: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: status, data: data });
  }

  getSales() {
    this.memberService.getLookup(LookupType.Sales).subscribe({
      next: (res: any) => {
        this.sales = res;
      }
    })
  }

  getTrainer() {
    this.memberService.getLookup(LookupType.Trainers).subscribe({
      next: (res: any) => {
        this.trainers = res;
      }
    })
  }

  submit(f: NgForm) {
    if (f.form.status === 'VALID') {
      if (this.data.isBulk) {
        if (this.data.type === "salesPerson") {
          this.memberService.changeBulkSalesPersons(this.data.membersID!, this.changeEmployeeForm.salesPersonId, this.data.entityType!).subscribe({
            next: (res) => {
              this.dismiss('success');
            }
          })
        }
      } else {
        if (this.data.type === "salesPerson") {
          this.memberService.changeSalesPerson(this.changeEmployeeForm).subscribe({
            next: (res) => {
              this.dismiss('success');
            }
          })
        }
        else if (this.data.type === "trainer") {
          this.memberService.changeTrainer(this.changeEmployeeForm).subscribe({
            next: (res) => {
              this.dismiss('success');
            }
          })
        }
      }
    }
  }
}
