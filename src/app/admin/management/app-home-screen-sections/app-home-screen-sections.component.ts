import { DatePipe, NgStyle, SlicePipe } from '@angular/common';
import { Component, DestroyRef, EventEmitter, inject, OnInit, Output, TemplateRef, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PageID } from 'src/app/models/enums';
import { dialogNewsData, INews, INewsTypes, newsFilters } from 'src/app/models/management.model';
import { AppConfigService } from 'src/app/services/app-config.service';
import { ManagementService } from 'src/app/services/management.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NewsAppHomeScreenSectionsFormComponentFormComponent } from './app-home-screen-sections-form/app-home-screen-sections-form.component';
import { EventBookingsComponent } from '../event-bookings/event-bookings.component';

@Component({
  selector: 'app-app-home-screen-sections',
  templateUrl: './app-home-screen-sections.component.html',
  styleUrl: './app-home-screen-sections.component.scss',
  imports: [MatButtonModule, MatIconModule, NgStyle, SlicePipe, DatePipe, TranslateModule,
    MatFormFieldModule, MatSelectModule, FormsModule, EventBookingsComponent]

})
export class AppHomeScreenSectionsComponent implements OnInit {
  eventBookingModalRef = viewChild<TemplateRef<unknown>>('eventBookingModalRef');
  @Output() refresh: EventEmitter<any> = new EventEmitter();
  moreDetailsTempRef = viewChild<TemplateRef<unknown>>('moreDetailsTempRef');
  news: INews[] = [];
  totalElements: number;
  page: number = 0;
  perPage: number = 10;
  pageTitle: string;
  appConfig = inject(AppConfigService);
  proxyUrl = this.appConfig.envUrl;
  selectedCard: INews;
  typeSelected: INewsTypes;
  pageID = PageID;
  newsTypes: INewsTypes[] = [];

  private destroyRef = inject(DestroyRef);
  public dialog = inject(MatDialog);
  private managementService = inject(ManagementService);
  private translate = inject(TranslateService);

  ngOnInit(): void {
    this.GetNewsTypes();
  }

  GetNewsTypes() {
    this.managementService.GetNewsTypes().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.newsTypes = res;
        this.typeSelected = this.newsTypes[0];
        this.getNews();
      }
    })
  }


  getNews(changedNewsType = false, paging = false) {
    if (changedNewsType) {
      this.page = 0;
      this.perPage = 10;
    }

    let params = new newsFilters();
    params.typeId = this.typeSelected.id;
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
    this.getPageTitle();

    let data = {} as dialogNewsData;
    data.type = 'add';
    data.utilityType = this.typeSelected.id;
    data.pageName = this.pageTitle;

    let dialogRef = this.dialog.open(NewsAppHomeScreenSectionsFormComponentFormComponent, {
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
    this.getPageTitle();
    let data = {} as dialogNewsData;
    data.type = 'edit';
    data.news = news;
    data.utilityType = this.typeSelected.id;
    data.pageName = this.pageTitle;
    let dialogRef = this.dialog.open(NewsAppHomeScreenSectionsFormComponentFormComponent, {
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
    this.getPageTitle();

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
    this.getPageTitle();
    this.managementService.deleteNews(id, this.pageTitle).subscribe({
      next: (res) => {
        this.getNews();
      }
    })
  }

  showMore(card: INews) {
    this.selectedCard = card;
    this.dialog.open(this.moreDetailsTempRef()!, {
      width: '600px'
    });
  }

  onPaginationChange() {
    this.page = this.page + 1;
    this.getNews(false, true);
  }

  getPageTitle() {
    if (this.typeSelected.id == PageID.NEWS)
      this.pageTitle = this.translate.instant('navigation.news');
    else if (this.typeSelected.id == PageID.EVENTS)
      this.pageTitle = this.translate.instant('navigation.events');
    else if (this.typeSelected.id == PageID.OFFERS)
      this.pageTitle = this.translate.instant('navigation.offers');
    else if (this.typeSelected.id == PageID.DAILY_SCHEDULE)
      this.pageTitle = this.translate.instant('navigation.dailySchedule');
  }

  openEventBookings(event: INews) {
    const _dialogRef = this.dialog.open(this.eventBookingModalRef()!, {
      data: event,
      width: '800px'
    });
  }

}
