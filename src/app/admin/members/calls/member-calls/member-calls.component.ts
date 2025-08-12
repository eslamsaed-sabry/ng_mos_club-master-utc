import { Component, OnInit, Input, ViewChild, EventEmitter, Output, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CallMember, dialogMemberCallData, dialogMemberData, Member } from 'src/app/models/member.model';
import { MemberService } from 'src/app/services/member.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { CallFormComponent } from '../call-form/call-form.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { RoleDirective } from '../../../../directives/role.directive';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'app-member-calls',
    templateUrl: './member-calls.component.html',
    styleUrls: ['./member-calls.component.scss'],
    imports: [MatFormFieldModule, MatIconModule, MatInputModule, RoleDirective, MatButtonModule, MatTableModule, MatSortModule, MatPaginatorModule, DatePipe, TranslateModule]
})
export class MemberCallsComponent implements OnInit, AfterViewInit, OnChanges {
  @Output() refresh: EventEmitter<any> = new EventEmitter();
  @Input() calls: CallMember[] = [];
  @Input() member: Member;
  dataSource: MatTableDataSource<CallMember>;
  displayedColumns: string[] = [
    'callDate',
    'sourceName',
    'feedbackName',
    'followUpDate',
    'summary',
    'userName',
    'edit',
    'delete'
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public dialog: MatDialog, private memberService: MemberService, private translate: TranslateService) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.calls);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['calls'].firstChange) {
      this.dataSource = new MatTableDataSource(this.calls);
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

  addCall() {
    let data = {} as dialogMemberData;
    data.type = 'addCall';
    data.memberData = this.member;
    let dialogRef = this.dialog.open(CallFormComponent, {
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

  onDeleteCall(memberCall: CallMember) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxHeight: '80vh',
      data: { mainTitle: this.translate.instant('members.msgToDeletedMemberCall'), subTitle: `${memberCall.summary}` },
      disableClose: true,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'yes') {
        this.deleteCall(memberCall.id);
      }
    });
  }

  deleteCall(callId: number) {
    this.memberService.deleteCall(callId).subscribe({
      next: (res) => {
        if (res.statusCode === 200) {
          this.refresh.emit();
        }
      }
    })
  }

  editCall(memberCall: CallMember) {
    let data = {} as dialogMemberCallData;
    data.type = 'editCall';
    data.memberData = this.member;
    data.call = memberCall;
    let dialogRef = this.dialog.open(CallFormComponent, {
      maxHeight: '80vh',
      width: '700px',
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.refresh.emit();
      }
    });
  }


}
