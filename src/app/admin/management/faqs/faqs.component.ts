import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { IFAQ, dialogFAQData } from 'src/app/models/management.model';
import { ManagementService } from 'src/app/services/management.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { FaqFormComponent } from './faq-form/faq-form.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { SlicePipe } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RoleDirective } from '../../../directives/role.directive';

@Component({
    selector: 'app-faqs',
    templateUrl: './faqs.component.html',
    styleUrls: ['./faqs.component.scss'],
    imports: [RoleDirective, MatButtonModule, MatIconModule, MatTableModule, MatSortModule, MatMenuModule, MatPaginatorModule, SlicePipe, TranslateModule]
})
export class FaqsComponent implements OnInit {
  FAQs: IFAQ[] = [];
  dataSource: MatTableDataSource<IFAQ>;
  displayedColumns: string[] = [
    'question',
    'answer',
    'viewOrder',
    'actions'
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  totalElements: number;
  page: number = 0;
  perPage: number = 10;
  selectedFAQ: IFAQ = {} as IFAQ;
  actionType: string;
  constructor(public dialog: MatDialog, private managementService: ManagementService, private translate: TranslateService) { }

  ngOnInit(): void {
    this.getFAQs();
  }

  onPaginationChange(e: PageEvent) {
    this.page = e.pageIndex;
    this.perPage = e.pageSize;
    this.getFAQs();
  }

  getFAQs() {
    this.managementService.getFAQs().subscribe({
      next: (res) => {
        this.FAQs = res.data;
        this.totalElements = res.totalCount;
        this.dataSource = new MatTableDataSource(this.FAQs);
        this.dataSource.sort = this.sort;
      }
    })
  }

  openFAQModal(actionName: string, faq?: IFAQ) {
    let data: dialogFAQData = {} as dialogFAQData;
    data.type = actionName;
    data.faq = faq;
    let dialogRef = this.dialog.open(FaqFormComponent, {
      maxHeight: '80vh',
      maxWidth: '500px',
      data: data,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getFAQs();
      }
    });
  }

  onDeleteFAQ(faq: IFAQ) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxHeight: '80vh',
      data: { mainTitle: this.translate.instant('management.msgToDeletedFAQS') },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'yes') {
        this.deleteFAQ(faq.id);
      }
    });
  }

  deleteFAQ(faqID: number) {
    this.managementService.deleteFAQ(faqID).subscribe({
      next: (res) => {
        if (res) {
          this.getFAQs();
        }
      }
    });
  }


}
