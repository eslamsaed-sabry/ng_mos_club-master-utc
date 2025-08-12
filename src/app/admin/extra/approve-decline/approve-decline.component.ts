import { Component, OnInit, ViewChild, EventEmitter, Output, inject, DestroyRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ContextType } from 'src/app/models/enums';
import { IDialogReceiptModal, IApproveDecline } from 'src/app/models/extra.model';
import { ExtraService } from 'src/app/services/extra.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { ReceiptModalsComponent } from '../receipts/receipt-modals/receipt-modals.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { UpgradeStatusPipe } from '../../../pipes/upgrade-status.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgClass } from '@angular/common';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonService } from 'src/app/services/common.service';

class DataFilters {
  type: number;
  statusId: number;
  skip: number;
  take: number
}

@Component({
  selector: 'app-approve-decline',
  templateUrl: './approve-decline.component.html',
  styleUrls: ['./approve-decline.component.scss'],
  imports: [MatFormFieldModule, MatSelectModule, FormsModule, MatOptionModule, MatTableModule, MatSortModule, NgClass, MatButtonModule, MatIconModule, MatPaginatorModule, TranslateModule, UpgradeStatusPipe]
})
export class ApproveDeclineComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Output() refresh: EventEmitter<any> = new EventEmitter();
  dataList: IApproveDecline[] = [];
  dataSource: MatTableDataSource<IApproveDecline>;
  displayedColumns: string[] = [
    'notes',
    'price',
    'cashAmount',
    'visaAmount',
    'approveStatus',
    'approve'
  ];
  width = screen.width;
  filters: DataFilters = new DataFilters();
  totalElements: number;
  page: number = 0;
  modalTitle: string;
  receiptTypes = ContextType;
  data: any;

  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  public dialog = inject(MatDialog);
  private extraService = inject(ExtraService);
  private translate = inject(TranslateService);
  private route = inject(ActivatedRoute);
  private commonService = inject(CommonService);

  ngOnInit(): void {
    this.filters.skip = 0;
    this.filters.take = 10;
    this.commonService.fetchRouteFilters().subscribe((params) => {
      if (params) {
        this.filters = { ...params } as DataFilters;
        this.page = Math.floor(this.filters.skip / this.filters.take);
      }
    });

    this.getList();
  }

  applyFilter() {
    this.commonService.setRouteFilters(this.filters);
    this.getList();
  }

  onClickRow(receipt: IApproveDecline) {
    if (receipt.contextType === ContextType.REFUND) {
      this.getMembership(receipt.membershipId);
    } else {
      this.openModal(receipt.id, receipt.contextType, receipt.approveStatus);
    }
  }

  openModal(contextId: number, contextTypeId: number, approveStatus: number) {
    let data = {} as IDialogReceiptModal;
    data.contextId = contextId;
    data.contextTypeId = contextTypeId;
    data.approveStatus = approveStatus;

    let dialogRef = this.dialog.open(ReceiptModalsComponent, {
      maxHeight: '80vh',
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.status === 'yes') {
        this.getList();
      }
    });
  }

  getMembership(contextId: number) {
    this.router.navigate(['/admin/form/membership/edit'], {
      queryParams: { id: contextId }
    })
  }

  onPaginationChange(e: PageEvent) {
    this.page = e.pageIndex;
    this.filters.skip = e.pageIndex * this.filters.take;
    this.filters.take = e.pageSize;
    this.router.navigate([], {
      queryParams: {
        skip: this.filters.skip,
        take: this.filters.take,
        page: this.page
      },
      queryParamsHandling: 'merge'
    });
    this.commonService.setRouteFilters(this.filters);
    this.getList();
  }

  getList() {
    this.extraService.getApproveDeclineList(this.filters).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.dataList = res.data;
        this.totalElements = res.totalCount;
        this.dataSource = new MatTableDataSource(this.dataList);
        this.dataSource.sort = this.sort;
      }
    })
  }

  onApprove(event: any, row: IApproveDecline) {
    event.stopPropagation();
    event.preventDefault();
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxHeight: '80vh',
      data: { mainTitle: this.translate.instant('extra.msgToApproveRecord') },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'yes') {
        this.approve(row);
      }
    });
  }
  onReject(event: any, row: IApproveDecline) {
    event.stopPropagation();
    event.preventDefault();
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxHeight: '80vh',
      data: { mainTitle: this.translate.instant('extra.msgToRejectRecord') },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'yes') {
        this.reject(row);
      }
    });
  }

  approve(row: IApproveDecline) {
    if (row.approveStatus == 1) {
      this.extraService.finalApprove(row.contextType, row.id).subscribe({
        next: (res) => {
          this.getList();
        }
      });
    } else {
      this.extraService.approve(row.contextType, row.id).subscribe({
        next: (res) => {
          this.getList();
        }
      });
    }
  };
  reject(row: IApproveDecline) {
    this.extraService.reject(row.contextType, row.id).subscribe({
      next: (res) => {
        this.getList();
      }
    });
  };

  onFilterChange() {
    this.page = 0;
    this.filters.skip = 0 * this.filters.take;

    this.getList();
  }
}
