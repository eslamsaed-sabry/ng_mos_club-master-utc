import { Component, OnInit, Input, ViewChild, Output, EventEmitter, inject, DestroyRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ContextType, GymConfig } from 'src/app/models/enums';
import { Membership, IMembershipUpgrade, dialogMembershipData, dialogUpgradeData, dialogChangePaymentBranchData } from 'src/app/models/member.model';
import { MemberService } from 'src/app/services/member.service';
import { UpgradeModalComponent } from '../upgrade-modal/upgrade-modal.component';
import { UpgradePrintReceiptComponent } from './upgrade-print-receipt/upgrade-print-receipt.component';
import { UpgradeChangePaymentDateComponent } from './upgrade-change-payment-date/upgrade-change-payment-date.component';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';
import { UpgradeStatusPipe } from '../../../../pipes/upgrade-status.pipe';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgClass, DatePipe } from '@angular/common';
import { RoleDirective } from 'src/app/directives/role.directive';
import { ChangePaymentBranchComponent } from 'src/app/shared/change-payment-branch/change-payment-branch.component';

@Component({
    selector: 'app-member-upgrades',
    templateUrl: './member-upgrades.component.html',
    styleUrls: ['./member-upgrades.component.scss'],
    imports: [MatFormFieldModule, MatIconModule, RoleDirective, MatInputModule, MatButtonModule, MatTableModule, MatSortModule, NgClass, MatMenuModule, MatPaginatorModule, DatePipe, UpgradeStatusPipe, TranslateModule]
})
export class MemberUpgradesComponent implements OnInit {
  @Output() refresh: EventEmitter<any> = new EventEmitter();
  @Input() membership: Membership;
  @Input() hideSearch: boolean;
  dataSource: MatTableDataSource<IMembershipUpgrade>;
  upgrades: IMembershipUpgrade[];
  displayedColumns: string[] = [
    'paymentDate',
    'amount',
    'amountVisa',
    'username',
    'approveStatus',
    'print',
    'actions'
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  selectedId: number;
  destroyRef = inject(DestroyRef)
  constructor(public dialog: MatDialog, private memberService: MemberService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getUpgrades();
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      if (params['targetId']) {
        this.selectedId = +params['targetId'];
      }
    });
  }


  getUpgrades() {
    let props = {
      "fromDate": null,
      "toDate": null,
      membershipId: this.membership.id
    }
    this.memberService.getMembershipUpgrades(props).subscribe({
      next: (res) => {
        this.upgrades = res.data;
        console.log(this.upgrades);

        this.dataSource = new MatTableDataSource(this.upgrades);
        this.dataSource.sort = this.sort;
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

  addUpgrade() {
    let data: dialogMembershipData = {} as dialogMembershipData;
    data.membership = this.membership;
    data.type = 'upgrade';

    const upgradeDialogRef = this.dialog.open(UpgradeModalComponent, {
      maxHeight: '80vh',
      width: '600px',
      data: data,
      autoFocus: false
    });
    upgradeDialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getUpgrades();
        this.refresh.emit();
      }
    });
  }

  getReceiptType(upgrade: IMembershipUpgrade) {
    this.memberService.getGymConfig(GymConfig.receiptType).subscribe({
      next: (res) => {
        upgrade.receiptType = res.data;
        this.print(upgrade);
      }
    })
  }

  print(upgrade: IMembershipUpgrade) {
    let dialogRef = this.dialog.open(UpgradePrintReceiptComponent, {
      maxHeight: '90vh',
      width: '700px',
      data: upgrade,
      autoFocus: false,
      id: "printable-receipt"
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  changePayment(upgrade: IMembershipUpgrade) {
    let data: dialogUpgradeData = {} as dialogUpgradeData;
    data.upgrade = upgrade;
    const cancelDialogRef = this.dialog.open(UpgradeChangePaymentDateComponent, {
      maxHeight: '80vh',
      width: '600px',
      data: data,
      autoFocus: false
    });
    cancelDialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getUpgrades();
      }
    });
  }

  changePaymentBranch(upgrade: IMembershipUpgrade) {
    let data: dialogChangePaymentBranchData = {} as dialogChangePaymentBranchData;
    data.branchId = upgrade.branchId;
    data.contextId = upgrade.id;
    data.contextTypeId = ContextType.UPGRADE;

    const downDialogRef = this.dialog.open(ChangePaymentBranchComponent, {
      maxHeight: '80vh',
      width: '500px',
      data: data,
      autoFocus: false
    });
    downDialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getUpgrades();
      }
    });
  }

}
