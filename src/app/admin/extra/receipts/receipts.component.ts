import { Component, OnInit, ViewChild, EventEmitter, Output, inject, DestroyRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ContextType } from 'src/app/models/enums';
import { IDialogReceiptModal, IReceipt, Receipt } from 'src/app/models/extra.model';
import { ExtraService } from 'src/app/services/extra.service';
import { ReceiptModalsComponent } from './receipt-modals/receipt-modals.component';
import { TranslateModule } from '@ngx-translate/core';
import { ReceiptFiltersComponent } from './receipt-filters/receipt-filters.component';
import { BidiModule } from '@angular/cdk/bidi';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgClass, DatePipe } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonService } from 'src/app/services/common.service';
@Component({
    selector: 'app-receipts',
    templateUrl: './receipts.component.html',
    styleUrls: ['./receipts.component.scss'],
    imports: [MatSidenavModule, NgClass, MatButtonModule, MatIconModule, BidiModule, ReceiptFiltersComponent, MatTableModule, MatSortModule, MatPaginatorModule, DatePipe, TranslateModule]
})
export class ReceiptsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Output() refresh: EventEmitter<any> = new EventEmitter();
  receipts: IReceipt[] = [];
  dataSource: MatTableDataSource<IReceipt>;
  displayedColumns: string[] = [
    'serialNo',
    'manualNo',
    'contextType',
    'paymentDate',
    'cashAmount',
    'visaAmount'
  ];
  width = screen.width;
  filters: Receipt = new Receipt();
  totalElements: number;
  page: number;
  modalTitle: string;
  receiptTypes = ContextType;
  data: any;

  public dialog = inject(MatDialog);
  private extraService = inject(ExtraService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private commonService = inject(CommonService);

  constructor() { }

  ngOnInit(): void {
    this.filters.skip = 0;
    this.filters.take = 10;
    this.commonService.fetchRouteFilters().subscribe((params) => {
      if (params) {
        this.filters = { ...params } as Receipt;
        this.page = Math.floor(this.filters.skip / this.filters.take);
      }
    });

    this.getReceipts();
  }

  applyFilter() {
    this.commonService.setRouteFilters(this.filters);
    this.getReceipts();
  }

  onClickRow(receipt: IReceipt) {
    // if (receipt.contextTypeId === ContextType.MEMBERSHIP || receipt.contextTypeId === ContextType.PRIVATE) {
    //   this.getMembership(receipt.contextId);
    // } else {
    this.openModal(receipt.contextId, receipt.contextTypeId);
    // }
  }

  openModal(contextId: number, contextTypeId: number) {
    let data = {} as IDialogReceiptModal;
    data.contextId = contextId;
    data.contextTypeId = contextTypeId;
    this.dialog.open(ReceiptModalsComponent, {
      maxHeight: '80vh',
      data: data,
    });
  }

  // getMembership(contextId: number) {
  //   let member = {} as Member;
  //   member.membership = <any>{};
  //   member.membership.id = contextId;
  //   let data = {} as any;
  //   data.type = 'editMembership';
  //   data.memberData = member;
  //   data.selectedTab = 'membership';

  //   this.dialog.open(MemberFormComponent, {
  //     maxHeight: '80vh',
  //     width: '900px',
  //     data: data,
  //   });
  // }

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
    this.getReceipts();
  }

  getReceipts() {
    this.extraService.getReceipts(this.filters).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.receipts = res.data;
        this.totalElements = res.totalCount;
        this.dataSource = new MatTableDataSource(this.receipts);
        this.dataSource.sort = this.sort;
      }
    })
  }
}
