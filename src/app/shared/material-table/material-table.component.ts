import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, ViewChild, Input, OnChanges, SimpleChanges, Output, EventEmitter, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';

export interface ITableColumn {
  label: string,
  icon?: string,
  key: string,
  conditions?: ITableColCondition[],
  colType?: MAT_TABLE_COL_TYPE,
  subLabel?: string,
  iconClass?: string,
  tooltip?: string
}

export interface ITableColCondition {
  key: string,
  value: string | boolean,
  classes: string
}
export interface ITableAction {
  name: string,
  icon?: string,
  actionId: string
}

export interface ITableActionEvent<T> {
  actionName: MAT_TABLE_ACTION_TYPE | ITableAction['actionId'],
  data?: T | IMatTablePaginationEvent
}

export interface IMatTablePaginationEvent {
  page: number,
  perPage: number
}

export enum MAT_TABLE_COL_TYPE {
  DATE = 'DATE',
  DATETIME = 'DATETIME',
  IMAGE = "IMAGE",
  ICON = 'ICON',
  NUMBER = 'NUMBER'
}

export enum MAT_TABLE_ACTION_TYPE {
  PAGINATION = 'PAGINATION',
  ROW_CLICK = 'ROW_CLICK'
}

@Component({
  selector: 'app-material-table',
  templateUrl: './material-table.component.html',
  styleUrl: './material-table.component.scss',
  imports: [
    CommonModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    TranslateModule,
    MatTooltipModule,
    DecimalPipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MaterialTableComponent<T> implements AfterViewInit, OnChanges {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @Input() dataTable!: Partial<T[]>;
  dataSource: MatTableDataSource<any> = new MatTableDataSource(this.dataTable);

  @Output() getAction: EventEmitter<ITableActionEvent<T>> = new EventEmitter();
  @Input() selectedId!: number | null;
  @Input() cols!: ITableColumn[];
  displayedColumns!: string[];
  @Input() defaultSearch = true;
  @Input() actions!: ITableAction[];
  @Input() totalElements!: number;
  @Input() pageSize: number = 10;
  colsTypes = MAT_TABLE_COL_TYPE;
  actionTypes = MAT_TABLE_ACTION_TYPE;
  ngOnChanges(changes: SimpleChanges) {
    this.dataSource = new MatTableDataSource(this.dataTable);
    this.displayedColumns = this.cols.map(col => col.key);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  onPaginationChange(e: PageEvent) {
    let pagination: IMatTablePaginationEvent = {
      page: e.pageIndex,
      perPage: e.pageSize
    }
    this.getAction.emit({ actionName: MAT_TABLE_ACTION_TYPE.PAGINATION, data: pagination });
  }

  onRowClick(row: T) {
    this.getAction.emit({ actionName: MAT_TABLE_ACTION_TYPE.ROW_CLICK, data: row });
  }


}



