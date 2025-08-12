import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CheckedInMembersFilters, Member } from 'src/app/models/member.model';
import { MemberService } from 'src/app/services/member.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { TranslateModule } from '@ngx-translate/core';
import { CheckedInMembersFiltersComponent } from './checked-in-members-filters/checked-in-members-filters.component';
import { BidiModule } from '@angular/cdk/bidi';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe, NgStyle } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
    selector: 'app-checked-in-members',
    templateUrl: './checked-in-members.component.html',
    styleUrls: ['./checked-in-members.component.scss'],
    imports: [MatSidenavModule, NgStyle, MatButtonModule, MatIconModule, BidiModule, CheckedInMembersFiltersComponent,
        MatTableModule, MatSortModule, MatPaginatorModule, TranslateModule, DatePipe]
})
export class CheckedInMembersComponent implements OnInit {
  @Output() refresh: EventEmitter<any> = new EventEmitter();
  members: Member[] = [];
  dataSource: MatTableDataSource<Member>;
  displayedColumns: string[] = [
    'attendanceDateAsString',
    'contractNo',
    'phoneNumber',
    'englishName',
    'package',
    'userName',
    'checkout'
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  totalElements: number;
  page: number = 0;
  perPage: number = 10;
  width = screen.width;
  filters: CheckedInMembersFilters = new CheckedInMembersFilters();
  checkoutAllMsg = 'Are you sure to checkout all attendance?';
  checkoutMsg = 'Are you sure to checkout this attendance?';
  constructor(public dialog: MatDialog, private memberService: MemberService) { }

  ngOnInit(): void {
    this.getCheckedInMembers();
  }

  getCheckedInMembers() {
    this.filters.skipCount = this.page * this.perPage;
    this.filters.takeCount = this.perPage;
    this.memberService.getCheckedInMembers(this.filters).subscribe({
      next: (res) => {
        this.members = res.data;
        this.totalElements = res.totalCount;
        this.dataSource = new MatTableDataSource(this.members);
        this.dataSource.sort = this.sort;
      }
    })
  }

  onPaginationChange(e: PageEvent) {
    this.page = e.pageIndex;
    this.perPage = e.pageSize;
    this.getCheckedInMembers();
  }

  onCheckOut(msg: string, member?: Member) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxHeight: '80vh',
      data: { mainTitle: msg },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'yes') {
        if (member) {
          this.checkOut(member);
        } else {
          this.checkOutAll();
        }
      }
    });
  }



  checkOutAll() {
    this.memberService.checkOutAllMembers().subscribe({
      next: (res) => {
        this.getCheckedInMembers();
      }
    })
  }

  checkOut(member: Member) {
    this.memberService.checkOutMember(member.id).subscribe({
      next: () => {
        this.getCheckedInMembers();
      }
    })
  }



}
