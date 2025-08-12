import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { dialogClassRoomData } from 'src/app/models/staff.model';
import { CommonService } from 'src/app/services/common.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { ClassRoomsFormComponent } from './class-rooms-form/class-rooms-form.component';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { IClassRoom } from 'src/app/models/schedule.model';

@Component({
    selector: 'app-class-rooms',
    templateUrl: './class-rooms.component.html',
    styleUrl: './class-rooms.component.scss',
    imports: [MatButtonModule, MatIconModule, MatTableModule, MatSortModule, MatSlideToggleModule, FormsModule, MatMenuModule, MatPaginatorModule, TranslateModule]
})
export class ClassRoomsComponent implements OnInit {
  classesRooms: IClassRoom[] = [];
  dataSource: MatTableDataSource<IClassRoom>;
  displayedColumns: string[] = [
    'name',
    'viewOrder',
    'branchName',
    'description',
    'isActive',
    'actions'
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  totalElements: number;
  page: number = 0;
  perPage: number = 10;
  actionType: string;

  constructor(public dialog: MatDialog, private common: CommonService, private translate: TranslateService) { }

  ngOnInit(): void {
    this.getClassRooms();
  }

  onPaginationChange(e: PageEvent) {
    this.page = e.pageIndex;
    this.perPage = e.pageSize;
  }

  getClassRooms() {
    this.common.getClassRooms(false).subscribe({
      next: (res: any) => {
        this.classesRooms = res.data;
        this.totalElements = res.data.length;
        this.dataSource = new MatTableDataSource(this.classesRooms);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    })
  }

  addClassRoom() {
    let data = {} as dialogClassRoomData;
    data.type = 'add';
    let dialogRef = this.dialog.open(ClassRoomsFormComponent, {
      maxHeight: '80vh',
      data: data,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getClassRooms();
      }
    });
  }

  editClassRoom(classRoom: IClassRoom) {
    let data = {} as dialogClassRoomData;
    data.type = 'edit';
    data.classRoom = classRoom;
    let dialogRef = this.dialog.open(ClassRoomsFormComponent, {
      maxHeight: '80vh',
      maxWidth: '500px',
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getClassRooms();
      }
    });
  }

  toggleStatus(classRoom: IClassRoom) {
    this.common.editClassRoom(classRoom).subscribe();
  }

  deleteClassRoom(classRoom: IClassRoom) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxHeight: '80vh',
      data: { mainTitle: this.translate.instant('management.msgToDeletedClassRoom') },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'yes') {
        this.deleteLookup(classRoom.id);
      }
    });
  }

  deleteLookup(classRoomId: number) {
    this.common.deleteClassRoom(classRoomId).subscribe({
      next: (res) => {
        if (res) {
          this.getClassRooms();
        }
      }
    });
  }

}
