import { Component, OnInit, ViewChild, TemplateRef, inject } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ISessionType } from 'src/app/models/management.model';
import { ManagementService } from 'src/app/services/management.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MemberService } from 'src/app/services/member.service';
import { LookupType } from 'src/app/models/enums';
import { MatOptionModule } from '@angular/material/core';

import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-session-types',
  templateUrl: './session-types.component.html',
  styleUrls: ['./session-types.component.scss'],
  imports: [MatButtonModule, MatIconModule, MatTableModule, MatSortModule, MatSlideToggleModule, FormsModule, MatMenuModule, MatPaginatorModule, MatFormFieldModule, MatInputModule, TranslateModule, MatOptionModule, MatSelectModule]

})
export class SessionTypesComponent implements OnInit {
  @ViewChild('sessionTypeFormModal') sessionTypeFormModal: TemplateRef<any>;
  sessionTypes: ISessionType[] = [];
  dataSource: MatTableDataSource<ISessionType>;
  displayedColumns: string[] = [
    'englishName',
    'arabicName',
    'price',
    'isActive',
    'changeStatus',
    'actions'
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  totalElements: number;
  page: number = 0;
  perPage: number = 10;
  selectedSessionType: ISessionType = {} as ISessionType;
  actionType: string;
  incomeTypes: any[] = [];

  private memberService = inject(MemberService);


  constructor(public dialog: MatDialog, private managementService: ManagementService, private translate: TranslateService) { }

  ngOnInit(): void {
    this.getSessionTypes();
    this.getIncomeType();
  }

  onPaginationChange(e: PageEvent) {
    this.page = e.pageIndex;
    this.perPage = e.pageSize;
    this.getSessionTypes();
  }

  getSessionTypes() {
    this.managementService.getSessionTypes().subscribe({
      next: (res) => {
        this.sessionTypes = res.data;
        this.totalElements = res.totalCount;
        this.dataSource = new MatTableDataSource(this.sessionTypes);
        this.dataSource.sort = this.sort;
      }
    })
  }

  getIncomeType() {
    this.memberService.getLookup(LookupType.IncomeType).subscribe({
      next: (res: any) => {
        this.incomeTypes = res;
      }
    })
  }

  openSessionTypeModal(actionType: string, sessionType: ISessionType = {} as ISessionType) {
    this.actionType = actionType;
    this.selectedSessionType = sessionType;
    this.dialog.open(this.sessionTypeFormModal, {
      maxHeight: '80vh',
      maxWidth: '500px',
    });
  }

  toggleStatus(sessionType: ISessionType) {
    this.selectedSessionType = sessionType;
    this.managementService.editSessionTypes(this.selectedSessionType).subscribe();
  }

  submit(form: NgForm) {
    if (form.form.status === 'VALID') {
      if (this.actionType === 'add') {
        this.managementService.addSessionTypes(this.selectedSessionType).subscribe({
          next: () => {
            this.dialog.closeAll();
            this.getSessionTypes();
          }
        })
      } else {
        this.managementService.editSessionTypes(this.selectedSessionType).subscribe({
          next: () => {
            this.getSessionTypes();
            this.dialog.closeAll();
          }
        })
      }
    }
  }

  onDeleteSessionType(sessionType: ISessionType) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxHeight: '80vh',
      data: { mainTitle: this.translate.instant('members.msgToDeletedSessionType') },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'yes') {
        this.deleteSessionType(sessionType.id);
      }
    });
  }

  deleteSessionType(sessionTypeID: number) {
    this.managementService.deleteSessionType(sessionTypeID).subscribe({
      next: (res) => {
        if (res) {
          this.getSessionTypes();
        }
      }
    });
  }

}
