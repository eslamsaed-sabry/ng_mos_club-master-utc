import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ExtraService } from 'src/app/services/extra.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { WorkoutMemberFormComponent } from './workout-member-form/workout-member-form.component';
import { IWorkOut, IWorkOutMember, IWorkOutParams, dialogWorkoutMemberData } from 'src/app/models/management.model';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { MatMenuModule } from '@angular/material/menu';
import { BidiModule } from '@angular/cdk/bidi';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgClass, DatePipe } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
@Component({
    selector: 'app-workout-members',
    templateUrl: './workout-members.component.html',
    styleUrls: ['./workout-members.component.scss'],
    imports: [MatSidenavModule, NgClass, MatButtonModule, RouterLink, MatIconModule, MatFormFieldModule, MatInputModule, BidiModule, MatTableModule, MatSortModule, MatMenuModule, MatPaginatorModule, DatePipe, TranslateModule]
})
export class WorkoutMembersComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  members: IWorkOutMember[] = [];
  dataSource: MatTableDataSource<IWorkOutMember>;
  displayedColumns: string[] = [
    'assignedDate',
    'memberContractNo',
    'memberPhone',
    'memberCode',
    'memberName',
    'assignedName',
    'notes',
    'actions'
  ];
  width = screen.width;
  filters: IWorkOutParams = {} as IWorkOutParams;
  totalElements: number;
  perPage: number;
  page: number;
  workoutDetails: IWorkOut;
  constructor(public dialog: MatDialog, private extraService: ExtraService, private route: ActivatedRoute,
    private translate: TranslateService) { }

  ngOnInit(): void {
    this.filters.skipCount = 0;
    this.filters.takeCount = 10;
    this.route.params.subscribe((params) => {
      if (params['workoutId']) {
        this.filters.workoutId = params['workoutId'];
        this.getMembers();
        this.getWorkoutDetails();
      };
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getWorkoutDetails() {
    this.extraService.getWorkouts({ id: this.filters.workoutId }).subscribe({
      next: (res) => {
        this.workoutDetails = res.data[0];
      }
    });
  }

  onPaginationChange(e: PageEvent) {
    this.page = e.pageIndex;
    this.perPage = e.pageSize;
    this.filters.skipCount = e.pageIndex * this.perPage;
    this.filters.takeCount = e.pageSize;
    this.getMembers();
  }

  getMembers() {
    this.extraService.getWorkoutMembers(this.filters).subscribe({
      next: (res) => {
        this.members = res.data;
        this.totalElements = res.totalCount;
        this.dataSource = new MatTableDataSource(this.members);
        this.dataSource.sort = this.sort;
      }
    })
  }

  openMemberForm(actionType: string) {
    let data = {} as dialogWorkoutMemberData;
    data.type = actionType;
    data.workout = this.workoutDetails;
    let dialogRef = this.dialog.open(WorkoutMemberFormComponent, {
      maxHeight: '80vh',
      width: '700px',
      data: data,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getMembers();
      }
    });

  }

  deleteMember(member: IWorkOutMember) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxHeight: '80vh',
      data: { mainTitle: this.translate.instant('members.msgToDeletedMember') },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'yes') {
        this.extraService.deleteWorkoutMember(member.memberId, this.filters.workoutId).subscribe({
          next: (res) => {
            this.getMembers();
          }
        })
      }
    });
  }


}
