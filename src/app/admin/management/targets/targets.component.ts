import { Component, OnInit, ViewChild, TemplateRef, inject, DestroyRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { LookupType, RangePercentageSymbol } from 'src/app/models/enums';
import { ManagementService } from 'src/app/services/management.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatOptionModule } from '@angular/material/core';
import { IDialogTarget, ITarget, RangePercentageFilter } from 'src/app/models/management.model';
import { CommonService } from 'src/app/services/common.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { TargetFormComponent } from './target-form/target-form.component';
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
    selector: 'app-targets',
    templateUrl: './targets.component.html',
    styleUrls: ['./targets.component.scss'],
    providers: [{
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        }, { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }],
    imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule, FormsModule, MatSelectModule, MatOptionModule, RoleDirective, MatButtonModule, MatIconModule, MatTableModule, MatSortModule, MatMenuModule, RoleAttrDirective, MatPaginatorModule, TranslateModule]
})
export class TargetsComponent implements OnInit {
  @ViewChild('targetFormModal') targetFormModal: TemplateRef<any>;
  targets: ITarget[] = [];

  dataSource: MatTableDataSource<ITarget>;
  displayedColumns: string[] = [
    'staffMemberName',
    'targetMonth',
    'targetYear',
    'targetValue',
    'actions'
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  totalElements: number;
  page: number = 0;
  filters: RangePercentageFilter = new RangePercentageFilter();
  staffMembers: any[] = [];
  actionType: string;
  selectedTarget: ITarget;
  staffKind: string[] = ['SalesPerson', 'Coach'];
  public dialog = inject(MatDialog);
  private managementService = inject(ManagementService);
  private common = inject(CommonService);
  private translate = inject(TranslateService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);


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
    this.getTargets();
  }

  applyFilter() {
    this.common.setRouteFilters(this.filters);
    this.getTargets();
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
    this.getTargets();
  }

  getTargets() {
    this.getStaffMembers();
    this.filters.year = new Date(this.filters.fullDate).getFullYear();
    this.filters.month = new Date(this.filters.fullDate).getMonth() + 1;
    this.managementService.getTargets(this.filters).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.targets = res.data;
        this.totalElements = res.totalCount;
        this.dataSource = new MatTableDataSource(this.targets);
        this.dataSource.sort = this.sort;
      }
    })
  }

  getStaffMembers() {
    if (this.filters.symbol === RangePercentageSymbol.SALES_PERSON) {
      this.common.getLookup(LookupType.Sales).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (res: any) => {
          this.staffMembers = res;
        }
      })
    }
    else {
      this.common.getLookup(LookupType.Trainers).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (res: any) => {
          this.staffMembers = res;
        }
      })
    }
  }

  openTargetModal(actionType: string, target: ITarget = {} as ITarget) {

    const data: IDialogTarget = {
      actionType: actionType,
      symbol: this.filters.symbol,
      target: target
    }
    const dialogRef = this.dialog.open(TargetFormComponent, {
      data: data,
      maxWidth: '500px',
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res && res.status === 'success') {
        this.getTargets()
      }
    })
  }

  onDeleteTarget(target: ITarget) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxHeight: '80vh',
      data: { mainTitle: this.translate.instant('members.msgToDeletedTarget') },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'yes') {
        this.deleteTarget(target);
      }
    });
  }

  deleteTarget(target: ITarget) {
    let props: RangePercentageFilter = new RangePercentageFilter();
    props.month = target.targetMonth;
    props.year = target.targetYear;
    props.symbol = this.filters.symbol;
    props.staffMemberId = <any>target.staffMemberId;
    this.managementService.deleteTarget(props).subscribe({
      next: (res) => {
        if (res) {
          this.getTargets();
        }
      }
    });
  }

}
