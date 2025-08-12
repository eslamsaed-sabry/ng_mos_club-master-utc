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
import { AdvancesFormComponent } from './advances-form/advances-form.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { RoleAttrDirective } from '../../../directives/role-attr.directive';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RoleDirective } from '../../../directives/role.directive';
import { MatOptionModule } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { dialogChangePaymentBranchData } from 'src/app/models/member.model';
import { ChangePaymentBranchComponent } from 'src/app/shared/change-payment-branch/change-payment-branch.component';
import { StaffFinancialPrintReceiptComponent } from '../staff-financial-print-receipt/staff-financial-print-receipt.component';
import { MemberService } from 'src/app/services/member.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
    selector: 'app-advances',
    templateUrl: './advances.component.html',
    styleUrls: ['./advances.component.scss'],
    imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule, FormsModule, MatSelectModule, MatOptionModule, RoleDirective, MatButtonModule, MatIconModule, MatTableModule, MatSortModule, MatMenuModule, RoleAttrDirective, MatPaginatorModule, DatePipe, TranslateModule]
})
export class AdvancesComponent implements OnInit {
  advances: IFinancial[] = [];
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

  public dialog = inject(MatDialog);
  private translate = inject(TranslateService);
  private accountService = inject(AccountsService);
  private commonService = inject(CommonService);
  private memberService = inject(MemberService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.filters.skipCount = 0;
    this.filters.takeCount = 10;
    this.commonService.fetchRouteFilters().subscribe((params) => {
      if (params) {
        this.filters = { ...params } as FinancialFilters;
        this.page = Math.floor(this.filters.skipCount / this.filters.takeCount);
      }
    });

    this.getAdvances();
    this.getStaffMembers();
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
    this.getAdvances();
  }

  getStaffMembers() {
    this.commonService.getLookup(LookupType.Staff).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res: any) => {
        this.staffMembers = res;
      }
    })
  }

  applyFilter() {
    this.commonService.setRouteFilters(this.filters);
    this.getAdvances();
  }

  getAdvances() {
    this.filters.type = Accounts.ADVANCES;
    this.accountService.getFinancial(this.filters).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.advances = res.data;
        this.totalElements = res.totalCount;
        this.dataSource = new MatTableDataSource(this.advances);
        this.dataSource.sort = this.sort;
      }
    })
  }

  addAdvances() {
    let data = {} as dialogFinancialData;
    data.type = 'add';
    let dialogRef = this.dialog.open(AdvancesFormComponent, {
      maxHeight: '80vh',
      maxWidth: '500px',
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getAdvances();
      }
    });
  }

  editAdvances(currentAdvances: IFinancial) {
    let data = {} as dialogFinancialData;
    data.type = 'edit';
    data.financial = currentAdvances;
    let dialogRef = this.dialog.open(AdvancesFormComponent, {
      maxHeight: '80vh',
      maxWidth: '500px',
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getAdvances();
      }
    });
  }

  onDeleteAdvances(currentAdvances: IFinancial) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxHeight: '80vh',
      data: { mainTitle: this.translate.instant('accounts.msgToDeletedAdvance') },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'yes') {
        this.deleteAdvances(currentAdvances.id);
      }
    });
  }

  deleteAdvances(advancesID: number) {
    this.accountService.deleteFinancial(advancesID).subscribe({
      next: (res) => {
        if (res) {
          this.getAdvances();
        }
      }
    });
  }

  changePaymentBranch(currentAdvances: IFinancial) {
    let data: dialogChangePaymentBranchData = {} as dialogChangePaymentBranchData;
    data.branchId = currentAdvances.branchId;
    data.contextId = currentAdvances.id;
    data.contextTypeId = ContextType.STAFFFINANCIAL;

    const downDialogRef = this.dialog.open(ChangePaymentBranchComponent, {
      maxHeight: '80vh',
      width: '500px',
      data: data,
      autoFocus: false
    });
    downDialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getAdvances();
      }
    });
  }

  getReceiptType(currentAdvances: IFinancial) {
    this.memberService.getGymConfig(GymConfig.receiptType).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        currentAdvances.receiptType = res.data;
        this.print(currentAdvances);//Financial
      }
    })
  }

  print(currentAdvances: IFinancial) {
    let dialogRef = this.dialog.open(StaffFinancialPrintReceiptComponent, {
      maxHeight: '90vh',
      width: '700px',
      data: currentAdvances,
      autoFocus: false,
      id: "printable-receipt"
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
}
