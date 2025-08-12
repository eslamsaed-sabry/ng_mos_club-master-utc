import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { dialogAnnouncementData, IAnnouncement } from 'src/app/models/management.model';
import { ManagementService } from 'src/app/services/management.service';
import { AnnouncementsFormComponent } from './announcements-form/announcements-form.component';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { RoleAttrDirective } from '../../../directives/role-attr.directive';
import { DatePipe } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RoleDirective } from '../../../directives/role.directive';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'app-announcements',
    templateUrl: './announcements.component.html',
    styleUrls: ['./announcements.component.scss'],
    imports: [MatFormFieldModule, MatInputModule, FormsModule, RoleDirective, MatButtonModule, MatIconModule, MatTableModule, MatSortModule, MatMenuModule, RoleAttrDirective, MatPaginatorModule, DatePipe, TranslateModule]
})
export class AnnouncementsComponent implements OnInit {
  @Output() refresh: EventEmitter<any> = new EventEmitter();
  announcements: IAnnouncement[] = [];
  dataSource: MatTableDataSource<IAnnouncement>;
  displayedColumns: string[] = [
    'title',
    'description',
    'showDate',
    'actions'
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  totalElements: number;
  page: number = 0;
  perPage: number = 10;
  title: string;
  id: string;
  announcementSub: Subscription = new Subscription();
  constructor(public dialog: MatDialog, private managementService: ManagementService, private translate: TranslateService) { }

  ngOnInit(): void {
    this.getAnnouncements();
  }

  onPaginationChange(e: PageEvent) {
    this.page = e.pageIndex;
    this.perPage = e.pageSize;
    this.getAnnouncements();
  }


  getAnnouncements() {
    this.announcementSub.unsubscribe();
    this.announcementSub = this.managementService.getAnnouncements(this.id, this.title).subscribe({
      next: (res) => {
        this.announcements = res.data;
        this.totalElements = res.totalCount;
        this.dataSource = new MatTableDataSource(this.announcements);
        this.dataSource.sort = this.sort;
      }
    })
  }

  addAnnouncement() {
    let data = {} as dialogAnnouncementData;
    data.type = 'add';
    let dialogRef = this.dialog.open(AnnouncementsFormComponent, {
      maxHeight: '80vh',
      maxWidth: '500px',
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getAnnouncements();
      }
    });
  }

  editAnnouncement(announcement: IAnnouncement) {
    let data = {} as dialogAnnouncementData;
    data.type = 'edit';
    data.announcement = announcement;
    let dialogRef = this.dialog.open(AnnouncementsFormComponent, {
      maxHeight: '80vh',
      maxWidth: '500px',
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getAnnouncements();
      }
    });
  }


  onDeleteAnnouncement(announcement: IAnnouncement) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxHeight: '80vh',
      data: { mainTitle: this.translate.instant('management.msgToDeletedAnnouncement') },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'yes') {
        this.deleteAnnouncement(announcement.id);
      }
    });
  }

  deleteAnnouncement(id: number) {
    this.managementService.deleteAnnouncement(id).subscribe({
      next: (res) => {
        if (res) {
          this.getAnnouncements();
        }
      }
    });
  }

}
