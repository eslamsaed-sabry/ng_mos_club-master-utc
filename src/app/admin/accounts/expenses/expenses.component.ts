import { Component, OnInit, ViewChild, TemplateRef, inject, DestroyRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { IExpenses, ExpensesFilters, dialogExpensesData, IExpense } from 'src/app/models/accounts.model';
import { AttachmentContextTypeId, ContextType, GymConfig, LookupType } from 'src/app/models/enums';
import { dialogAttachmentData } from 'src/app/models/staff.model';
import { AccountsService } from 'src/app/services/accounts.service';
import { MemberService } from 'src/app/services/member.service';
import { AttachmentModalFormComponent } from 'src/app/shared/attachments/attachment-modal-form/attachment-modal-form.component';
import { AttachmentsComponent } from 'src/app/shared/attachments/attachments.component';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { ExpensesFormComponent } from './expenses-form/expenses-form.component';
import { ExpensesPrintReceiptComponent } from './expenses-print-receipt/expenses-print-receipt.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { AttachmentsComponent as AttachmentsComponent_1 } from '../../../shared/attachments/attachments.component';
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
import { ExpensesFiltersComponent } from './expenses-filters/expenses-filters.component';
import { BidiModule } from '@angular/cdk/bidi';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
@Component({
    selector: 'app-expenses',
    templateUrl: './expenses.component.html',
    styleUrls: ['./expenses.component.scss'],
    imports: [
    MatSidenavModule,
    NgClass,
    MatProgressSpinnerModule,
    BidiModule,
    ExpensesFiltersComponent,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    FormsModule,
    MatSelectModule,
    MatOptionModule,
    RoleDirective,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatMenuModule,
    RoleAttrDirective,
    MatPaginatorModule,
    AttachmentsComponent_1,
    DatePipe,
    TranslateModule
]
})
export class ExpensesComponent implements OnInit {
  @ViewChild('attachmentsModal') attachmentsModal: TemplateRef<any>;
  @ViewChild('attachmentsComp') attachmentsComp: AttachmentsComponent;
  expenses: IExpenses[] = [];
  dataSource: MatTableDataSource<IExpenses>;
  displayedColumns: string[] = [
    'actionDate',
    'typeName',
    'price',
    'amountVisa',
    'description',
    'actions'
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  totalElements: number;
  page: number = 0;
  filters: ExpensesFilters = new ExpensesFilters();
  selectedExpenses: IExpenses = {} as IExpenses;
  contextTypeId = AttachmentContextTypeId.EXPENSES;
  width = screen.width;

  public dialog = inject(MatDialog);
  private accountService = inject(AccountsService);
  private memberService = inject(MemberService);
  private translate = inject(TranslateService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private commonService = inject(CommonService);

  ngOnInit(): void {
    this.filters.skipCount = 0;
    this.filters.takeCount = 10;
    this.commonService.fetchRouteFilters().subscribe((params) => {
      if (params) {
        this.filters = { ...params } as ExpensesFilters;
        this.page = Math.floor(this.filters.skipCount / this.filters.takeCount);
      }
    });
    this.getExpenses();
  }

  applyFilter() {
    this.commonService.setRouteFilters(this.filters);
    this.getExpenses();
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
    this.getExpenses();
  }


  getExpenses() {
    console.log(this.filters);

    this.accountService.getExpenses(this.filters).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.expenses = res.data;
        this.totalElements = res.totalCount;
        this.dataSource = new MatTableDataSource(this.expenses);
        this.dataSource.sort = this.sort;
      }
    })
  }

  addExpenses() {
    let data = {} as dialogExpensesData;
    data.type = 'add';
    let dialogRef = this.dialog.open(ExpensesFormComponent, {
      maxHeight: '80vh',
      maxWidth: '500px',
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getExpenses();
      }
    });
  }

  editExpenses(currentExpenses: IExpenses) {
    let data = {} as dialogExpensesData;
    data.type = 'edit';
    data.revenue = currentExpenses;
    let dialogRef = this.dialog.open(ExpensesFormComponent, {
      maxHeight: '80vh',
      maxWidth: '500px',
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getExpenses();
      }
    });
  }

  onDeleteExpenses(currentExpenses: IExpenses) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxHeight: '80vh',
      data: { mainTitle: this.translate.instant('accounts.msgToDeletedExpenses') },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'yes') {
        this.deleteExpenses(currentExpenses.id);
      }
    });
  }

  deleteExpenses(expenseID: number) {
    this.accountService.deleteExpenses(expenseID).subscribe({
      next: (res) => {
        if (res) {
          this.getExpenses();
        }
      }
    });
  }


  getReceiptType(expenses: IExpenses) {
    this.memberService.getGymConfig(GymConfig.receiptType).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        expenses.receiptType = res.data;
        this.print(expenses);
      }
    })
  }

  print(expenses: IExpenses) {
    let dialogRef = this.dialog.open(ExpensesPrintReceiptComponent, {
      maxHeight: '90vh',
      width: '700px',
      data: expenses,
      autoFocus: false,
      id: "printable-receipt"
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  onAttachments(expenses: IExpenses) {
    this.selectedExpenses = expenses;
    this.dialog.open(this.attachmentsModal, {
      width: '800px',
      autoFocus: false
    });
  }

  addAttachment(expenses: IExpenses) {
    let data: dialogAttachmentData = {} as dialogAttachmentData;
    data.contextId = expenses.id;
    data.contextTypeId = this.contextTypeId
    let dialogRef = this.dialog.open(AttachmentModalFormComponent, {
      maxHeight: '80vh',
      width: '300px',
      data: data,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.attachmentsComp.getAttachments();
      }
    });
  }

  changePaymentBranch(expenses: IExpenses) {
    let data: dialogChangePaymentBranchData = {} as dialogChangePaymentBranchData;
    data.branchId = expenses.branchId;
    data.contextId = expenses.id;
    data.contextTypeId = ContextType.EXPENSE;

    const downDialogRef = this.dialog.open(ChangePaymentBranchComponent, {
      maxHeight: '80vh',
      width: '500px',
      data: data,
      autoFocus: false
    });
    downDialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getExpenses();
      }
    });
  }

}
