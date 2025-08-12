
import { RangesFormComponent } from './ranges-form/ranges-form.component';
import { Component, OnInit, ViewChild, TemplateRef, inject, DestroyRef } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { IDialogRange, IRange, RangePercentageFilter } from 'src/app/models/management.model';
import { ManagementService } from 'src/app/services/management.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RoleDirective } from '../../../directives/role.directive';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleAttrDirective } from 'src/app/directives/role-attr.directive';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonService } from 'src/app/services/common.service';


@Component({
    selector: 'app-ranges',
    templateUrl: './ranges.component.html',
    styleUrls: ['./ranges.component.scss'],
    imports: [RoleDirective, MatButtonModule, MatIconModule, MatTableModule, MatSortModule, MatMenuModule, MatPaginatorModule, FormsModule, MatFormFieldModule, MatInputModule, TranslateModule]
})
export class RangesComponent implements OnInit {
  @ViewChild('rangeFormModal') rangeFormModal: TemplateRef<any>;
  ranges: IRange[] = [];
  dataSource: MatTableDataSource<IRange>;
  displayedColumns: string[] = [
    'rangeFrom',
    'rangeTo',
    'actions'
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  totalElements: number;
  page: number = 0;
  selectedRange: IRange = {} as IRange;
  actionType: string;
  filters: RangePercentageFilter = new RangePercentageFilter();

  public dialog = inject(MatDialog);
  private managementService = inject(ManagementService);
  private translate = inject(TranslateService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private commonService = inject(CommonService);

  constructor() { }

  ngOnInit(): void {
    this.filters.symbol = this.route.snapshot.data['dataType'];
    this.filters.skipCount = 0;
    this.filters.takeCount = 10;
    this.commonService.fetchRouteFilters().subscribe((params) => {
      if (params) {
        this.filters = { ...params } as RangePercentageFilter;
        this.page = Math.floor(this.filters.skipCount / this.filters.takeCount);
      }
    });
    this.getRanges();
  }

  applyFilter() {
    this.commonService.setRouteFilters(this.filters);
    this.getRanges();
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
    this.getRanges();
  }

  getRanges() {
    this.managementService.getRanges(this.filters.symbol).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.ranges = res.data;
        this.totalElements = res.totalCount;
        this.dataSource = new MatTableDataSource(this.ranges);
        this.dataSource.sort = this.sort;
      }
    })
  }

  openRangeModal(actionType: string, range: IRange = {} as IRange) {
    const data: IDialogRange = {
      actionType: actionType,
      symbol: this.filters.symbol,
      range: range
    }
    const dialogRef = this.dialog.open(RangesFormComponent, {
      data: data,
      maxWidth: '500px',
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res && res.status === 'success') {
        this.getRanges()
      }
    })

  }

  onDeleteRange(range: IRange) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxHeight: '80vh',
      data: { mainTitle: this.translate.instant('management.msgToDeletedRange') },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'yes') {
        this.deleteRange(range.id);
      }
    });
  }

  deleteRange(rangeID: number) {
    this.managementService.deleteRange(rangeID).subscribe({
      next: (res) => {
        if (res) {
          this.getRanges();
        }
      }
    });
  }

}
