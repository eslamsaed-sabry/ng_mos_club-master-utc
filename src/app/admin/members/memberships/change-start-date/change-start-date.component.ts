import { DatePipe, NgClass } from '@angular/common';
import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { RoleDirective } from 'src/app/directives/role.directive';
import { MembershipActionType } from 'src/app/models/enums';
import { dialogMembershipChangeStartDate, IMembershipChangeStartDate, Membership } from 'src/app/models/member.model';
import { MemberService } from 'src/app/services/member.service';
import { MembershipChangeStartDateModalComponent } from './membership-change-start-date-modal/membership-change-start-date-modal.component';

@Component({
    selector: 'app-change-start-date',
    templateUrl: './change-start-date.component.html',
    styleUrl: './change-start-date.component.scss',
    imports: [MatFormFieldModule, MatIconModule, RoleDirective, MatInputModule, MatButtonModule, MatTableModule, MatSortModule, NgClass, MatMenuModule, MatPaginatorModule, DatePipe, TranslateModule, MatDialogTitle, MatDialogContent]
})
export class ChangeStartDateComponent implements OnInit {
  @Output() refresh: EventEmitter<any> = new EventEmitter();
  @Input() membership: Membership;
  @Input() hideSearch: boolean;
  dataSource: MatTableDataSource<IMembershipChangeStartDate>;
  membershipChangeStartDate: IMembershipChangeStartDate[];
  displayedColumns: string[] = [
    'newValue',
    'notes',
    'status',
    'createdByUserName',
    'response',
  ];

  @ViewChild('responseModal') responseModal: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  selectedId: number;
  destroyRef = inject(DestroyRef);

  changeStartDateResponse: IMembershipChangeStartDate;

  constructor(public dialogRef: MatDialogRef<ChangeStartDateComponent>, public dialog: MatDialog, private memberService: MemberService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getMembershipActions();
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      if (params['targetId']) {
        this.selectedId = +params['targetId'];
      }
    });
  }


  getMembershipActions() {
    let props = {
      actionType: MembershipActionType.ChangeStartDate,
      membershipId: this.membership.id
    }
    this.memberService.getMembershipActions(props).subscribe({
      next: (res) => {
        this.membershipChangeStartDate = res.data;
        this.dataSource = new MatTableDataSource(this.membershipChangeStartDate);
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

  dismiss(status: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: status, data: data });
  }

  changeStartDate() {
    let data: dialogMembershipChangeStartDate = {} as dialogMembershipChangeStartDate;
    data.membership = this.membership;

    const upgradeDialogRef = this.dialog.open(MembershipChangeStartDateModalComponent, {
      maxHeight: '80vh',
      width: '500px',
      data: data,
      autoFocus: false
    });
    upgradeDialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getMembershipActions();
        this.refresh.emit();
        this.dismiss('success')
      }
    });
  }

  showResponse(changeStartDate: IMembershipChangeStartDate) {
    this.changeStartDateResponse = changeStartDate;
    this.dialog.open(this.responseModal, {
      maxHeight: '80vh',
      maxWidth: '500px',
    });
  }
}
