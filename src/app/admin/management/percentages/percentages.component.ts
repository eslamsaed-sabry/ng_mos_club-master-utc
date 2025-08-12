import { Component, DestroyRef, inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { LookupType, RangePercentageSymbol } from 'src/app/models/enums';
import { dialogRangePercentageData, IRangePercentage, RangePercentageFilter } from 'src/app/models/management.model';
import { ManagementService } from 'src/app/services/management.service';
import { StaffService } from 'src/app/services/staff.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { RangePercentageFormComponent } from './range-percentage-form/range-percentage-form.component';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatOptionModule } from '@angular/material/core';
import { CommonService } from 'src/app/services/common.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { RoleAttrDirective } from '../../../directives/role-attr.directive';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RoleDirective } from '../../../directives/role.directive';

import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
    selector: 'app-percentages',
    templateUrl: './percentages.component.html',
    styleUrls: ['./percentages.component.scss'],
    providers: [{
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        }, { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }],
    imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule, FormsModule, MatSelectModule, MatOptionModule, RoleDirective, MatButtonModule, MatIconModule, MatTableModule, MatSortModule, MatMenuModule, RoleAttrDirective, MatPaginatorModule, TranslateModule]
})
export class PercentagesComponent implements OnInit {
  percentages: IRangePercentage[] = [];
  dataSource: MatTableDataSource<IRangePercentage>;
  displayedColumns: string[] = [
    'staffMemberName',
    'percentageMonth',
    'percentageYear',
    'concatenatedPercentages',
    'actions'
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  totalElements: number;
  page: number = 0;

  filters: RangePercentageFilter = new RangePercentageFilter();
  staffMembers: any[] = [];

  public dialog = inject(MatDialog);
  private managementService = inject(ManagementService);
  private common = inject(CommonService);
  private translate = inject(TranslateService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  constructor() { }

  ngOnInit(): void {
    this.filters.symbol = this.route.snapshot.data['dataType'];
    this.filters.skipCount = 0;
    this.filters.takeCount = 10;

    this.common.fetchRouteFilters().subscribe((params) => {
      if (params) {
        this.filters = { ...params } as RangePercentageFilter;
        this.page = Math.floor(this.filters.skipCount / this.filters.takeCount);
      }
    });
    this.getPercentages();
  }

  applyFilter() {
    this.common.setRouteFilters(this.filters);
    this.getPercentages();
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
    this.common.setRouteFilters(this.filters);
    this.getPercentages();
  }

  getStaffMembers() {
    this.common.getLookup(LookupType.Staff).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res: any) => {
        this.staffMembers = res;
      }
    })
  }


  getPercentages() {
    if (this.filters.symbol === RangePercentageSymbol.SALES_PERSON) {
      this.getSalesPerson();
    }
    else {
      this.getTrainer();
    }
    this.filters.year = new Date(this.filters.fullDate).getFullYear();
    this.filters.month = new Date(this.filters.fullDate).getMonth() + 1;

    this.managementService.getStaffRangePercentages(this.filters).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.percentages = res.data;
        this.totalElements = res.totalCount;
        this.dataSource = new MatTableDataSource(this.percentages);
        this.dataSource.sort = this.sort;
      }
    })
  }

  getSalesPerson() {
    this.common.getLookup(LookupType.Sales).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res: any) => {
        this.staffMembers = res;
      }
    })
  }

  getTrainer() {
    this.common.getLookup(LookupType.Trainers).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res: any) => {
        this.staffMembers = res;
      }
    })
  }

  addPercentage() {
    let data = {} as dialogRangePercentageData;
    data.type = 'add';
    data.symbol = this.filters.symbol;
    let dialogRef = this.dialog.open(RangePercentageFormComponent, {
      maxHeight: '80vh',
      maxWidth: '500px',
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getPercentages();
      }
    });
  }

  editPercentage(currentPercentage: IRangePercentage) {
    let data = {} as dialogRangePercentageData;
    data.type = 'edit';
    data.percentage = currentPercentage;
    data.symbol = this.filters.symbol;
    let dialogRef = this.dialog.open(RangePercentageFormComponent, {
      maxHeight: '80vh',
      maxWidth: '500px',
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getPercentages();
      }
    });
  }

  onDeletePercentage(percentage: IRangePercentage) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxHeight: '80vh',
      data: { mainTitle: this.translate.instant('management.msgToDeletedRangePercentage') },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'yes') {
        this.deletePercentage(percentage);
      }
    });
  }

  deletePercentage(percentage: IRangePercentage) {
    let props: RangePercentageFilter = new RangePercentageFilter();
    props.month = percentage.percentageMonth;
    props.staffMemberId = percentage.staffMemberId;
    props.year = percentage.percentageYear;
    props.symbol = this.filters.symbol;
    props.staffMemberId = percentage.staffMemberId;
    this.managementService.deleteRangePercentage(props).subscribe({
      next: (res) => {
        if (res) {
          this.getPercentages();
        }
      }
    });
  }



}
