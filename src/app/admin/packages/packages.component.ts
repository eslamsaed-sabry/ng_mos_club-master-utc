import { Component, OnInit, ViewChild, Output, EventEmitter, inject, DestroyRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { LookupType, PackageTypes } from 'src/app/models/enums';
import { IPackage, dialogPackageData } from 'src/app/models/member.model';
import { PackagesService } from 'src/app/services/packages.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { PackageFormComponent } from './package-form/package-form.component';
import { CommonService } from 'src/app/services/common.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { RoleAttrDirective } from '../../directives/role-attr.directive';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RoleDirective } from '../../directives/role.directive';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.scss'],
  imports: [MatSidenavModule, MatFormFieldModule, MatSelectModule, FormsModule, MatOptionModule, MatCheckboxModule, RoleDirective, MatButtonModule, MatIconModule, MatTableModule, MatSortModule, MatSlideToggleModule, MatMenuModule, RoleAttrDirective, NgClass, MatPaginatorModule, TranslateModule, MatInputModule],
  providers: [PackagesService]
})
export class PackagesComponent implements OnInit {
  @Output() refresh: EventEmitter<any> = new EventEmitter();
  private inputSearchSubject = new Subject<string>();
  sessions: IPackage[] = [];
  dataSource: MatTableDataSource<IPackage>;
  displayedColumns: string[] = [
    'packageTypeName',
    'nameEng',
    // 'nameAR',
    'duration',
    'durationType',
    'validDurationForUpgrade',
    'attendanceCount',
    'price',
    'status',
    'changeStatus',
    'showToMembers',
    'minFreeze',
    'actions'
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  totalElements: number;
  page: number = 0;
  perPage: number = 10;
  packageTypes: any[] = [];
  selectedPackageType: PackageTypes = PackageTypes.ALL;
  isActive: boolean = true;
  searchKey: string = "";

  public dialog = inject(MatDialog);
  private translate = inject(TranslateService);
  private packageService = inject(PackagesService);
  private common = inject(CommonService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  constructor() { }

  ngOnInit(): void {
    this.common.fetchRouteFilters().subscribe((params) => {
      if (params) {
        if (params.activeOnly || params.activeOnly == "true")
          params.activeOnly = true;

        if (params.includeSystemPackages || params.includeSystemPackages == "true")
          params.includeSystemPackages = true;

        if (params.membersPeriodsOnly || params.membersPeriodsOnly == "true")
          params.membersPeriodsOnly = true;

        this.isActive = params.activeOnly;
        this.selectedPackageType = params?.packageTypeId ? params?.packageTypeId : PackageTypes.ALL;
        this.searchKey = params.searchKey
        this.page = params.skipCount;
        this.perPage = params.takeCount;
      }
    });

    this.getPackagesTypes();
    this.getPackages();

    this.inputSearchSubject.pipe(
      debounceTime(1200)
    ).subscribe(value => {
      this.applyFilter();
    });
  }

  onPaginationChange(e: PageEvent) {
    this.page = e.pageIndex;
    this.perPage = e.pageSize;

    let props = {
      activeOnly: this.isActive,
      membersPeriodsOnly: false,
      includeSystemPackages: false,
      packageTypeId: this.selectedPackageType == (PackageTypes.ALL || null) ? null : this.selectedPackageType,
      searchKey: this.searchKey,
      skipCount: this.page,
      takeCount: this.perPage
    }

    this.common.setRouteFilters(props);
    this.getPackages();
  }

  getPackages() {
    let props = {
      activeOnly: this.isActive,
      membersPeriodsOnly: false,
      includeSystemPackages: false,
      packageTypeId: this.selectedPackageType == (PackageTypes.ALL || null) ? null : this.selectedPackageType,
      searchKey: this.searchKey,
      skipCount: this.page,
      takeCount: this.perPage
    }


    this.packageService.getPackages(props).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.sessions = res.data;
        this.totalElements = res.totalCount;
        this.dataSource = new MatTableDataSource(this.sessions);
        this.dataSource.sort = this.sort;
      }
    })
  }

  getPackagesTypes() {
    this.common.getLookup(LookupType.PackageType).subscribe({
      next: (res: any) => {
        this.packageTypes = res;
      }
    })
  }

  addPackage() {
    let data = {} as dialogPackageData;
    data.type = 'add';
    let dialogRef = this.dialog.open(PackageFormComponent, {
      maxHeight: '80vh',
      maxWidth: '850px',
      data: data,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getPackages();
      }
    });
  }

  editPackage(currentPackage: IPackage) {
    let data = {} as dialogPackageData;
    data.type = 'edit';
    data.package = currentPackage;
    let dialogRef = this.dialog.open(PackageFormComponent, {
      maxHeight: '80vh',
      maxWidth: '850px',
      data: data,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getPackages();
      }
    });
  }

  onDeletePackage(currentPackage: IPackage) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxHeight: '80vh',
      data: { mainTitle: this.translate.instant('members.msgToDeletedPackage') },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'yes') {
        this.deletePackage(currentPackage.id);
      }
    });
  }

  deletePackage(packageID: number) {
    this.packageService.deletePackage(packageID).subscribe({
      next: (res) => {
        if (res) {
          this.getPackages();
        }
      }
    })
  }

  toggleStatus(memberPackage: IPackage) {
    if (memberPackage.isActive) {
      this.packageService.deactivatePackage(memberPackage.id).subscribe();
    } else {
      this.packageService.activatePackage(memberPackage.id).subscribe();
    }
  }

  onSearchInput(value: string) {
    this.inputSearchSubject.next(value);
  }

  applyFilter() {
    this.page = 0;

    let props = {
      activeOnly: this.isActive,
      membersPeriodsOnly: false,
      includeSystemPackages: false,
      packageTypeId: this.selectedPackageType == (PackageTypes.ALL || null) ? null : this.selectedPackageType,
      searchKey: this.searchKey,
      skipCount: this.page,
      takeCount: this.perPage
    }

    this.common.setRouteFilters(props);
    this.getPackages();
  }
}
