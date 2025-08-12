import { Component, DestroyRef, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { AttachmentContextTypeId } from 'src/app/models/enums';
import { Entities } from 'src/app/models/permissions.model';
import { dialogAttachmentData, dialogStaffData, IStaff, StaffFilters } from 'src/app/models/staff.model';
import { StaffService } from 'src/app/services/staff.service';
import { AttachmentModalFormComponent } from 'src/app/shared/attachments/attachment-modal-form/attachment-modal-form.component';
import { AttachmentsComponent } from 'src/app/shared/attachments/attachments.component';
import { StaffFormComponent } from './staff-form/staff-form.component';
import { TranslateModule } from '@ngx-translate/core';
import { AttachmentsComponent as AttachmentsComponent_1 } from '../../../shared/attachments/attachments.component';
import { RoleAttrDirective } from '../../../directives/role-attr.directive';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { StaffDataFiltersComponent } from './staff-data-filters/staff-data-filters.component';
import { BidiModule } from '@angular/cdk/bidi';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgStyle } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-staff-data',
  templateUrl: './staff-data.component.html',
  styleUrls: ['./staff-data.component.scss'],
  imports: [MatSidenavModule, NgStyle, MatButtonModule, RouterLink, MatIconModule, BidiModule, StaffDataFiltersComponent, MatTableModule, MatSortModule, MatSlideToggleModule, FormsModule, MatMenuModule, MatPaginatorModule, RoleAttrDirective, AttachmentsComponent_1, TranslateModule]
})
export class StaffDataComponent implements OnInit {
  @ViewChild('attachmentsModal') attachmentsModal: TemplateRef<any>;
  @ViewChild('attachmentsComp') attachmentsComp: AttachmentsComponent;
  staff: IStaff[] = [];
  dataSource: MatTableDataSource<IStaff>;
  displayedColumns: string[] = [
    'code',
    'phoneNo',
    'englishName',
    // 'arabicName',
    'jobTitle',
    'managerName',
    'shiftName',
    'salary',
    'isActive',
    'status',
    'actions'
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  totalElements: number;
  page: number = 0;
  width = screen.width;
  filters: StaffFilters = new StaffFilters();
  selectedStaff: IStaff;
  contextTypeId = AttachmentContextTypeId.STAFF;
  isInstructor: boolean;
  isTrainer: boolean;

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
        this.filters = { ...params } as StaffFilters;
        this.page = Math.floor(this.filters.skipCount / this.filters.takeCount);
      }
    });

    this.filters.isActive = true;
    this.route.data.pipe(map((params) => {
      return Object.values(params)
    })).subscribe((params: string[]) => {
      this.prepareData(params);
    })
  }

  applyFilter() {
    this.commonService.setRouteFilters(this.filters);
    this.getStaff();
  }

  prepareData(params: string[]) {
    if (params.includes(Entities.INSTRUCTORS_DATA)) {
      this.displayedColumns = [
        'phoneNo',
        'englishName',
        // 'arabicName',
        'jobTitle',
        'managerName',
        'isActive',
        'status',
        'actions'
      ];
      this.isInstructor = true;
      this.filters.isInstructor = true;
      this.getStaff();
    }
    else if (params.includes(Entities.TRAINERS_DATA)) {
      this.isTrainer = true;
      this.filters.isTrainer = true;
      this.getStaff();

    } else {
      this.isInstructor = false;
      this.filters.isInstructor = false;
      this.getStaff();
    }
  }

  getStaff() {
    this.filters.isInstructor = this.isInstructor ? true : null;
    this.filters.isTrainer = this.isTrainer ? true : null;
    this.filters.isActive = (this.filters.isActive === false || this.filters.isActive === null) ? null : this.filters.isActive;
    this.filters = <StaffFilters>Object.fromEntries(Object.entries(this.filters).filter(([k, v]) => v != null))

    this.staffService.getStaff(this.filters).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.staff = res.data;
        this.totalElements = res.totalCount;
        this.dataSource = new MatTableDataSource(this.staff);
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
    this.getStaff();
  }

  openStaffForm(actionType: string, staff?: IStaff) {
    let data = {} as dialogStaffData;
    data.isInstructor = this.isInstructor;
    data.isTrainer = this.isTrainer;
    if (staff) {
      data.staff = staff;
    }
    data.type = actionType;
    let dialogRef = this.dialog.open(StaffFormComponent, {
      maxHeight: '80vh',
      maxWidth: '950px',
      data: data,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getStaff();
      }
    });
  }

  toggleStatus(staffMember: IStaff) {
    if (!staffMember.isActive) {
      this.staffService.deactivateStaffMember(staffMember.id).subscribe();
    } else {
      this.staffService.activateStaffMember(staffMember.id).subscribe();
    }
  }

  onAttachments(staff: IStaff) {
    this.selectedStaff = staff;
    this.dialog.open(this.attachmentsModal, {
      width: '800px',
      autoFocus: false
    });
  }


  addAttachment(staff: IStaff) {
    let data: dialogAttachmentData = {} as dialogAttachmentData;
    data.contextId = staff.id;
    data.contextTypeId = this.contextTypeId
    let dialogRef = this.dialog.open(AttachmentModalFormComponent, {
      maxHeight: '80vh',
      width: '300px',
      data: data,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.attachmentsComp.getAttachments();
      }
    });
  }


}
