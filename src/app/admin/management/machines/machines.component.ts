import { Component, OnInit, ViewChild, EventEmitter, Output, inject, DestroyRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { LookupType } from 'src/app/models/enums';
import { CommonService } from 'src/app/services/common.service';
import { forkJoin } from 'rxjs';
import { MachineFormComponent } from './machine-form/machine-form.component';
import { dialogMachineData, IMachine, MachinesFilters } from 'src/app/models/management.model';
import { ManagementService } from 'src/app/services/management.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DecimalPipe, DatePipe } from '@angular/common';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-machines',
    templateUrl: './machines.component.html',
    styleUrls: ['./machines.component.scss'],
    imports: [MatFormFieldModule, MatSelectModule, FormsModule, MatOptionModule, MatButtonModule, MatIconModule, MatTableModule, MatSortModule, MatPaginatorModule, DecimalPipe, DatePipe, TranslateModule]
})
export class MachinesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Output() refresh: EventEmitter<any> = new EventEmitter();
  machines: IMachine[] = [];
  dataSource: MatTableDataSource<IMachine>;
  displayedColumns: string[] = [
    'machineName',
    'modelName',
    'locationName',
    'purchaseDate',
    'purchasePrice',
    'edit',
    'delete'
  ];
  width = screen.width;
  filters: MachinesFilters = new MachinesFilters();
  totalElements: number;
  page: number = 0;
  machinesModels: any[] = [];
  locations: any[] = [];

  public dialog = inject(MatDialog);
  private managementService = inject(ManagementService);
  private translate = inject(TranslateService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private common = inject(CommonService);

  constructor() { }

  ngOnInit(): void {
    this.filters.skipCount = 0;
    this.filters.takeCount = 10;
    this.common.fetchRouteFilters().subscribe((params) => {
      if (params) {
        this.filters = { ...params } as MachinesFilters;
        this.page = Math.floor(this.filters.skipCount / this.filters.takeCount);
      }
    });
    this.getMachines();
    this.getLookUps();
  }

  applyFilter() {
    this.common.setRouteFilters(this.filters);
    this.getMachines();
  }

  getLookUps() {
    forkJoin([
      this.common.getLookup(LookupType.MachineModels),
      this.common.getLookup(LookupType.LocationsInsideGym),
    ])
      .subscribe({
        next: ([machines, locations]) => {
          this.machinesModels = machines;
          this.locations = locations;
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
    this.common.setRouteFilters(this.filters);
    this.getMachines();
  }

  getMachines() {
    this.managementService.getMachines(this.filters).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.machines = res.data;
        this.totalElements = res.totalCount;
        this.dataSource = new MatTableDataSource(this.machines);
        this.dataSource.sort = this.sort;
      }
    })
  }

  onFilterChange() {
    this.page = 0;
    this.filters.skipCount = 0 * this.filters.takeCount;

    this.getMachines();
  }

  openMachineModal(actionName: string, machine?: IMachine) {
    let data: dialogMachineData = {} as dialogMachineData;
    data.type = actionName;
    data.machine = machine;
    let dialogRef = this.dialog.open(MachineFormComponent, {
      maxHeight: '80vh',
      maxWidth: '500px',
      data: data,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getMachines();
      }
    });
  }

  onDelete(machine: IMachine) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxHeight: '80vh',
      data: { mainTitle: this.translate.instant('management.msgToDeletedMachine') },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'yes') {
        this.deleteMachine(machine);
      }
    });
  }

  deleteMachine(machine: IMachine) {
    this.managementService.deleteMachine(machine.id).subscribe({
      next: (res) => {
        this.getMachines();
      }
    });
  };


}
