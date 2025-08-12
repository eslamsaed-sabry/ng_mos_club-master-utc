import { DatePipe, DecimalPipe, NgClass } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IPayments, Member } from 'src/app/models/member.model';
import { MemberService } from 'src/app/services/member.service';

@Component({
  selector: 'app-member-payments',
  templateUrl: './member-payments.component.html',
  styleUrl: './member-payments.component.scss',
  imports: [MatTableModule, MatSortModule, MatPaginatorModule, DatePipe, TranslateModule, NgClass, DecimalPipe]
})
export class MemberPaymentsComponent implements OnInit, AfterViewInit, OnChanges {
  @Output() refresh: EventEmitter<any> = new EventEmitter();
  @Input() payments: IPayments[] = [];
  @Input() member: Member;
  @Input() totalPayments: number;
  dataSource: MatTableDataSource<IPayments>;
  displayedColumns: string[] = [
    'paymentDate',
    'cashAmount',
    'nonCashAmount',
    'totalAmount',
    'details',
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  balance: number;

  constructor(public dialog: MatDialog, private memberService: MemberService, private translate: TranslateService) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.payments);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['payments']?.firstChange) {
      this.dataSource = new MatTableDataSource(this.payments);
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
}