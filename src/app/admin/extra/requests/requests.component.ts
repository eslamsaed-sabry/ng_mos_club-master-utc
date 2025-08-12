import { BidiModule } from '@angular/cdk/bidi';
import { DatePipe, NgClass } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RequestsFiltersComponent } from './requests-filters/requests-filters.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogActions, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { dialogRequestData, IRequest, IRequestComment, RequestsFilters } from 'src/app/models/extra.model';
import { ExtraService } from 'src/app/services/extra.service';
import { CommonService } from 'src/app/services/common.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RequestsFormComponent } from './requests-form/requests-form.component';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrl: './requests.component.scss',
  imports: [MatSidenavModule, NgClass, MatButtonModule, MatIconModule, BidiModule, RequestsFiltersComponent, MatTableModule, MatSortModule, RouterLink, MatMenuModule, MatPaginatorModule, MatDialogTitle, MatDialogContent, MatFormFieldModule, MatInputModule, FormsModule, MatDialogActions, DatePipe, TranslateModule]
})
export class RequestsComponent implements OnInit {
  @ViewChild('commentModal') commentModal: TemplateRef<any>;
  @ViewChild('viewCommentsModal') viewCommentsModal: TemplateRef<any>;
  @ViewChild('phoneModal') phoneModal: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  requests: IRequest[] = [];
  phoneModalData: IRequest = {} as IRequest;
  selectedRequest: IRequest;
  dataSource: MatTableDataSource<IRequest>;
  displayedColumns: string[] = [
    'memberContractNo',
    'memberPhone',
    'memberName',
    'typeName',
    'requestDescription',
    'totalComments',
    'actions'
  ];
  width = screen.width;
  filters: RequestsFilters = new RequestsFilters();
  totalElements: number;
  perPage: number;
  page: number;
  resolutionSummary: string | null;
  comments: IRequestComment[] = [];
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
        this.filters = { ...params } as RequestsFilters;
        this.page = Math.floor(this.filters.skipCount / this.filters.takeCount);
      }
    });
    this.getRequests();
  }

  applyFilter() {
    this.commonService.setRouteFilters(this.filters);
    this.getRequests();
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
    this.getRequests();
  }

  getRequests() {
    this.extraService.getRequests(this.filters).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.requests = res.data;
        this.totalElements = res.totalCount;
        this.dataSource = new MatTableDataSource(this.requests);
        this.dataSource.sort = this.sort;
      }
    })
  }

  openRequestForm(actionType: string, request?: IRequest, showSearch = true) {
    let data = {} as dialogRequestData;
    data.type = actionType;
    data.showSearch = showSearch;
    data.request = request;
    let dialogRef = this.dialog.open(RequestsFormComponent, {
      maxHeight: '80vh',
      width: '700px',
      data: data,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getRequests();
      }
    });
  }

  deleteRequest(requests: IRequest) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxHeight: '80vh',
      data: { mainTitle: this.translate.instant('members.msgToDeletedRequest') },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'yes') {
        this.extraService.deleteRequest(requests.id).subscribe({
          next: (res) => {
            this.getRequests();
          }
        })
      }
    });
  }

  onComment(request: IRequest) {
    this.selectedRequest = request;
    this.dialog.open(this.commentModal, {
      width: '300px'
    });
  }

  comment() {
    let obj = {
      "requestId": this.selectedRequest.id,
      "summary": this.resolutionSummary,
      "memberId": this.selectedRequest.memberId
    }
    this.extraService.addRequestComment(obj).subscribe({
      next: () => {
        this.resolutionSummary = null;
        this.getRequests();
        this.dialog.closeAll();
      }
    })
  }

  viewRequestComments(request: IRequest) {
    this.selectedRequest = request;
    this.extraService.getRequestComments(request.id).subscribe({
      next: (res) => {
        this.comments = res.data;
        this.dialog.open(this.viewCommentsModal, {
          minWidth: '400px'
        })
      }
    })
  }

  openPhonePopup(request: IRequest) {
    this.phoneModalData = request;
    this.dialog.open(this.phoneModal, {
      autoFocus: false,
      width: '400px',
    });
  }
}
