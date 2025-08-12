import { Component, DestroyRef, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { IPackagesCommissionsMonths, dialogPackagesCommissionsMonthsData } from 'src/app/models/management.model';
import { ManagementService } from 'src/app/services/management.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { CustomPackagesCommissionsFormComponent } from './custom-packages-commissions-form/custom-packages-commissions-form.component';
import { IncludedPackagesCommissionsComponent } from './included-packages-commissions/included-packages-commissions.component';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RoleDirective } from '../../../directives/role.directive';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';

@Component({
    selector: 'app-custom-packages-commissions',
    templateUrl: './custom-packages-commissions.component.html',
    styleUrls: ['./custom-packages-commissions.component.scss'],
    imports: [RoleDirective, MatButtonModule, MatIconModule, MatTooltipModule, MatPaginatorModule, TranslateModule]
})
export class CustomPackagesCommissionsComponent {
  filters: {
    month?: number,
    year?: number,
    skipCount: number,
    takeCount: number
  };
  packagesCommissions: IPackagesCommissionsMonths[] = [];
  totalElements: number;
  page: number = 0;

  public dialog = inject(MatDialog);
  private apiService = inject(ManagementService);
  private translate = inject(TranslateService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private commonService = inject(CommonService);

  constructor() { }

  ngOnInit(): void {
    this.filters = {
      skipCount: 0,
      takeCount: 10
    };

    this.commonService.fetchRouteFilters().subscribe((params) => {
      if (params) {
        this.filters = { ...params };
        this.page = Math.floor(this.filters.skipCount / this.filters.takeCount);
      }
    });

    this.getPackagesCommissionsMonths();
  }

  applyFilter() {
    this.commonService.setRouteFilters(this.filters);
    this.getPackagesCommissionsMonths();
  }

  getPackagesCommissionsMonths() {
    this.apiService.getPackagesCommissionsMonths(this.filters).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.packagesCommissions = res.data;
        this.totalElements = res.totalCount;
      }
    })
  }

  openPackageModal(actionName: string, packageCommissionsMonths?: IPackagesCommissionsMonths) {
    let data: dialogPackagesCommissionsMonthsData = {} as dialogPackagesCommissionsMonthsData;
    data.type = actionName;
    data.packagesCommissionsMonths = packageCommissionsMonths;
    let dialogRef = this.dialog.open(CustomPackagesCommissionsFormComponent, {
      maxHeight: '80vh',
      maxWidth: '500px',
      data: data,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getPackagesCommissionsMonths();
      }
    });
  }

  onDeletePackage(packageCommissionsMonths: IPackagesCommissionsMonths) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxHeight: '80vh',
      data: { mainTitle: this.translate.instant('management.msgToDeletedPackagesCommissionsMonths') },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'yes') {
        this.apiService.deletePackagesCommissionsMonths(packageCommissionsMonths).subscribe();
        this.getPackagesCommissionsMonths();
      }
    });
  }

  onPaginationChange(e: PageEvent) {
    this.page = e.pageIndex;
    this.filters.skipCount = e.pageIndex * this.filters.takeCount;
    this.filters.takeCount = e.pageSize;
    this.router.navigate([], {
      queryParams: {
        skipCount: this.filters.skipCount,
        takeCount: this.filters.takeCount,
        page: this.page
      },
      queryParamsHandling: 'merge'
    });
    this.commonService.setRouteFilters(this.filters);
    this.getPackagesCommissionsMonths();
  }

  openIncludedPackages(packageCommissionsMonths: IPackagesCommissionsMonths) {
    let data: dialogPackagesCommissionsMonthsData = {} as dialogPackagesCommissionsMonthsData;
    data.packagesCommissionsMonths = packageCommissionsMonths;
    let dialogRef = this.dialog.open(IncludedPackagesCommissionsComponent, {
      maxHeight: '80vh',
      maxWidth: '1000px',
      data: data,
      autoFocus: false,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'dataIsChanged')
        this.getPackagesCommissionsMonths();
    });
  }

  openCopyPackagesCommissions(packageCommissionsMonths: IPackagesCommissionsMonths) {
    this.openPackageModal('copy', packageCommissionsMonths)
  }
}
