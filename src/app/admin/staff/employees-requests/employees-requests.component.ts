import { Component, DestroyRef, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog, MatDialogActions, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ApproveDeclineEmployeeRequest, dialogEmployeeRequestData, EmployeeRequestFilters, IEmployeeRequest } from 'src/app/models/staff.model';
import { StaffService } from 'src/app/services/staff.service';
import { EmployeeRequestFormComponent } from './employee-request-form/employee-request-form.component';
import { FormsModule, NgForm } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe, NgStyle } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { BidiModule } from '@angular/cdk/bidi';
import { MatSidenavModule } from '@angular/material/sidenav';
import { EmployeeRequestFiltersComponent } from './employee-request-filters/employee-request-filters.component';
import { RoleDirective } from 'src/app/directives/role.directive';
import { RoleAttrDirective } from 'src/app/directives/role-attr.directive';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-employees-requests',
  templateUrl: './employees-requests.component.html',
  styleUrl: './employees-requests.component.scss',
  imports: [MatSidenavModule, NgStyle, MatButtonModule, MatFormFieldModule, MatDialogActions, MatIconModule, BidiModule, EmployeeRequestFiltersComponent, MatTableModule, RoleAttrDirective, MatSortModule, MatSlideToggleModule, FormsModule, MatMenuModule, DatePipe, RoleDirective, MatInputModule, MatPaginatorModule, TranslateModule, MatDialogContent]
})
export class EmployeesRequestsComponent implements OnInit {
  @ViewChild('responseModal') responseModal: TemplateRef<any>;
  @ViewChild('approveDeclineModal') approveDeclineModal: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  employeeRequest: IEmployeeRequest[] = [];
  dataSource: MatTableDataSource<IEmployeeRequest>;
  displayedColumns: string[] = [
    'employeeName',
    'employeeJobTitle',
    'startDate',
    'endDate',
    'notes',
    'status',
    'creationDate',
    'response',
    'actions'
  ];

  totalElements: number;
  page: number = 0;
  width = screen.width;
  filters: EmployeeRequestFilters = new EmployeeRequestFilters();
  employeeRequestResponse: IEmployeeRequest;
  approveDeclineEmployeeRequest: ApproveDeclineEmployeeRequest = {} as ApproveDeclineEmployeeRequest;
  notes: string;

  public dialog = inject(MatDialog);
  private staffService = inject(StaffService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private commonService = inject(CommonService);

  constructor() { }

  ngOnInit(): void {
    this.filters.skipCount = 0;
    this.filters.takeCount = 10;
    this.commonService.fetchRouteFilters().subscribe((params) => {
      if (params) {
        this.filters = { ...params } as EmployeeRequestFilters;
        this.page = Math.floor(this.filters.skipCount / this.filters.takeCount);
      }
    });

    this.getEmployeeRequest();
  }

  applyFilter() {
    this.commonService.setRouteFilters(this.filters);
    this.getEmployeeRequest();
  }

  getEmployeeRequest() {
    this.filters = <EmployeeRequestFilters>Object.fromEntries(Object.entries(this.filters).filter(([k, v]) => v != null))

    this.staffService.getEmployeesRequests(this.filters).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.employeeRequest = res.data;
        this.totalElements = res.totalCount;
        this.dataSource = new MatTableDataSource(this.employeeRequest);
        this.dataSource.sort = this.sort;
      }
    })
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
    this.getEmployeeRequest();
  }

  openEmployeeRequestForm(actionType: string, employeeRequest?: IEmployeeRequest) {
    let data = {} as dialogEmployeeRequestData;
    if (employeeRequest) {
      data.employeeRequest = employeeRequest;
    }
    data.type = actionType;
    let dialogRef = this.dialog.open(EmployeeRequestFormComponent, {
      maxHeight: '80vh',
      maxWidth: '550px',
      data: data,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getEmployeeRequest();
      }
    });
  }

  showResponse(employeeRequest: IEmployeeRequest) {
    this.employeeRequestResponse = employeeRequest;

    if (this.employeeRequestResponse.moreInfo) {
      this.employeeRequestResponse.moreInfoDetails = this.employeeRequestResponse.moreInfo
        .split('\r\n')
        .filter((el) => el.trim().length !== 0);
    }
    else
      this.employeeRequestResponse.moreInfoDetails = [];

    this.dialog.open(this.responseModal, {
      maxHeight: '80vh',
      maxWidth: '600px',
    });
  }

  showApproveDecline(employeeRequest: IEmployeeRequest, isApprove: boolean, forFinal: boolean) {
    this.approveDeclineEmployeeRequest.requestId = employeeRequest.id;
    this.approveDeclineEmployeeRequest.isApprove = isApprove;
    this.approveDeclineEmployeeRequest.forFinal = forFinal;

    this.dialog.open(this.approveDeclineModal, {
      maxHeight: '80vh',
      width: '500px',
      autoFocus: false,
      disableClose: true
    });
  }

  approveDecline(form: NgForm) {
    if (form.form.status === 'VALID') {
      this.approveDeclineEmployeeRequest.notes = this.notes;

      const requestService = this.approveDeclineEmployeeRequest.forFinal
        ? this.staffService.finalApproveDeclineEmployeeRequest(this.approveDeclineEmployeeRequest)
        : this.staffService.approveDeclineEmployeeRequest(this.approveDeclineEmployeeRequest);

      requestService.subscribe({
        next: (res) => {
          this.getEmployeeRequest();
          this.closeDialog();
        }
      });
    }
  }

  closeDialog() {
    this.dialog.closeAll();
    this.notes = "";
    this.approveDeclineEmployeeRequest = {} as ApproveDeclineEmployeeRequest;

  }
}
