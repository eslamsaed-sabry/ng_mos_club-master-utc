import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { INotificationTemplate } from 'src/app/models/common.model';
import { CommonService } from 'src/app/services/common.service';
import { NotificationsTemplatesFormComponent } from './notifications-templates-form/notifications-templates-form.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RoleDirective } from '../../../directives/role.directive';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgClass } from '@angular/common';
import { MatSortModule } from '@angular/material/sort';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-notifications-template',
    templateUrl: './notifications-template.component.html',
    styleUrls: ['./notifications-template.component.scss'],
    imports: [MatFormFieldModule, MatInputModule, FormsModule, MatTableModule, MatSortModule, NgClass, MatSlideToggleModule, RoleDirective, MatIconModule, MatButtonModule, MatPaginatorModule, TranslateModule]
})
export class NotificationsTemplateComponent implements OnInit {
  dataList: INotificationTemplate[] = [];
  dataSource: MatTableDataSource<INotificationTemplate>;
  displayedColumns: string[] = [
    'englishDescription',
    'arabicDescription',
    'template',
    'isActive',
    'isWhatsUp',
    'isMobileApp',
    'isSMS',
    'edit',
  ];

  filters: {
    skipCount: number,
    takeCount: number
  };

  totalElements: number;
  page: number = 0;
  search?: string;

  public dialog = inject(MatDialog);
  private common = inject(CommonService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private commonService = inject(CommonService);


  constructor() { }

  ngOnInit(): void {
    this.filters = {
      skipCount: 0,
      takeCount: 10
    };
    this.commonService.fetchRouteFilters().subscribe((params) => {
      if (params) {
        this.filters = { ...params };
        this.page = Math.floor(this.filters.skipCount / this.filters.takeCount);
      }
    }); this.getNotificationsTemplates();
  }

  applyFilter() {
    this.commonService.setRouteFilters(this.filters);
    this.getNotificationsTemplates();
  }

  onPaginationChange(e: PageEvent) {
    this.search = undefined;
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
    this.commonService.setRouteFilters(this.filters);
    this.getNotificationsTemplates();
  }

  getNotificationsTemplates() {

    this.common.getNotificationsTemplates(this.filters).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res: any) => {
        this.dataList = res.data;
        this.totalElements = res.length;
        this.dataSource = new MatTableDataSource(this.dataList);
        this.totalElements = res.totalCount;
      }
    })
  }

  toggleStatus(notificationTemplate: INotificationTemplate) {
    if (!notificationTemplate.isActive) {
      notificationTemplate.isWhatsUp = false;
      notificationTemplate.isMobileApp = false;
      notificationTemplate.isSMS = false;
    }
    this.common.editNotificationsTemplates(notificationTemplate).subscribe();
  }

  onSearch(value: any) {
    let newDataList: INotificationTemplate[] = [];

    this.dataList.forEach(o => {
      if ((o.englishDescription).toLowerCase().includes(value.target.value.toLowerCase())) {
        newDataList.push(o);
      }
    });

    this.dataSource = new MatTableDataSource(newDataList);
  }

  openNotificationForm(notificationTemplate: INotificationTemplate) {

    let dialogRef = this.dialog.open(NotificationsTemplatesFormComponent, {
      maxHeight: '80vh',
      width: '700px',
      data: notificationTemplate,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.common.editNotificationsTemplates(result.data).subscribe({
          next: (res) => {
            this.getNotificationsTemplates();
          }
        });
      }
    });

  }
}

