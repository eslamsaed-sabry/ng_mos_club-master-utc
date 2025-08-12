import { Component, OnInit, ViewChild, TemplateRef, inject, DestroyRef } from '@angular/core';
import { MatDialog, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatPaginator, PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { IComplaint, ComplaintsFilters, dialogComplaintData, IComplaintComment } from 'src/app/models/extra.model';
import { ExtraService } from 'src/app/services/extra.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { ComplaintsFormComponent } from './complaints-form/complaints-form.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ComplaintsFiltersComponent } from './complaints-filters/complaints-filters.component';
import { BidiModule } from '@angular/cdk/bidi';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgClass, DatePipe } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonService } from 'src/app/services/common.service';
@Component({
  selector: 'app-complaints',
  templateUrl: './complaints.component.html',
  styleUrls: ['./complaints.component.scss'],
  imports: [MatSidenavModule, NgClass, MatButtonModule, MatIconModule, BidiModule, ComplaintsFiltersComponent, MatTableModule, MatSortModule, RouterLink, MatMenuModule, MatPaginatorModule, MatDialogTitle, MatDialogContent, MatFormFieldModule, MatInputModule, FormsModule, MatDialogActions, DatePipe, TranslateModule]
})
export class ComplaintsComponent implements OnInit {
  @ViewChild('resolveModal') resolveModal: TemplateRef<any>;
  @ViewChild('commentModal') commentModal: TemplateRef<any>;
  @ViewChild('viewCommentsModal') viewCommentsModal: TemplateRef<any>;
  @ViewChild('phoneModal') phoneModal: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  complaints: IComplaint[] = [];
  phoneModalData: IComplaint = {} as IComplaint;
  selectedComplaint: IComplaint;
  dataSource: MatTableDataSource<IComplaint>;
  displayedColumns: string[] = [
    'actionDate',
    'memberContractNo',
    'memberPhone',
    'memberName',
    'sectionName',
    'complaintSubject',
    'complaintDescription',
    'priorityName',
    'totalComments',
    'statusName',
    'resolutionDateAsString',
    'actions'
  ];
  width = screen.width;
  filters: ComplaintsFilters = new ComplaintsFilters();
  totalElements: number;
  perPage: number;
  page: number;
  resolutionSummary: string | null;
  comments: IComplaintComment[] = [];
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
        this.filters = { ...params } as ComplaintsFilters;
        this.page = Math.floor(this.filters.skipCount / this.filters.takeCount);
      }
    });
    this.getComplaints();
  }

  applyFilter() {
    this.commonService.setRouteFilters(this.filters);
    this.getComplaints();
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
    this.getComplaints();
  }

  getComplaints() {
    this.extraService.getComplaints(this.filters).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.complaints = res.data;
        this.totalElements = res.totalCount;
        this.dataSource = new MatTableDataSource(this.complaints);
        this.dataSource.sort = this.sort;
      }
    })
  }

  openComplaintForm(actionType: string, complaint?: IComplaint, showSearch = true) {
    let data = {} as dialogComplaintData;
    data.type = actionType;
    data.showSearch = showSearch;
    data.complaint = complaint;
    let dialogRef = this.dialog.open(ComplaintsFormComponent, {
      maxHeight: '80vh',
      width: '700px',
      data: data,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getComplaints();
      }
    });

  }

  deleteComplaint(complaint: IComplaint) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxHeight: '80vh',
      data: { mainTitle: this.translate.instant('members.msgToDeletedComplaint') },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'yes') {
        this.extraService.deleteComplaint(complaint.id, complaint.memberId).subscribe({
          next: (res) => {
            this.getComplaints();
          }
        })
      }
    });
  }

  onResolve(complaint: IComplaint) {
    this.selectedComplaint = complaint;
    this.dialog.open(this.resolveModal, {
      width: '300px'
    });
  }

  onComment(complaint: IComplaint) {
    this.selectedComplaint = complaint;
    this.dialog.open(this.commentModal, {
      width: '300px'
    });
  }

  resolve() {
    let obj = {
      "complaintId": this.selectedComplaint.id,
      "resolutionSummary": this.resolutionSummary
    }
    this.extraService.resolveComplaint(obj).subscribe({
      next: () => {
        this.resolutionSummary = null;
        this.getComplaints();
        this.dialog.closeAll();
      }
    })
  }
  comment() {
    let obj = {
      "complaintId": this.selectedComplaint.id,
      "summary": this.resolutionSummary,
      "memberId": this.selectedComplaint.memberId
    }
    this.extraService.addComplaintComment(obj).subscribe({
      next: () => {
        this.resolutionSummary = null;
        this.getComplaints();
        this.dialog.closeAll();
      }
    })
  }

  viewComplaintComments(complaint: IComplaint) {
    this.selectedComplaint = complaint;
    this.extraService.getComplaintComments(complaint.id).subscribe({
      next: (res) => {
        this.comments = res.data;
        this.dialog.open(this.viewCommentsModal, {
          minWidth: '400px'
        })
      }
    })
  }

  openPhonePopup(complaint: IComplaint) {
    this.phoneModalData = complaint;
    this.dialog.open(this.phoneModal, {
      autoFocus: false,
      width: '400px',
    });
  }
}
