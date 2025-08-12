import { Component, OnInit, Input, ViewChild, EventEmitter, Output, DestroyRef, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Membership, MembershipPayment } from 'src/app/models/member.model';
import { MemberService } from 'src/app/services/member.service';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule, DatePipe } from '@angular/common';
import * as env from '../../../../../environments/environment';
import { MatButtonModule } from '@angular/material/button';
import { fromEvent, tap, timer } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-membership-payments',
    templateUrl: './membership-payments.component.html',
    styleUrls: ['./membership-payments.component.scss'],
    imports: [MatTableModule,
        MatSortModule, MatPaginatorModule,
        DatePipe, TranslateModule, CommonModule,
        MatButtonModule]
})
export class MembershipPaymentsComponent implements OnInit {
  @Output() refresh: EventEmitter<any> = new EventEmitter();
  @Input() membership: Membership;
  dataSource: MatTableDataSource<MembershipPayment>;
  payments: MembershipPayment[] = [];
  displayedColumns: string[] = [
    'paymentDate',
    'cashAmount',
    'visaAmount',
    'purpose',
    'description'
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  totalElements: number;
  page: number = 0;
  perPage: number = 10;
  today = new Date();
  logo = env.environment.logo;
  destroyRef = inject(DestroyRef);

  constructor(public dialog: MatDialog, private memberService: MemberService) { }

  ngOnInit(): void {
    this.getPayments();

    fromEvent(window, 'afterprint').pipe(takeUntilDestroyed(this.destroyRef)).subscribe((res) => {
      this.displayedColumns.push('description');
    });
  }

  getPayments() {
    this.memberService.getMembershipPayments(this.membership.id).subscribe({
      next: (res) => {
        this.payments = res.data;
        this.totalElements = res.totalCount;
        this.dataSource = new MatTableDataSource(this.payments);
        this.dataSource.sort = this.sort;
      }
    })
  }

  print() {
    this.displayedColumns.splice(4, 1);
    timer(100).pipe(tap(() => {
      window.print();
    }), takeUntilDestroyed(this.destroyRef)).subscribe();
  }


}
