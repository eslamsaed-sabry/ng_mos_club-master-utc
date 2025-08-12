import { OtherRevenueFiltersComponent } from './other-revenue-filters/other-revenue-filters.component';
import { Component, DestroyRef, OnInit, ViewChild, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { dialogRevenueData, IOtherRevenue, OtherRevenueFilters } from 'src/app/models/accounts.model';
import { AccountsService } from 'src/app/services/accounts.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { OtherRevenueFormComponent } from './other-revenue-form/other-revenue-form.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { RoleAttrDirective } from '../../../directives/role-attr.directive';
import { DatePipe, NgClass } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RoleDirective } from '../../../directives/role.directive';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ContextType } from 'src/app/models/enums';
import { dialogChangePaymentBranchData } from 'src/app/models/member.model';
import { ChangePaymentBranchComponent } from 'src/app/shared/change-payment-branch/change-payment-branch.component';
import { BidiModule } from '@angular/cdk/bidi';
import { MatOptionModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';

@Component({
    selector: 'app-other-revenue',
    templateUrl: './other-revenue.component.html',
    styleUrls: ['./other-revenue.component.scss'],
    imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule, FormsModule, RoleDirective, MatButtonModule, MatIconModule, MatTableModule, MatSortModule, MatMenuModule, RoleAttrDirective, MatPaginatorModule, DatePipe, TranslateModule, MatSidenavModule, NgClass, MatProgressSpinnerModule, BidiModule, OtherRevenueFiltersComponent, MatSelectModule, MatOptionModule]
}) export class OtherRevenueComponent implements OnInit {
  otherRevenue: IOtherRevenue[] = [];
  dataSource: MatTableDataSource<IOtherRevenue>;
  displayedColumns: string[] = [
    'actionDate',
    'branchName',
    'price',
    'amountVisa',
    'description',
    'actions'
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  totalElements: number;
  page: number = 0;
  filters: OtherRevenueFilters = new OtherRevenueFilters();
  width = screen.width;

  public dialog = inject(MatDialog);
  private accountService = inject(AccountsService);
  private translate = inject(TranslateService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private commonService = inject(CommonService);

  ngOnInit(): void {
    this.filters.skipCount = 0;
    this.filters.takeCount = 10;
    this.commonService.fetchRouteFilters().subscribe((params) => {
      if (params) {
        this.filters = { ...params } as OtherRevenueFilters;
        this.page = Math.floor(this.filters.skipCount / this.filters.takeCount);
      }
    });

    this.getOtherRevenue();
  }

  applyFilter() {
    this.commonService.setRouteFilters(this.filters);
    this.getOtherRevenue();
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
    this.getOtherRevenue();
  }

  getOtherRevenue() {
    this.accountService.getOtherRevenue(this.filters).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.otherRevenue = res.data;
        this.totalElements = res.totalCount;
        this.dataSource = new MatTableDataSource(this.otherRevenue);
        this.dataSource.sort = this.sort;
      }
    })
  }

  addRevenue() {
    let data = {} as dialogRevenueData;
    data.type = 'add';
    let dialogRef = this.dialog.open(OtherRevenueFormComponent, {
      maxHeight: '80vh',
      maxWidth: '500px',
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getOtherRevenue();
      }
    });
  }

  editRevenue(currentRevenue: IOtherRevenue) {
    let data = {} as dialogRevenueData;
    data.type = 'edit';
    data.revenue = currentRevenue;
    let dialogRef = this.dialog.open(OtherRevenueFormComponent, {
      maxHeight: '80vh',
      maxWidth: '500px',
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getOtherRevenue();
      }
    });
  }

  onDeleteRevenue(currentRevenue: IOtherRevenue) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxHeight: '80vh',
      data: { mainTitle: this.translate.instant('accounts.msgToDeletedRevenue') },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'yes') {
        this.deleteRevenue(currentRevenue.id);
      }
    });
  }

  deleteRevenue(revenueID: number) {
    this.accountService.deleteRevenue(revenueID).subscribe({
      next: (res) => {
        if (res) {
          this.getOtherRevenue();
        }
      }
    });
  }

  changePaymentBranch(currentRevenue: IOtherRevenue) {
    let data: dialogChangePaymentBranchData = {} as dialogChangePaymentBranchData;
    data.branchId = currentRevenue.branchId;
    data.contextId = currentRevenue.id;
    data.contextTypeId = ContextType.OTHERREVENUE;

    const downDialogRef = this.dialog.open(ChangePaymentBranchComponent, {
      maxHeight: '80vh',
      width: '500px',
      data: data,
      autoFocus: false
    });
    downDialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getOtherRevenue();
      }
    });
  }


}
