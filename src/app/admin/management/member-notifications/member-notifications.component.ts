import { Component, ViewChild, OnInit, Input, TemplateRef, EventEmitter, Output, SimpleChanges, OnChanges, inject, DestroyRef } from '@angular/core';
import { MatDialog, MatDialogTitle, MatDialogContent } from '@angular/material/dialog';
import { MatPaginator, PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { INotification, MemberNotificationFilters } from 'src/app/models/reports.model';
import { MemberNotificationFormComponent } from './member-notification-form/member-notification-form.component';
import { CommonService } from 'src/app/services/common.service';
import { TranslateModule } from '@ngx-translate/core';
import { IcoWhatsappComponent } from '../../../shared/icons/ico-whatsapp/ico-whatsapp.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MemberNotificationsFiltersComponent } from './member-notifications-filters/member-notifications-filters.component';
import { BidiModule } from '@angular/cdk/bidi';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgClass, DatePipe } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RoleDirective } from 'src/app/directives/role.directive';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-member-notifications',
    templateUrl: './member-notifications.component.html',
    styleUrls: ['./member-notifications.component.scss'],
    imports: [MatSidenavModule, NgClass, RoleDirective, MatButtonModule, RouterLink, MatIconModule, BidiModule, MemberNotificationsFiltersComponent, MatTableModule, MatSortModule, MatTooltipModule, IcoWhatsappComponent, MatPaginatorModule, MatDialogTitle, MatDialogContent, DatePipe, TranslateModule]
})
export class MemberNotificationsComponent implements OnInit, OnChanges {
  @Output() refresh: EventEmitter<any> = new EventEmitter();
  @ViewChild('responseModal') responseModal: TemplateRef<any>;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource<INotification> = new MatTableDataSource();
  width = screen.width;
  filters: MemberNotificationFilters = new MemberNotificationFilters();

  displayedColumns: string[] = [
    'creationDate',
    // 'contractNumber',
    // 'phoneNumber',
    // 'athleticName',
    'reasonName',
    'title',
    'notificationMessage',
    'notificationType',
    // 'isSMSSent',
    // 'isMobileAppSent',
    // 'isWhatsAppSent',
    'totalMembers'
  ];
  totalElements: number;
  page: number = 0;
  @Input() notifications: INotification[] = [];
  pageID: 'ALL' | 'NOTIFICATION' | 'MEMBER';
  @Input() memberId: number;
  response: string;

  public dialog = inject(MatDialog);
  private common = inject(CommonService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  constructor() { }

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      if (params.notificationId) {
        this.filters.notificationId = params.notificationId;
        this.pageID = 'NOTIFICATION';
      } else if (this.memberId) {
        this.pageID = 'MEMBER';
      } else {
        this.pageID = 'ALL';
      }
      this.filters.skipCount = 0;
      this.filters.takeCount = 10;
      this.common.fetchRouteFilters().subscribe((params) => {
        if (params) {
          this.filters = { ...params } as MemberNotificationFilters;
          this.page = Math.floor(this.filters.skipCount / this.filters.takeCount);
        }
      });
      this.initPage();
    })


  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['notifications'].firstChange) {
      this.dataSource = new MatTableDataSource(this.notifications);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  getNotifications() {

    this.common.getAllNotifications(this.filters).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.notifications = res.data;
        this.totalElements = res.totalCount;
        this.dataSource = new MatTableDataSource(res.data);
        this.dataSource.sort = this.sort;
      }
    })
  }

  getSpecificNotificationMembers() {
    this.common.getMemberNotifications(this.filters).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.notifications = res.data;
        this.totalElements = res.totalCount;
        this.dataSource = new MatTableDataSource(res.data);
        this.dataSource.sort = this.sort;
      }
    })
  }

  initPage() {
    switch (this.pageID) {
      case 'NOTIFICATION':
        this.displayedColumns = [
          'creationDate',
          'contractNumber',
          'phoneNumber',
          'athleticName',
          'reasonName',
          'notificationMessage',
          'notificationType',
          'isSMSSent',
          'isMobileAppSent',
          'isWhatsAppSent',
          'response'
        ];
        this.getSpecificNotificationMembers();
        break;
      case 'MEMBER':
        this.displayedColumns = [
          'contractNumber',
          'phoneNumber',
          'athleticName',
          'reasonName',
          'notificationMessage',
          'notificationType',
          'isSMSSent',
          'isMobileAppSent',
          'isWhatsAppSent',
          'response'
        ];
        this.totalElements = this.notifications.length
        this.dataSource = new MatTableDataSource(this.notifications);
        this.dataSource.sort = this.sort;
        break;
      default:
        this.getNotifications();
        break;
    }
  }

  showResponse(notification: INotification) {
    this.response = notification.response;
    this.dialog.open(this.responseModal);
  }


  applyFilter() {
    this.common.setRouteFilters(this.filters);
    this.initPage();
  }


  onPaginationChange(e: PageEvent) {
    this.page = e.pageIndex;
    this.filters.skipCount = e.pageIndex * this.filters.takeCount;
    this.filters.takeCount = e.pageSize;
    this.router.navigate([], {
      queryParams: {
        skipCount: this.filters.skipCount,
        takeCount: this.filters.takeCount,
        page: this.page
      },
      queryParamsHandling: 'merge'
    });
    this.initPage();
  }

  addNotification() {
    let dialogRef = this.dialog.open(MemberNotificationFormComponent, {
      maxHeight: '80vh',
      data: { memberId: this.memberId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.refresh.emit();
      }
    });
  }
}
