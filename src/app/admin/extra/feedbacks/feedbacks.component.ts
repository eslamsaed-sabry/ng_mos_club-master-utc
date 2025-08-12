import { BidiModule } from '@angular/cdk/bidi';
import { DatePipe, NgClass } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FeedbacksFilters, IFeedback } from 'src/app/models/extra.model';
import { CommonService } from 'src/app/services/common.service';
import { ExtraService } from 'src/app/services/extra.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { FeedbacksFiltersComponent } from './feedbacks-filters/feedbacks-filters.component';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RoleDirective } from 'src/app/directives/role.directive';

@Component({
  selector: 'app-feedbacks',
  templateUrl: './feedbacks.component.html',
  styleUrl: './feedbacks.component.scss',
  imports: [MatSidenavModule, NgClass, MatButtonModule, MatIconModule, BidiModule, FeedbacksFiltersComponent,
    MatTableModule, MatSortModule, RouterLink, MatMenuModule, MatPaginatorModule, MatFormFieldModule,
    MatInputModule, FormsModule, TranslateModule, RoleDirective]
})
export class FeedbacksComponent implements OnInit {
  @ViewChild('phoneModal') phoneModal: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  feedbacks: IFeedback[] = [];
  phoneModalData: IFeedback = {} as IFeedback;
  dataSource: MatTableDataSource<IFeedback>;
  displayedColumns: string[] = [
    'memberContractNo',
    'memberPhone',
    'memberName',
    'feedbackSubject',
    'feedbackDescription',
    'actions'
  ];

  width = screen.width;
  filters: FeedbacksFilters = new FeedbacksFilters();
  totalElements: number;
  perPage: number;
  page: number;
  resolutionSummary: string;
  public dialog = inject(MatDialog);
  private extraService = inject(ExtraService);
  private translate = inject(TranslateService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private commonService = inject(CommonService);

  ngOnInit(): void {
    if (this.route.snapshot.queryParams['contextId']) {
      this.filters.id = +this.route.snapshot.queryParams['contextId'];
    }
    this.filters.skipCount = 0;
    this.filters.takeCount = 10;
    this.commonService.fetchRouteFilters().subscribe((params) => {
      if (params) {
        this.filters = { ...params } as FeedbacksFilters;
        this.page = Math.floor(this.filters.skipCount / this.filters.takeCount);
      }
    });
    this.getFeedbacks();
  }

  applyFilter() {
    this.commonService.setRouteFilters(this.filters);
    this.getFeedbacks();
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
    this.commonService.setRouteFilters(this.filters);
    this.getFeedbacks();
  }

  getFeedbacks() {
    this.extraService.getFeedbacks(this.filters).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.feedbacks = res.data;
        this.totalElements = res.totalCount;
        this.dataSource = new MatTableDataSource(this.feedbacks);
        this.dataSource.sort = this.sort;
      }
    })
  }

  deleteFeedback(feedback: IFeedback) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxHeight: '80vh',
      data: { mainTitle: this.translate.instant('members.msgToDeletedFeedback') },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'yes') {
        this.extraService.deleteFeedback(feedback.id).subscribe({
          next: (res) => {
            this.getFeedbacks();
          }
        })
      }
    });
  }

  openPhonePopup(feedback: IFeedback) {
    this.phoneModalData = feedback;
    this.dialog.open(this.phoneModal, {
      autoFocus: false,
      width: '400px',
    });
  }
}
