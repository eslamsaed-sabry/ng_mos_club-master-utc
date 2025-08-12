import { Component, OnInit, ViewChild, TemplateRef, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ILookUp } from 'src/app/models/common.model';
import { DataListTypeName, LookupType } from 'src/app/models/enums';
import { dialogLookupData } from 'src/app/models/staff.model';
import { CommonService } from 'src/app/services/common.service';
import { StaffService } from 'src/app/services/staff.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { DataListFormComponent } from './data-list-form/data-list-form.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgStyle } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { debounceTime, Subject } from 'rxjs';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-data-list',
  templateUrl: './data-list.component.html',
  styleUrls: ['./data-list.component.scss'],
  imports: [MatButtonModule, MatIconModule, MatTableModule, MatSortModule, NgStyle, MatSlideToggleModule, MatInputModule, FormsModule, MatMenuModule, MatPaginatorModule, TranslateModule, MatSelectModule, MatFormFieldModule]
})
export class DataListComponent implements OnInit {
  @ViewChild('expensesTypeFormModal') expensesTypeFormModal: TemplateRef<any>;
  private inputSearchSubject = new Subject<string>();
  dataList: ILookUp[] = [];
  dataSource: MatTableDataSource<ILookUp>;
  displayedColumns: string[] = [
    'name',
    'viewOrder',
    'isActive',
    'actions'
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public dialog = inject(MatDialog);
  private route = inject(ActivatedRoute);
  private staffService = inject(StaffService);
  private common = inject(CommonService);
  private translate = inject(TranslateService);
  // classGenre$ = this.common.getLookup(LookupType.ClassGenres);

  totalElements: number;
  page: number = 0;
  perPage: number = 10;
  actionType: string;
  allLookupType = LookupType;
  lookupTypeID: LookupType;
  lookupName: DataListTypeName;
  typesNames = DataListTypeName;
  searchKey: string = "";
  // classGenreId = ''; // needed if data list type is class program


  ngOnInit(): void {
    this.lookupTypeID = this.route.snapshot.data['dataType'];
    this.lookupName = this.route.snapshot.data['typeName'].toLowerCase();
    this.getDataList();
    this.inputSearchSubject.pipe(
      debounceTime(1200)
    ).subscribe(value => {
      this.getDataList();
    });
    if (this.lookupTypeID === LookupType.ClassPrograms || this.lookupTypeID === LookupType.ReservationTypes) {
      this.displayedColumns = ['colorHex', 'name', 'viewOrder', 'isActive', 'actions']
    } else if (this.lookupTypeID === LookupType.ClassesTypes) {
      this.displayedColumns = ['colorHex', 'program', 'name', 'viewOrder', 'isActive', 'actions']
    }
  }

  onPaginationChange(e: PageEvent) {
    this.page = e.pageIndex;
    this.perPage = e.pageSize;
  }

  // getSelectedGenre(){
  //   this.getDataList(`&GenreId=${this.classGenreId}`)
  // }

  getDataList(params = '') {
    this.common.getLookup(this.lookupTypeID, null, params, this.searchKey).subscribe({
      next: (res: any) => {
        this.dataList = res;
        this.totalElements = res.length;
        this.dataSource = new MatTableDataSource(this.dataList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    })
  }

  openLookupModal(actionType: string, lookupItem: ILookUp = {} as ILookUp) {
    this.actionType = actionType;
    let data: dialogLookupData = {
      type: this.actionType,
      lookup: lookupItem,
      lookupName: this.lookupName,
      lookupTypeId: this.lookupTypeID
    }
    let dialogRef = this.dialog.open(DataListFormComponent, {
      maxHeight: '80vh',
      data: data,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getDataList();
      }
    });
  }

  toggleStatus(lookupItem: ILookUp) {
    this.staffService.editLookup(this.lookupTypeID, lookupItem, this.lookupName).subscribe();
  }


  onDeleteLookup(dataItem: ILookUp) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxHeight: '80vh',
      data: { mainTitle: this.translate.instant('management.msgToDeletedType') },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'yes') {
        this.deleteLookup(dataItem.id);
      }
    });
  }

  deleteLookup(lookupID: number) {
    this.staffService.deleteLookup(lookupID, this.lookupTypeID, this.lookupName).subscribe({
      next: (res) => {
        if (res) {
          this.getDataList();
        }
      }
    });
  }

  onSearchInput(value: string) {
    this.inputSearchSubject.next(value);
  }

}
