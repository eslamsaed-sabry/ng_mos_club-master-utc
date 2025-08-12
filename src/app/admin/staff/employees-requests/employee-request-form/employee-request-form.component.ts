
import { Component, DestroyRef, Inject, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { LookupType } from 'src/app/models/enums';
import { dialogEmployeeRequestData, EmployeeRequest } from 'src/app/models/staff.model';
import { CommonService } from 'src/app/services/common.service';
import { MemberService } from 'src/app/services/member.service';
import { StaffService } from 'src/app/services/staff.service';

@Component({
    selector: 'app-employee-request-form',
    templateUrl: './employee-request-form.component.html',
    styleUrl: './employee-request-form.component.scss',
    imports: [MatDialogTitle, FormsModule, MatDialogContent, MatButtonModule, MatIconModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatDatepickerModule, MatDialogActions, TranslateModule]
})
export class EmployeeRequestFormComponent implements OnInit {
  employeeRequest: EmployeeRequest = {} as EmployeeRequest;
  requestType: any[] = [];
  selectedRequestType: any;
  endDateRequired: boolean = true;

  public dialogRef = inject(MatDialogRef<EmployeeRequestFormComponent>);
  private staffService = inject(StaffService);
  private memberService = inject(MemberService);
  destroyRef = inject(DestroyRef);

  constructor(@Inject(MAT_DIALOG_DATA) public data: dialogEmployeeRequestData, public commonService: CommonService) { }

  ngOnInit(): void {
    this.getRequestType();
  }

  getRequestType() {
    this.memberService.getLookup(LookupType.RequestType).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res: any) => {
        this.requestType = res;
      }
    })
  }

  dismiss(status: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: status, data: data });
  }

  selectRequestType() {
    this.selectedRequestType = this.requestType.find(x => x.id == this.employeeRequest.requestTypeId);

    if (this.selectedRequestType.symbol === "LeavePermission") {
      this.endDateRequired = false;
      this.employeeRequest.endDate = "";
    }
    else {
      this.endDateRequired = true;
    }

  }


  submit(f: NgForm) {
    if (f.form.status === 'VALID') {
      if (this.data.type === 'add') {

        this.staffService.addEmployeeRequest(this.employeeRequest).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
          next: (res) => {
            this.dismiss('success');
          }
        })
      }
    }
  }
}
