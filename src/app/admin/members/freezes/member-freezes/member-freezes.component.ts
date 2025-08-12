import { Component, OnInit, Input, ViewChild, EventEmitter, Output, inject, DestroyRef, input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { dialogChangePaymentBranchData, dialogMemberFreezeData, Freeze, Member, Membership } from 'src/app/models/member.model';
import { MemberService } from 'src/app/services/member.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { FreezeFormComponent } from '../freeze-form/freeze-form.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgClass, DatePipe } from '@angular/common';
import { RoleDirective } from '../../../../directives/role.directive';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';

import { ContextType } from 'src/app/models/enums';
import { ChangePaymentBranchComponent } from 'src/app/shared/change-payment-branch/change-payment-branch.component';

@Component({
    selector: 'app-member-freezes',
    templateUrl: './member-freezes.component.html',
    styleUrls: ['./member-freezes.component.scss'],
    imports: [MatInputModule, MatDatepickerModule, FormsModule, MatSelectModule, MatOptionModule, RoleDirective, MatButtonModule, MatIconModule, MatTableModule, MatSortModule, MatMenuModule, MatPaginatorModule, DatePipe, TranslateModule]
})
export class MemberFreezesComponent implements OnInit {
  @Output() refresh: EventEmitter<any> = new EventEmitter();
  @Input() symbol: string;

  freezes: Freeze[] = [];
  @Input() membershipId: number;
  membership: Membership;
  dataSource: MatTableDataSource<Freeze>;
  displayedColumns: string[] = [
    'freezeDateAsString',
    'releaseDateAsString',
    'freezedDays',
    'amountPaid',
    'paymentDate',
    'comment',
    'userName',
    'actions'
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  route = inject(ActivatedRoute);
  destroyRef = inject(DestroyRef);
  selectedId: number;
  isMedical: boolean;
  constructor(public dialog: MatDialog, private memberService: MemberService, private translate: TranslateService) { }

  ngOnInit(): void {
    if (this.symbol === "MedicalFreeze")
      this.isMedical = true;
    else
      this.isMedical = false;

    this.getFreezes();
    this.getMembership();
  }

  init() {
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      if (params['targetId']) {
        this.selectedId = +params['targetId'];
      }
    })
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getFreezes() {
    this.memberService.getMembershipFreeze(this.membershipId, this.isMedical).subscribe({
      next: (res) => {
        this.freezes = res.data;
        this.dataSource = new MatTableDataSource(this.freezes);
        this.dataSource.sort = this.sort;
      }
    })
  }

  getMembership() {
    this.memberService.getMembershipById(this.membershipId).subscribe({
      next: (res) => {
        this.membership = res.data;
      }
    })
  }

  addFreeze() {
    let data = {} as dialogMemberFreezeData;
    data.freeze = {} as Freeze;
    data.freeze.isMedical = this.isMedical;
    data.type = 'addFreeze';
    data.membership = this.membership;
    let dialogRef = this.dialog.open(FreezeFormComponent, {
      maxHeight: '80vh',
      width: '500px',
      data: data,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getFreezes();
        this.refresh.emit();
      }
    });
  }

  deleteFreeze(freeze: Freeze) {
    this.memberService.deleteFreeze(freeze.id).subscribe({
      next: (res) => {
        this.getFreezes();
        this.refresh.emit();
      }
    })
  }

  onDeleteFreeze(freeze: Freeze) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxHeight: '80vh',
      data: { mainTitle: this.translate.instant('members.msgToDeletedFreeze') },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'yes') {
        this.deleteFreeze(freeze);
      }
    });
  }

  changePaymentBranch(freeze: Freeze) {
    let data: dialogChangePaymentBranchData = {} as dialogChangePaymentBranchData;
    data.branchId = freeze.branchId;
    data.contextId = freeze.id;
    data.contextTypeId = ContextType.FREEZE;

    const downDialogRef = this.dialog.open(ChangePaymentBranchComponent, {
      maxHeight: '80vh',
      width: '500px',
      data: data,
      autoFocus: false
    });
    downDialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getFreezes();
      }
    });
  }

}
