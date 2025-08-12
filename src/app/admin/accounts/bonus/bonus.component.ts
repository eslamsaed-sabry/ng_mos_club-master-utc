import { Component, DestroyRef, OnInit, ViewChild, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { IFinancial, FinancialFilters, dialogFinancialData } from 'src/app/models/accounts.model';
import { Accounts, ContextType, GymConfig, LookupType } from 'src/app/models/enums';
import { AccountsService } from 'src/app/services/accounts.service';
import { CommonService } from 'src/app/services/common.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { BonusFormComponent } from './bonus-form/bonus-form.component';
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
import { dialogChangePaymentBranchData } from 'src/app/models/member.model';
import { ChangePaymentBranchComponent } from 'src/app/shared/change-payment-branch/change-payment-branch.component';
import { BonusFiltersComponent } from './bonus-filters/bonus-filters.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BidiModule } from '@angular/cdk/bidi';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MemberService } from 'src/app/services/member.service';
import { StaffFinancialPrintReceiptComponent } from '../staff-financial-print-receipt/staff-financial-print-receipt.component';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
    selector: 'app-bonus',
    templateUrl: './bonus.component.html',
    styleUrls: ['./bonus.component.scss'],
    imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule, FormsModule, MatSelectModule, MatOptionModule, RoleDirective, MatButtonModule, MatIconModule, MatTableModule, MatSortModule, MatMenuModule, RoleAttrDirective, MatPaginatorModule, DatePipe, TranslateModule, MatSidenavModule, NgClass, MatProgressSpinnerModule, BidiModule, BonusFiltersComponent]
})
export class BonusComponent implements OnInit {
  bonus: IFinancial[] = [];
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
  staffMembers: any[] = [];
  width = screen.width;

  public dialog = inject(MatDialog);
  private accountService = inject(AccountsService);
  private translate = inject(TranslateService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private memberService = inject(MemberService);
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
    this.getBonus();
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
    this.getBonus();
  }

  applyFilter() {
    this.commonService.setRouteFilters(this.filters);
    this.getBonus();
  }

  getBonus() {
    this.filters.type = Accounts.BONUS;
    this.accountService.getFinancial(this.filters).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.bonus = res.data;
        this.totalElements = res.totalCount;
        this.dataSource = new MatTableDataSource(this.bonus);
        this.dataSource.sort = this.sort;
      }
    })
  }

  addBonus() {
    let data = {} as dialogFinancialData;
    data.type = 'add';
    let dialogRef = this.dialog.open(BonusFormComponent, {
      maxHeight: '80vh',
      maxWidth: '500px',
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getBonus();
      }
    });
  }

  editBonus(currentBonus: IFinancial) {
    let data = {} as dialogFinancialData;
    data.type = 'edit';
    data.financial = currentBonus;
    let dialogRef = this.dialog.open(BonusFormComponent, {
      maxHeight: '80vh',
      maxWidth: '500px',
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getBonus();
      }
    });
  }

  onDeleteBonus(currentBonus: IFinancial) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxHeight: '80vh',
      data: { mainTitle: this.translate.instant('accounts.msgToDeletedBonus') },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'yes') {
        this.deleteBonus(currentBonus.id);
      }
    });
  }

  deleteBonus(bonusID: number) {
    this.accountService.deleteFinancial(bonusID).subscribe({
      next: (res) => {
        if (res) {
          this.getBonus();
        }
      }
    });
  }

  changePaymentBranch(currentBonus: IFinancial) {
    let data: dialogChangePaymentBranchData = {} as dialogChangePaymentBranchData;
    data.branchId = currentBonus.branchId;
    data.contextId = currentBonus.id;
    data.contextTypeId = ContextType.STAFFFINANCIAL;

    const downDialogRef = this.dialog.open(ChangePaymentBranchComponent, {
      maxHeight: '80vh',
      width: '500px',
      data: data,
      autoFocus: false
    });
    downDialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getBonus();
      }
    });
  }

  getReceiptType(currentBonus: IFinancial) {
    this.memberService.getGymConfig(GymConfig.receiptType).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        currentBonus.receiptType = res.data;
        this.print(currentBonus);//Financial
      }
    })
  }

  print(currentBonus: IFinancial) {
    let dialogRef = this.dialog.open(StaffFinancialPrintReceiptComponent, {
      maxHeight: '90vh',
      width: '700px',
      data: currentBonus,
      autoFocus: false,
      id: "printable-receipt"
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
}
