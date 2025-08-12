
import { Component, DestroyRef, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ILookUp } from 'src/app/models/common.model';
import { LookupType } from 'src/app/models/enums';
import { CallsFeedbackFilters, ICallsFeedback } from 'src/app/models/management.model';
import { CommonService } from 'src/app/services/common.service';
import { ManagementService } from 'src/app/services/management.service';

@Component({
    selector: 'app-calls-feedback',
    templateUrl: './calls-feedback.component.html',
    styleUrl: './calls-feedback.component.scss',
    imports: [MatButtonModule, MatIconModule, MatCheckboxModule, MatTableModule, MatSortModule, MatSlideToggleModule, FormsModule, MatMenuModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatPaginatorModule, TranslateModule]
})
export class CallsFeedbackComponent implements OnInit {
  @ViewChild('callFeedbackFormModal') callFeedbackFormModal: TemplateRef<any>;
  callFeedbackList: ICallsFeedback[] = [];
  relatedMemberStatus: ILookUp[] = [];
  dataSource: MatTableDataSource<ICallsFeedback>;
  displayedColumns: string[] = [
    'nameEng',
    'showFollowUpDate',
    'isSummaryMandatory',
    'isActive',
    'relatedMemberStatusName',
    'actions'
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  totalElements: number;
  page: number = 0;
  perPage: number = 10;
  actionType: string;
  selectedCallFeedback: ICallsFeedback = {} as ICallsFeedback;
  filters: CallsFeedbackFilters = new CallsFeedbackFilters();


  public dialog = inject(MatDialog);
  private managementService = inject(ManagementService);
  private common = inject(CommonService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.getCallsFeedback();
    this.getRelatedMemberStatus();
  }

  onPaginationChange(e: PageEvent) {
    this.page = e.pageIndex;
    this.perPage = e.pageSize;
    this.getCallsFeedback();
  }

  getCallsFeedback() {
    this.filters.skipCount = this.page * this.perPage;
    this.filters.takeCount = this.perPage;

    this.managementService.getCallsFeedback(this.filters).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.callFeedbackList = res.data;
        this.totalElements = res.totalCount;
        this.dataSource = new MatTableDataSource(this.callFeedbackList);
        this.dataSource.sort = this.sort;
      }
    })
  }

  getRelatedMemberStatus() {
    this.common.getLookup(LookupType.RelatedMemberStatus).subscribe({
      next: (res: any) => {
        this.relatedMemberStatus = res;
      }
    })
  }

  openCallFeedbackModal(actionType: string, callFeedback: ICallsFeedback = {} as ICallsFeedback) {
    this.actionType = actionType;
    this.selectedCallFeedback = callFeedback;
    this.selectedCallFeedback.name = this.selectedCallFeedback.nameEng;

    if (actionType === "add")
      this.selectedCallFeedback.viewOrder = 1;

    this.dialog.open(this.callFeedbackFormModal, {
      maxHeight: '80vh',
      width: '600px',
    });
  }

  toggleStatus(gymRule: ICallsFeedback) {
    this.selectedCallFeedback = gymRule;
    this.selectedCallFeedback.name = this.selectedCallFeedback.nameEng;
    this.managementService.editCallsFeedback(this.selectedCallFeedback).subscribe();
  }

  submit(form: NgForm) {
    if (form.form.status === 'VALID') {
      if (this.actionType === 'add') {
        this.managementService.addCallsFeedback(this.selectedCallFeedback).subscribe({
          next: () => {
            this.dialog.closeAll();
            this.getCallsFeedback();
          }
        })
      } else {
        this.edit();
      }
    }
  }

  edit() {
    this.managementService.editCallsFeedback(this.selectedCallFeedback).subscribe({
      next: () => {
        this.getCallsFeedback();
        this.dialog.closeAll();
      }
    })
  }

  onChange(row: ICallsFeedback) {
    this.selectedCallFeedback = row;
    this.selectedCallFeedback.name = this.selectedCallFeedback.nameEng;
    this.edit();
  }





}
