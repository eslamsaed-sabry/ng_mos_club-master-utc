import { Component, OnInit, Input, ViewChild, AfterViewInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { Benefit, BenefitSession, dialogMemberBenefitsSessionData } from 'src/app/models/member.model';
import { MemberService } from 'src/app/services/member.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { BenefitsSessionFormComponent } from '../benefits-session-form/benefits-session-form.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-member-benefits-sessions',
    templateUrl: './member-benefits-sessions.component.html',
    styleUrl: './member-benefits-sessions.component.scss',
    imports: [CommonModule, TranslateModule, MatTableModule, MatButtonModule, MatPaginatorModule,
        MatIconModule]
})
export class MemberBenefitsSessionsComponent implements OnInit, AfterViewInit, OnChanges {
  @Output() refresh: EventEmitter<any> = new EventEmitter();
  @Input() sessions: BenefitSession[] = [];
  @Input() benefit: Benefit;
  @Input() membershipId: number;
  dataSource: MatTableDataSource<BenefitSession>;
  displayedColumns: string[] = [
    'sessionDate',
    'approveStatus',
    'approvedDate',
    'creationDate',
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
    let data = {} as dialogMemberBenefitsSessionData;
    data.type = 'addSession';
    data.benefit = this.benefit;
    data.membershipId = this.membershipId;
    let dialogRef = this.dialog.open(BenefitsSessionFormComponent, {
      maxHeight: '80vh',
      width: '500px',
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.benefit.consumedCount = this.benefit.consumedCount + 1;
        this.refresh.emit();
      }
    });
  }

  editSession(session: BenefitSession) {
    let data = {} as dialogMemberBenefitsSessionData;
    data.type = 'editSession';
    data.session = session;
    data.benefit = this.benefit;
    data.membershipId = this.membershipId;
    let dialogRef = this.dialog.open(BenefitsSessionFormComponent, {
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

  onDeleteSession(session: BenefitSession) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxHeight: '80vh',
      data: { mainTitle: this.translate.instant('members.msgToDeletedSession'), subTitle: `${this.benefit.symbol}` },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'yes') {
        this.deleteSession(session.id);
      }
    });
  }

  deleteSession(sessionId: number) {
    this.memberService.deleteBenefitSession(sessionId).subscribe({
      next: (res) => {
        if (res) {
          this.benefit.consumedCount = this.benefit.consumedCount - 1;
          this.refresh.emit();
        }
      }
    })
  }


}
