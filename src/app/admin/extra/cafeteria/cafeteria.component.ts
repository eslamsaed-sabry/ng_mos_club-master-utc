import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ICafeteriaFilters, ICafeteriaItem } from 'src/app/models/extra.model';
import { ExtraService } from 'src/app/services/extra.service';
import { TranslateModule } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'app-cafeteria',
    templateUrl: './cafeteria.component.html',
    styleUrls: ['./cafeteria.component.scss'],
    imports: [MatFormFieldModule, MatIconModule, MatInputModule, MatButtonModule, MatTableModule, MatSortModule, MatPaginatorModule, DatePipe, TranslateModule]
})
export class CafeteriaComponent implements OnInit {
  dataSource: MatTableDataSource<ICafeteriaItem>;
  displayedColumns: string[] = [
    'transactionDate',
    'totalItems',
    'totalPrice',
    'memberId',
    'memberCode',
    'memberName',
    'view',
    'print'
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  cafeteria: ICafeteriaItem[];
  filters: ICafeteriaFilters = {} as ICafeteriaFilters;
  constructor(public dialog: MatDialog, private extraService: ExtraService) { }

  ngOnInit(): void {
    this.getCafeteriaItems();
  }

  getCafeteriaItems() {
    this.extraService.getCafeteriaItems(this.filters).subscribe({
      next: (res) => {
        this.cafeteria = res.data;
        this.dataSource = new MatTableDataSource(this.cafeteria);
        this.dataSource.sort = this.sort;
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addItem() { }







}
