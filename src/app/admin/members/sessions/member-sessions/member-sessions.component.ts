import { Component, OnInit, Input, ViewChild, AfterViewInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Session, Member, dialogMemberSessionData } from 'src/app/models/member.model';
import { MemberService } from 'src/app/services/member.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { SessionFormComponent } from '../session-form/session-form.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { SessionStatusPipe } from '../../../../pipes/session-status.pipe';
import { NgClass, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'app-member-sessions',
    templateUrl: './member-sessions.component.html',
    styleUrls: ['./member-sessions.component.scss'],
    imports: [MatFormFieldModule, MatIconModule, MatInputModule, MatButtonModule, MatTableModule, MatSortModule, NgClass, MatPaginatorModule, DatePipe, SessionStatusPipe, TranslateModule]
})
export class MemberSessionsComponent implements OnInit, AfterViewInit, OnChanges {
  @Output() refresh: EventEmitter<any> = new EventEmitter();
  @Input() sessions: Session[] = [];
  @Input() member: Member;
  @Input() selectedId?: number;
  dataSource: MatTableDataSource<Session>;
  displayedColumns: string[] = [
    'sessionDate',
    'phone',
    'memberName',
    'type',
    'price',
    // 'approveStatus',
    'edit',
    'delete'
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public dialog: MatDialog, private memberService: MemberService, private translate: TranslateService) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.sessions);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['sessions'].firstChange) {
      this.dataSource = new MatTableDataSource(this.sessions);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addSession() {
    let data = {} as dialogMemberSessionData;
    data.type = 'addSession';
    data.memberData = this.member;
    let dialogRef = this.dialog.open(SessionFormComponent, {
      maxHeight: '80vh',
      width: '500px',
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.refresh.emit();
      }
    });
  }

  editSession(session: Session) {
    let data = {} as dialogMemberSessionData;
    data.type = 'editSession';
    data.memberData = this.member;
    data.session = session;
    let dialogRef = this.dialog.open(SessionFormComponent, {
      maxHeight: '80vh',
      width: '500px',
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.refresh.emit();
      }
    });
  }

  onDeleteSession(session: Session) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxHeight: '80vh',
      data: { mainTitle: this.translate.instant('members.msgToDeletedSession'), subTitle: `${session.type}` },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'yes') {
        this.deleteSession(session.sessionId);
      }
    });
  }

  deleteSession(sessionId: number) {
    this.memberService.deleteSessions(sessionId).subscribe({
      next: (res) => {
        if (res) {
          this.refresh.emit();
        }
      }
    })
  }


}
