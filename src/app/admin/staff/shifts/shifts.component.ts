import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { dialogShiftData, Shift } from 'src/app/models/staff.model';
import { StaffService } from 'src/app/services/staff.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { ShiftFormComponent } from './shift-form/shift-form.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RoleDirective } from '../../../directives/role.directive';

@Component({
    selector: 'app-shifts',
    templateUrl: './shifts.component.html',
    styleUrls: ['./shifts.component.scss'],
    imports: [RoleDirective, MatButtonModule, MatIconModule, MatTableModule, MatSortModule, MatPaginatorModule, TranslateModule]
})
export class ShiftsComponent implements OnInit {
  shifts: Shift[] = [];
  dataSource: MatTableDataSource<Shift>;
  displayedColumns: string[] = [
    'nameEng',
    'nameAR',
    'allowedDelay',
    'firstDeductAmount',
    'secondDeductAmount',
    'edit',
    'delete'
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  totalElements: number;
  page: number = 0;
  perPage: number = 10;
  constructor(public dialog: MatDialog, private staffService: StaffService, private translate: TranslateService) { }

  ngOnInit(): void {
    this.getShifts();
  }


  getShifts() {
    this.staffService.getShifts().subscribe({
      next: (res) => {
        this.totalElements = res.totalCount;
        this.dataSource = new MatTableDataSource(res.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    })
  }

  onPaginationChange(e: PageEvent) {
    this.page = e.pageIndex;
    this.perPage = e.pageSize;
    this.getShifts();
  }


  addShift() {
    let data = {} as dialogShiftData;
    data.type = 'add';
    let dialogRef = this.dialog.open(ShiftFormComponent, {
      maxHeight: '80vh',
      maxWidth: '600px',
      data: data,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'success') {
        this.getShifts();
      }
    });
  }

  editShift(shift: Shift) {
    let data = {} as dialogShiftData;
    data.type = 'edit';
    data.shift = shift;
    let dialogRef = this.dialog.open(ShiftFormComponent, {
      maxHeight: '80vh',
      maxWidth: '600px',
      data: data,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'success') {
        this.getShifts();
      }
    });
  }

  onDeleteShift(shift: Shift) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxHeight: '80vh',
      data: { mainTitle: this.translate.instant('staff.msgToDeletedShift') },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'yes') {
        this.deleteShift(shift);
      }
    });
  }

  deleteShift(shift: Shift) {
    this.staffService.deleteShift(shift.id).subscribe({
      next: () => {
        this.getShifts();
      }
    });
  }

}
