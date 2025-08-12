import { Component, OnInit, Output, EventEmitter, ViewChild, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { dialogNewsData, INews, newsFilters } from 'src/app/models/management.model';
import { ManagementService } from 'src/app/services/management.service';
import { NewsFormComponent } from './news-form/news-form.component';
import { AppConfigService } from 'src/app/services/app-config.service';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { PageID } from 'src/app/models/enums';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgStyle, SlicePipe, DatePipe } from '@angular/common';

@Component({
    selector: 'app-news',
    templateUrl: './news.component.html',
    styleUrls: ['./news.component.scss'],
    imports: [MatSidenavModule, MatButtonModule, MatIconModule, NgStyle, SlicePipe, DatePipe, TranslateModule]
})
export class NewsComponent implements OnInit {
  @ViewChild('drawer') drawer: MatDrawer;
  @Output() refresh: EventEmitter<any> = new EventEmitter();
  news: INews[] = [];
  totalElements: number;
  page: number = 0;
  perPage: number = 10;
  pageTitle: string;
  entityTypeId: number;
  appConfig = inject(AppConfigService);
  proxyUrl = this.appConfig.envUrl;
  selectedCard: INews;
  pageID = PageID;
  constructor(public dialog: MatDialog, private managementService: ManagementService, private route: ActivatedRoute,
    private translate: TranslateService) { }

  ngOnInit(): void {
    this.pageTitle = this.translate.instant(this.route.snapshot.data['titleKey']);
    this.entityTypeId = this.route.snapshot.data['pageID'];
    this.getNews();
  }


  getNews(paging = false) {
    let params = new newsFilters();
    params.typeId = this.entityTypeId;
    params.skipCount = this.page * this.perPage;
    params.takeCount = this.perPage;
    this.managementService.getNews(params).subscribe({
      next: (res) => {
        if (paging) {
          this.news = [...this.news, ...res.data];
        } else {
          this.news = res.data;
        }
        this.totalElements = res.totalCount;
      }
    })
  }

  addNews() {
    let data = {} as dialogNewsData;
    data.type = 'add';
    data.utilityType = this.entityTypeId;
    data.pageName = this.pageTitle;
    let dialogRef = this.dialog.open(NewsFormComponent, {
      maxHeight: '80vh',
      maxWidth: '500px',
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getNews();
      }
    });
  }

  editNews(news: INews) {
    let data = {} as dialogNewsData;
    data.type = 'edit';
    data.news = news;
    data.utilityType = this.entityTypeId;
    data.pageName = this.pageTitle;
    let dialogRef = this.dialog.open(NewsFormComponent, {
      maxHeight: '80vh',
      maxWidth: '500px',
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getNews();
      }
    });
  }

  onDeleteNews(news: INews) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxHeight: '80vh',
      data: { mainTitle: `${this.translate.instant('management.msgToDeletedTypeOf')} ${this.pageTitle}?` },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'yes') {
        this.deleteNews(news.id);
      }
    });
  }

  deleteNews(id: number) {
    this.managementService.deleteNews(id, this.pageTitle).subscribe({
      next: (res) => {
        this.getNews();
      }
    })
  }

  showMore(card: INews) {
    this.selectedCard = card;
    this.drawer.toggle();
  }

  onPaginationChange() {
    this.page = this.page + 1;
    this.getNews(true);
  }

}
