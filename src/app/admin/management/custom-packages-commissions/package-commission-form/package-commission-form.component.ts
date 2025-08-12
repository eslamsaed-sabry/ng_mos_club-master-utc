import { Component, Inject } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { LookupType } from 'src/app/models/enums';
import { IpackagesCommissions, dialogPackageCommissionData } from 'src/app/models/management.model';
import { IPackage } from 'src/app/models/member.model';
import { ManagementService } from 'src/app/services/management.service';
import { MemberService } from 'src/app/services/member.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';

import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'app-package-commission-form',
    templateUrl: './package-commission-form.component.html',
    styleUrls: ['./package-commission-form.component.scss'],
    imports: [MatDialogTitle, FormsModule, MatDialogContent, MatFormFieldModule, MatSelectModule, MatOptionModule, MatInputModule, MatDialogActions, MatButtonModule, TranslateModule]
})
export class PackageCommissionFormComponent {

  constructor(public dialogRef: MatDialogRef<PackageCommissionFormComponent>, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: dialogPackageCommissionData, private apiService: ManagementService,
    private memberService: MemberService) { }

  packageCommission: IpackagesCommissions = {} as IpackagesCommissions;
  packages: IPackage[] = [];
  packageTypes: any[] = [];

  ngOnInit(): void {
    this.getPackages();
    this.getPackagesTypes();

    if (this.data.type === 'edit') {
      this.packageCommission = this.data.packageCommission!;
    }

    this.packageCommission.month = this.data.packageCommission?.month;
    this.packageCommission.year = this.data.packageCommission?.year;
  }

  getPackages() {
    this.memberService.getPackages(null).subscribe({
      next: (res) => {
        this.packages = res.data;
      }
    })
  }

  getPackagesTypes() {
    this.memberService.getLookup(LookupType.PackageType).subscribe({
      next: (res: any) => {
        this.packageTypes = res;
      }
    })
  }

  onSelectPackageType() {
    this.memberService.getPackages(this.packageCommission.packageTypeId).subscribe({
      next: (res) => {
        this.packages = res.data;
      }
    });
  }

  dismiss(status: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: status, data: data });
  }

  submit(form: NgForm) {
    if (form.form.status === 'VALID') {
      if (this.data.type === 'add') {
        this.apiService.addPackagesCommissions(this.packageCommission).subscribe({
          next: (res) => {
            this.dismiss('success');
          }
        });
      } else {
        this.apiService.editPackagesCommissions(this.packageCommission).subscribe({
          next: (res) => {
            this.dismiss('success');
          }
        });
      }
    }
  }
}
