import { Component, DestroyRef, OnInit, ViewChild, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { IFinancial, FinancialFilters, dialogFinancialData } from 'src/app/models/accounts.model';
import { Accounts, GymConfig, LookupType } from 'src/app/models/enums';
import { AccountsService } from 'src/app/services/accounts.service';
import { CommonService } from 'src/app/services/common.service';
import { StaffService } from 'src/app/services/staff.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { DeductionFormComponent } from './deduction-form/deduction-form.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { RoleAttrDirective } from '../../../directives/role-attr.directive';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RoleDirective } from '../../../directives/role.directive';
import { MatOptionModule } from '@angular/material/core';
import { DatePipe, NgClass } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BidiModule } from '@angular/cdk/bidi';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DeductionFiltersComponent } from './deduction-filters/deduction-filters.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MemberService } from 'src/app/services/member.service';
import { StaffFinancialPrintReceiptComponent } from '../staff-financial-print-receipt/staff-financial-print-receipt.component';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
    selector: 'app-deductions',
    templateUrl: './deductions.component.html',
    styleUrls: ['./deductions.component.scss'],
    imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule, FormsModule, MatSelectModule, MatOptionModule, RoleDirective, MatButtonModule, MatIconModule, MatTableModule, MatSortModule, MatMenuModule, RoleAttrDirective, MatPaginatorModule, DatePipe, TranslateModule, MatSidenavModule, NgClass, MatProgressSpinnerModule, BidiModule, DeductionFiltersComponent]
})
export class DeductionsComponent implements OnInit {
  deductions: IFinancial[] = [];
  dataSource: MatTableDataSource<IFinancial>;
  displayedColumns: string[] = [
    'actionDate',
    'staffMemberName',
    'price',
    'description',
    'actions'
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  totalElements: number;
  page: number = 0;
  filters: FinancialFilters = new FinancialFilters();
  width = screen.width;

  public dialog = inject(MatDialog);
  private translate = inject(TranslateService);
  private accountService = inject(AccountsService);
  private memberService = inject(MemberService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private commonService = inject(CommonService);

  ngOnInit(): void {
    this.filters.skipCount = 0;
    this.filters.takeCount = 10;
    this.commonService.fetchRouteFilters().subscribe((params) => {
      if (params) {
        this.filters = { ...params } as FinancialFilters;
        this.page = Math.floor(this.filters.skipCount / this.filters.takeCount);
      }
    });
    this.getDeductions();
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
    this.getDeductions();
  }

  applyFilter() {
    this.commonService.setRouteFilters(this.filters);
    this.getDeductions();
  }

  getDeductions() {
    this.filters.type = Accounts.DEDUCTIONS;
    this.accountService.getFinancial(this.filters).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.deductions = res.data;
        this.totalElements = res.totalCount;
        this.dataSource = new MatTableDataSource(this.deductions);
        this.dataSource.sort = this.sort;
      }
    })
  }

  addDeductions() {
    let data = {} as dialogFinancialData;
    data.type = 'add';
    let dialogRef = this.dialog.open(DeductionFormComponent, {
      maxHeight: '80vh',
      maxWidth: '500px',
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getDeductions();
      }
    });
  }

  editDeductions(currentDeductions: IFinancial) {
    let data = {} as dialogFinancialData;
    data.type = 'edit';
    data.financial = currentDeductions;
    let dialogRef = this.dialog.open(DeductionFormComponent, {
      maxHeight: '80vh',
      maxWidth: '500px',
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getDeductions();
      }
    });
  }

  getReceiptType(currentDeductions: IFinancial) {
    this.memberService.getGymConfig(GymConfig.receiptType).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        currentDeductions.receiptType = res.data;
        this.print(currentDeductions);//Financial
      }
    })
  }

  print(currentDeductions: IFinancial) {
    let dialogRef = this.dialog.open(StaffFinancialPrintReceiptComponent, {
      maxHeight: '90vh',
      width: '700px',
      data: currentDeductions,
      autoFocus: false,
      id: "printable-receipt"
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  onDeleteDeductions(currentDeductions: IFinancial) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxHeight: '80vh',
      data: { mainTitle: this.translate.instant('accounts.msgToDeletedDeduction') },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'yes') {
        this.deleteDeductions(currentDeductions.id);
      }
    });
  }

  deleteDeductions(deductionID: number) {
    this.accountService.deleteFinancial(deductionID).subscribe({
      next: (res) => {
        if (res) {
          this.getDeductions();
        }
      }
    });
  }

}
