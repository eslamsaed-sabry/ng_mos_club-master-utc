import { Component, OnInit, ViewChild, EventEmitter, Output, inject, DestroyRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { LookupType } from 'src/app/models/enums';
import { LostItemsFilters, ILostItem, dialogLostItemData, IDialogFoundByData } from 'src/app/models/extra.model';
import { ExtraService } from 'src/app/services/extra.service';
import { CommonService } from 'src/app/services/common.service';
import { forkJoin } from 'rxjs';
import { LostItemFormComponent } from './lost-item-form/lost-item-form.component';
import { FoundByFormComponent } from './found-by-form/found-by-form.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe } from '@angular/common';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-lost-items',
    templateUrl: './lost-items.component.html',
    styleUrls: ['./lost-items.component.scss'],
    imports: [MatFormFieldModule, MatSelectModule, FormsModule, MatOptionModule, MatButtonModule, MatIconModule, MatTableModule, MatSortModule, MatPaginatorModule, DatePipe, TranslateModule]
})
export class LostItemsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Output() refresh: EventEmitter<any> = new EventEmitter();
  lostItems: ILostItem[] = [];
  dataSource: MatTableDataSource<ILostItem>;
  displayedColumns: string[] = [
    'creationDate',
    'categoryName',
    'locationName',
    'itemDescription',
    'notes',
    'status',
    'deliveredDate',
    'deliver',
    'edit'
  ];
  width = screen.width;
  filters: LostItemsFilters = new LostItemsFilters();
  totalElements: number;
  page: number = 0;
  categories: any[] = [];
  locations: any[] = [];

  public dialog = inject(MatDialog);
  private extraService = inject(ExtraService);
  private common = inject(CommonService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private commonService = inject(CommonService);

  ngOnInit(): void {
    this.filters.skipCount = 0;
    this.filters.takeCount = 10;
    this.commonService.fetchRouteFilters().subscribe((params) => {
      if (params) {
        this.filters = { ...params } as LostItemsFilters;
        this.page = Math.floor(this.filters.skipCount / this.filters.takeCount);
      }
    });

    this.getLostItems();
    this.getLookUps();
  }

  applyFilter() {
    this.commonService.setRouteFilters(this.filters);
    this.getLostItems();
  }

  getLookUps() {

    forkJoin([
      this.common.getLookup(LookupType.LostCategory),
      this.common.getLookup(LookupType.LocationsInsideGym),
    ])
      .subscribe({
        next: ([categories, locations]) => {
          this.categories = categories;
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
    this.commonService.setRouteFilters(this.filters);
    this.getLostItems();
  }

  getLostItems() {
    this.extraService.getLostItems(this.filters).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.lostItems = res.data;
        this.totalElements = res.totalCount;
        this.dataSource = new MatTableDataSource(this.lostItems);
        this.dataSource.sort = this.sort;
      }
    })
  }

  onDeliver(row: ILostItem) {
    let data: IDialogFoundByData = {
      dialogType: "DELIVER",
      item: row
    }

    let dialogRef = this.dialog.open(FoundByFormComponent, {
      maxHeight: '80vh',
      data: data,
      disableClose: true,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'success') {
        this.deliver(result.data);
      }
    });
  }

  deliver(row: ILostItem) {
    this.extraService.markItemDelivered(row).subscribe({
      next: (res) => {
        this.getLostItems();
      }
    });
  };

  onFilterChange() {
    this.page = 0;
    this.filters.skipCount = this.page * this.filters.takeCount;
    this.getLostItems();
  }

  openItemModal(actionName: string, item?: ILostItem) {
    let data: dialogLostItemData = {} as dialogLostItemData;
    data.type = actionName;
    data.item = item;
    let dialogRef = this.dialog.open(LostItemFormComponent, {
      maxHeight: '80vh',
      maxWidth: '500px',
      data: data,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getLostItems();
      }
    });
  }
}
