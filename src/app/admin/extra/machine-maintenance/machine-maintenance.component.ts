import { Component, OnInit, ViewChild, TemplateRef, inject, DestroyRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { IMachineMaintenance, MachineMaintenanceFilters, dialogMachineMaintenanceData } from 'src/app/models/extra.model';
import { ExtraService } from 'src/app/services/extra.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { MachineMaintenanceFormComponent } from './machine-maintenance-form/machine-maintenance-form.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { MatMenuModule } from '@angular/material/menu';
import { MachineMaintenanceFiltersComponent } from './machine-maintenance-filters/machine-maintenance-filters.component';
import { BidiModule } from '@angular/cdk/bidi';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgClass, DecimalPipe, DatePipe } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonService } from 'src/app/services/common.service';
@Component({
    selector: 'app-machine-maintenance',
    templateUrl: './machine-maintenance.component.html',
    styleUrls: ['./machine-maintenance.component.scss'],
    imports: [MatSidenavModule, NgClass, MatButtonModule, MatIconModule, BidiModule, MachineMaintenanceFiltersComponent, MatTableModule, MatSortModule, MatMenuModule, MatPaginatorModule, DecimalPipe, DatePipe, TranslateModule]
})
export class MachineMaintenanceComponent implements OnInit {
  @ViewChild('resolveModal') resolveModal: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  maintenance: IMachineMaintenance[] = [];
  dataSource: MatTableDataSource<IMachineMaintenance>;
  displayedColumns: string[] = [
    'maintenanceDate',
    'machineName',
    'cost',
    'notes',
    'actions'
  ];
  width = screen.width;
  filters: MachineMaintenanceFilters = new MachineMaintenanceFilters();
  totalElements: number;
  page: number;
  resolutionSummary: string;

  public dialog = inject(MatDialog);
  private translate = inject(TranslateService);
  private extraService = inject(ExtraService);
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
        this.filters = { ...params } as MachineMaintenanceFilters;
        this.page = Math.floor(this.filters.skipCount / this.filters.takeCount);
      }
    });
    this.getMaintenance();
  }

  applyFilter() {
    this.commonService.setRouteFilters(this.filters);
    this.getMaintenance();
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
    this.getMaintenance();
  }

  getMaintenance() {
    this.extraService.getMachineMaintenance(this.filters).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.maintenance = res.data;
        this.totalElements = res.totalCount;
        this.dataSource = new MatTableDataSource(this.maintenance);
        this.dataSource.sort = this.sort;
      }
    })
  }

  openMaintenanceForm(actionType: string, machineMaintenance?: IMachineMaintenance) {
    let data = {} as dialogMachineMaintenanceData;
    data.type = actionType;
    data.machineMaintenance = machineMaintenance;
    let dialogRef = this.dialog.open(MachineMaintenanceFormComponent, {
      maxHeight: '80vh',
      width: '500px',
      data: data,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getMaintenance();
      }
    });

  }

  deleteMaintenance(machineMaintenance: IMachineMaintenance) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxHeight: '80vh',
      data: { mainTitle: this.translate.instant('extra.msgToDeletedMaintenance') },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'yes') {
        this.extraService.deleteMachineMaintenance(machineMaintenance.id).subscribe({
          next: (res) => {
            this.getMaintenance();
          }
        })
      }
    });
  }

}
