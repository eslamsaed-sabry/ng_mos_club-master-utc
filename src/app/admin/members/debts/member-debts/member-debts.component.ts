import { Component, OnInit, Input, ViewChild, EventEmitter, Output, inject, DestroyRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { GymConfig } from 'src/app/models/enums';
import { DebtsTableFilters, dialogMemberInstallmentData, Installment, Member } from 'src/app/models/member.model';
import { MemberService } from 'src/app/services/member.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { DebtFormComponent } from '../debt-form/debt-form.component';
import { DebtPrintReceiptComponent } from '../debt-print-receipt/debt-print-receipt.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GenderPipe } from '../../../../pipes/gender.pipe';
import { RoleAttrDirective } from '../../../../directives/role-attr.directive';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-member-debts',
    templateUrl: './member-debts.component.html',
    styleUrls: ['./member-debts.component.scss'],
    imports: [MatFormFieldModule, MatIconModule, MatInputModule, MatTableModule, MatSortModule, NgClass, MatButtonModule, MatMenuModule, RoleAttrDirective, MatPaginatorModule, GenderPipe, TranslateModule]
})
export class MemberDebtsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Output() refresh: EventEmitter<any> = new EventEmitter();
  @Input() membershipId: number;
  @Input() hideSearch: boolean;
  @Input() member: Member;
  installments: Installment[] = [];
  dataSource: MatTableDataSource<Installment>;
  displayedColumns: string[] = [
    // 'memberApplicationNo',
    // 'memberCode',
    // 'memberPhone',
    // 'memberName',
    // 'gender',
    'packageName',
    'amount',
    'dueDateAsString',
    'paymentDate',
    'status',
    'salesPersonName',
    'actions'
  ];
  route = inject(ActivatedRoute);
  destroyRef = inject(DestroyRef);
  selectedId: number;
  constructor(public dialog: MatDialog, private memberService: MemberService, private translate: TranslateService) { }

  ngOnInit(): void {
    this.getInstallments();
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      if (params['targetId']) {
        this.selectedId = +params['targetId'];
      }
    });
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getInstallments() {
    let props: DebtsTableFilters = new DebtsTableFilters();
    props.id = this.membershipId;
    this.memberService.getInstallments(props).subscribe({
      next: (res) => {
        this.installments = res.data;
        this.dataSource = new MatTableDataSource(this.installments);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    })
  }



  addInstallment() {

  }

  onDeleteInstallment(installment: Installment) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxHeight: '80vh',
      data: { mainTitle: this.translate.instant('members.msgToDeletedInstallment') },
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
    let data = {} as dialogMemberInstallmentData;
    data.type = actionType;
    data.memberData = this.member;
    data.installment = installment;
    data.installment.isCash = true;

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

}
