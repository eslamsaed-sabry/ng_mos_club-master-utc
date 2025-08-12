import { Component, DestroyRef, OnInit, ViewChild, inject } from '@angular/core';
import { Accounts, GymConfig, LookupType } from 'src/app/models/enums';
import { EmployeesCommissionsFormComponent } from './employees-commissions-form/employees-commissions-form.component';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { IFinancial, FinancialFilters, dialogFinancialData } from 'src/app/models/accounts.model';
import { AccountsService } from 'src/app/services/accounts.service';
import { CommonService } from 'src/app/services/common.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
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
import { EmployeeCommissionFiltersComponent } from './employee-commission-filters/employee-commission-filters.component';
import { BidiModule } from '@angular/cdk/bidi';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MemberService } from 'src/app/services/member.service';
import { StaffFinancialPrintReceiptComponent } from '../staff-financial-print-receipt/staff-financial-print-receipt.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-employees-commissions',
    templateUrl: './employees-commissions.component.html',
    styleUrls: ['./employees-commissions.component.scss'],
    imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule, FormsModule, MatSelectModule, MatOptionModule, RoleDirective, MatButtonModule, MatIconModule, MatTableModule, MatSortModule, MatMenuModule, RoleAttrDirective, MatPaginatorModule, DatePipe, TranslateModule, MatSidenavModule, NgClass, MatProgressSpinnerModule, BidiModule, EmployeeCommissionFiltersComponent]
})
export class EmployeesCommissionsComponent implements OnInit {
  employeesCommissions: IFinancial[] = [];
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
    this.getEmployeesCommissions();
  }

  applyFilter() {
    this.commonService.setRouteFilters(this.filters);
    this.getEmployeesCommissions();
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
    this.getEmployeesCommissions();
  }

  getEmployeesCommissions() {
    this.filters.type = Accounts.EMPLOYEES_COMMISSIONS;
    this.accountService.getFinancial(this.filters).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.employeesCommissions = res.data;
        this.totalElements = res.totalCount;
        this.dataSource = new MatTableDataSource(this.employeesCommissions);
        this.dataSource.sort = this.sort;
      }
    })
  }

  addEmployeesCommissions() {
    let data = {} as dialogFinancialData;
    data.type = 'add';
    let dialogRef = this.dialog.open(EmployeesCommissionsFormComponent, {
      maxHeight: '80vh',
      maxWidth: '500px',
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getEmployeesCommissions();
      }
    });
  }

  editEmployeesCommissions(currentEmployeesCommissions: IFinancial) {
    let data = {} as dialogFinancialData;
    data.type = 'edit';
    data.financial = currentEmployeesCommissions;
    let dialogRef = this.dialog.open(EmployeesCommissionsFormComponent, {
      maxHeight: '80vh',
      maxWidth: '500px',
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getEmployeesCommissions();
      }
    });
  }

  onDeleteEmployeesCommissions(currentEmployeesCommissions: IFinancial) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxHeight: '80vh',
      data: { mainTitle: this.translate.instant('accounts.msgToDeletedEmployeesCommissions') },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'yes') {
        this.deleteEmployeesCommissions(currentEmployeesCommissions.id);
      }
    });
  }

  deleteEmployeesCommissions(employeesCommissionsID: number) {
    this.accountService.deleteFinancial(employeesCommissionsID).subscribe({
      next: (res) => {
        if (res) {
          this.getEmployeesCommissions();
        }
      }
    });
  }

  getReceiptType(currentEmployeesCommissions: IFinancial) {
    this.memberService.getGymConfig(GymConfig.receiptType).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        currentEmployeesCommissions.receiptType = res.data;
        this.print(currentEmployeesCommissions);//Financial
      }
    })
  }

  print(currentEmployeesCommissions: IFinancial) {
    let dialogRef = this.dialog.open(StaffFinancialPrintReceiptComponent, {
      maxHeight: '90vh',
      width: '700px',
      data: currentEmployeesCommissions,
      autoFocus: false,
      id: "printable-receipt"
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

}

