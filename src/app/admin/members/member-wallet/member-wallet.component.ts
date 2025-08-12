import { MatDialog } from '@angular/material/dialog';
import { dialogMemberData, IWallet } from './../../../models/member.model';
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Member } from 'src/app/models/member.model';
import { MemberService } from 'src/app/services/member.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe, DecimalPipe, NgClass } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MemberWalletFormComponent } from './member-wallet-form/member-wallet-form.component';
import { RoleDirective } from 'src/app/directives/role.directive';
import { RoleAttrDirective } from 'src/app/directives/role-attr.directive';

@Component({
  selector: 'app-member-wallet',
  templateUrl: './member-wallet.component.html',
  styleUrl: './member-wallet.component.scss',
  imports: [MatIconModule, MatButtonModule, RoleDirective, DecimalPipe,
    MatTableModule, MatSortModule, MatPaginatorModule, DatePipe, TranslateModule,
    NgClass
  ]
})
export class MemberWalletComponent implements OnInit, AfterViewInit, OnChanges {
  @Output() refresh: EventEmitter<any> = new EventEmitter();
  @Input() wallet: IWallet[] = [];
  @Input() member: Member;
  @Input() walletBalance: number;
  dataSource: MatTableDataSource<IWallet>;
  displayedColumns: string[] = [
    'amountAsString',
    'notes',
    'creationDate',
    'createdByName',
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  balance: number;

  constructor(public dialog: MatDialog, private memberService: MemberService, private translate: TranslateService) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.wallet);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['wallet']?.firstChange) {
      this.dataSource = new MatTableDataSource(this.wallet);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addDeposit() {
    let data = {} as dialogMemberData;
    data.type = 'Deposit';
    data.memberData = this.member;
    let dialogRef = this.dialog.open(MemberWalletFormComponent, {
      maxHeight: '80vh',
      width: '700px',
      data: data,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.refresh.emit();
      }
    });
  }

  addWithdraw() {
    let data = {} as dialogMemberData;
    data.type = 'Withdraw';
    data.memberData = this.member;
    let dialogRef = this.dialog.open(MemberWalletFormComponent, {
      maxHeight: '80vh',
      width: '700px',
      data: data,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.refresh.emit();
      }
    });
  }

}
