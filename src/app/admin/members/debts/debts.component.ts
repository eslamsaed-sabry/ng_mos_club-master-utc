import { Installment } from './../../../models/member.model';
import { Component, OnInit, Input, ViewChild, EventEmitter, Output, inject, DestroyRef, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ContextType, GymConfig } from 'src/app/models/enums';
import { DebtsTableFilters, dialogChangePaymentBranchData, dialogMemberInstallmentData, Member } from 'src/app/models/member.model';
import { MemberService } from 'src/app/services/member.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { DebtFormComponent } from './debt-form/debt-form.component';
import { DebtPrintReceiptComponent } from './debt-print-receipt/debt-print-receipt.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { GenderPipe } from '../../../pipes/gender.pipe';
import { RoleAttrDirective } from '../../../directives/role-attr.directive';
import { MatMenuModule } from '@angular/material/menu';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DebtsFiltersComponent } from './debts-filters/debts-filters.component';
import { BidiModule } from '@angular/cdk/bidi';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgClass, DatePipe } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ChangePaymentBranchComponent } from 'src/app/shared/change-payment-branch/change-payment-branch.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonService } from 'src/app/services/common.service';

@Component({
    selector: 'app-debts',
    templateUrl: './debts.component.html',
    styleUrls: ['./debts.component.scss'],
    imports: [MatSidenavModule, NgClass, MatButtonModule, MatIconModule, BidiModule, DebtsFiltersComponent, MatTableModule, MatSortModule, RouterLink, MatMenuModule, RoleAttrDirective, MatPaginatorModule, DatePipe, GenderPipe, TranslateModule]
})
export class DebtsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('phoneModal') phoneModal: TemplateRef<any>;
  @Output() refresh: EventEmitter<any> = new EventEmitter();
  installments: Installment[] = [];
  dataSource: MatTableDataSource<Installment>;
  displayedColumns: string[] = [
    'memberApplicationNo',
    // 'memberCode',
    'memberPhone',
    'memberName',
    'gender',
    'packageName',
    'amount',
    'dueDate',
    'paymentDate',
    'status',
    'salesPersonName',
    'actions'
  ];
  width = screen.width;
  filters: DebtsTableFilters = new DebtsTableFilters();
  totalElements: number;
  phoneModalData: Installment = {} as Installment;
  page: number;

  public dialog = inject(MatDialog);
  private translate = inject(TranslateService);
  private memberService = inject(MemberService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private commonService = inject(CommonService);

  constructor() { }

  ngOnInit(): void {
    this.filters.skipCount = 0;
    this.filters.takeCount = 10;
    this.commonService.fetchRouteFilters().subscribe((params) => {
      if (params) {
        this.filters = { ...params } as DebtsTableFilters;
        this.page = Math.floor(this.filters.skipCount! / this.filters.takeCount!);
      }
    });

    this.getInstallments();
  }

  applyFilter() {
    this.commonService.setRouteFilters(this.filters);
    this.getInstallments();
  }

  onPaginationChange(e: PageEvent) {
    this.page = e.pageIndex;

    this.filters.skipCount = e.pageIndex * this.filters.takeCount!;
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

    this.getInstallments();
  }

  getInstallments() {
    this.memberService.getInstallments(this.filters).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.installments = res.data;
        this.totalElements = res.totalCount;
        this.dataSource = new MatTableDataSource(this.installments);
        this.dataSource.sort = this.sort;
      }
    })
  }

  onDeleteInstallment(installment: Installment) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxHeight: '80vh',
      data: { mainTitle: this.translate.instant('members.msgToDeletedDept') },
      disableClose: true,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'yes') {
        this.deleteInstallment(installment.id);
      }
    });
  }

  deleteInstallment(installmentId: number) {
    this.memberService.deleteInstallment(installmentId).subscribe({
      next: (res) => {
        if (res.statusCode === 200) {
          this.getInstallments();
          this.refresh.emit();
        }
      }
    })
  }

  revertPayment(installmentId: number) {
    this.memberService.revertPayment(installmentId).subscribe({
      next: (res) => {
        if (res.statusCode === 200) {
          this.getInstallments();
          this.refresh.emit();
        }
      }
    })
  }

  editInstallment(installment: Installment, actionType: string) {
    let member = {} as Member;
    member.applicationNo = installment.memberApplicationNo;
    member.code = installment.memberCode;
    member.id = installment.memberId;
    member.nameEng = installment.memberName;
    member.phoneNo = installment.memberPhone;
    let data = {} as dialogMemberInstallmentData;
    data.type = actionType;
    data.memberData = member;
    data.installment = installment;
    // data.installment.isCash = true;

    let dialogRef = this.dialog.open(DebtFormComponent, {
      maxHeight: '80vh',
      width: '700px',
      data: data,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'success') {
        this.getInstallments();
        this.refresh.emit();
      }
    });
  }

  onRevert(installment: Installment) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxHeight: '80vh',
      data: { mainTitle: this.translate.instant('members.msgToDeletedPayOffDebt') },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'yes') {
        this.revertPayment(installment.id);
      }
    });
  }

  print(installment: Installment) {
    let dialogRef = this.dialog.open(DebtPrintReceiptComponent, {
      maxHeight: '90vh',
      width: '700px',
      data: installment,
      autoFocus: false,
      id: "printable-receipt"
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  getReceiptType(installment: Installment) {
    this.memberService.getGymConfig(GymConfig.receiptType).subscribe({
      next: (res) => {
        installment.receiptType = res.data;
        this.print(installment);
      }
    })
  }

  changePaymentBranch(installment: Installment) {
    let data: dialogChangePaymentBranchData = {} as dialogChangePaymentBranchData;
    data.branchId = installment.branchId;
    data.contextId = installment.id;
    data.contextTypeId = ContextType.INSTALLMENT;

    const downDialogRef = this.dialog.open(ChangePaymentBranchComponent, {
      maxHeight: '80vh',
      width: '500px',
      data: data,
      autoFocus: false
    });
    downDialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getInstallments();
      }
    });
  }

  openPhonePopup(installment: Installment) {
    this.phoneModalData = installment;
    this.dialog.open(this.phoneModal, {
      autoFocus: false,
      width: '400px',
    });
  }

}
