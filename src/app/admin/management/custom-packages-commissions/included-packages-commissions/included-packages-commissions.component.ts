import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatDialogTitle, MatDialogContent } from '@angular/material/dialog';
import { IpackagesCommissions, dialogPackageCommissionData, dialogPackagesCommissionsMonthsData } from 'src/app/models/management.model';
import { ManagementService } from 'src/app/services/management.service';
import { PackageCommissionFormComponent } from '../package-commission-form/package-commission-form.component';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
import { RoleDirective } from '../../../../directives/role.directive';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-included-packages-commissions',
    templateUrl: './included-packages-commissions.component.html',
    styleUrls: ['./included-packages-commissions.component.scss'],
    imports: [MatDialogTitle, MatButtonModule, MatIconModule, MatDialogContent, MatTableModule, MatSortModule, RoleDirective, MatPaginatorModule, DatePipe, TranslateModule]
})
export class IncludedPackagesCommissionsComponent implements OnInit {
  packagesCommissions: IpackagesCommissions[] = [];
  filters: {
    month?: number,
    year?: number,
    skipCount: number,
    takeCount: number
  };

  totalElements: number;
  page: number = 0;
  perPage: number = 10;
  isDataChanged: boolean;
  constructor(public dialogRef: MatDialogRef<IncludedPackagesCommissionsComponent>, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: dialogPackagesCommissionsMonthsData,
    private apiService: ManagementService, private translate: TranslateService) { }

  displayedColumns: string[] = [
    'creationDate',
    'packageName',
    'salesPercentage',
    'trainerPercentage',
    'gymPercentage',
    'username',
    'edit',
    'delete'
  ];

  ngOnInit(): void {
    this.filters = {
      month: this.data.packagesCommissionsMonths?.month,
      year: this.data.packagesCommissionsMonths?.year,
      skipCount: 0,
      takeCount: this.perPage
    };
    this.getPackagesCommissions();
  }

  getPackagesCommissions() {
    this.filters.skipCount = this.page * this.perPage;
    this.filters.takeCount = this.perPage;

    this.apiService.getPackagesCommissions(this.filters).subscribe({
      next: (res) => {
        this.packagesCommissions = res.data;
        this.totalElements = res.totalCount;
      }
    })
  }

  onCloseModal() {
    if (this.isDataChanged) {
      this.dismiss('dataIsChanged');
    } else {
      this.dismiss();
    }
  }
  dismiss(status: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: status, data: data });
  }

  addPackagesCommissions(actionName: string, packageCommission?: IpackagesCommissions) {
    let data: dialogPackageCommissionData = {} as dialogPackageCommissionData;
    data.type = actionName;

    if (actionName === 'add') {
      packageCommission = {} as IpackagesCommissions;
      packageCommission.month = this.data.packagesCommissionsMonths?.month;
      packageCommission.year = this.data.packagesCommissionsMonths?.year;
    }
    data.packageCommission = packageCommission;
    let dialogRef = this.dialog.open(PackageCommissionFormComponent, {
      maxHeight: '80vh',
      maxWidth: '500px',
      data: data,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.isDataChanged = true;
        this.getPackagesCommissions();
      }
    });
  }

  deleteCall(packagesCommissions: IpackagesCommissions) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxHeight: '80vh',
      data: { mainTitle: this.translate.instant('management.msgToDeletedPackageCommission') },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'yes') {
        this.apiService.deletePackageCommission(packagesCommissions).subscribe({
          next: (res) => {
            this.isDataChanged = true;
            this.getPackagesCommissions();
          }
        })
      }
    });
  }

  onPaginationChange(e: PageEvent) {
    this.page = e.pageIndex;
    this.perPage = e.pageSize;
    this.getPackagesCommissions();
  }
}

