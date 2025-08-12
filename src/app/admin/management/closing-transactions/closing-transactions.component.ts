import { DecimalPipe, DatePipe } from '@angular/common';
import { Component, DestroyRef, EventEmitter, Output, TemplateRef, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RoleDirective } from 'src/app/directives/role.directive';
import { IClosingTransactions, dialogClosingTransactionsData } from 'src/app/models/management.model';
import { CommonService } from 'src/app/services/common.service';
import { ManagementService } from 'src/app/services/management.service';
import { ClosingTransactionsFormComponent } from './closing-transactions-form/closing-transactions-form.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-closing-transactions',
    templateUrl: './closing-transactions.component.html',
    styleUrl: './closing-transactions.component.scss',
    imports: [MatFormFieldModule, MatSelectModule, FormsModule, MatOptionModule, MatButtonModule, RoleDirective,
    MatIconModule, MatTableModule, MatSortModule, MatPaginatorModule, DecimalPipe, DatePipe, TranslateModule]
})
export class ClosingTransactionsComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('calculateTotalModal') calculateTotalModal: TemplateRef<any>;
  closingTransactions: IClosingTransactions[] = [];
  dataSource: MatTableDataSource<IClosingTransactions>;
  displayedColumns: string[] = [
    'startDate',
    'closingDate',
    'totalCash',
    'totalVisa',
    'storageOver',
    'creationDate',
    'createdBy'
  ];
  width = screen.width;
  totalElements: number;
  perPage: number = 10;
  page: number = 0;

  calculateTotal: number;

  public dialog = inject(MatDialog);
  private managementService = inject(ManagementService);
  private destroyRef = inject(DestroyRef);


  ngOnInit(): void {
    this.getEndOfDayTransactions();
  }

  getEndOfDayTransactions() {
    this.managementService.getEndOfDayTransactions().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.closingTransactions = res.data;
        this.totalElements = res.totalCount;
        this.dataSource = new MatTableDataSource(this.closingTransactions);
        this.dataSource.sort = this.sort;
      }
    })
  }

  openCalculateTotal() {
    this.managementService.getEndOfDaysTotal().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.dialog.open(this.calculateTotalModal);

        this.calculateTotal = res.data;
      }
    })
  }

  onPaginationChange(e: PageEvent) {
    this.page = e.pageIndex;
    this.perPage = e.pageSize;
    this.getEndOfDayTransactions();
  }

  openTransactionModal() {
    let dialogRef = this.dialog.open(ClosingTransactionsFormComponent, {
      maxHeight: '90vh',
      maxWidth: '700px',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getEndOfDayTransactions();
      }
    });
  }
}
