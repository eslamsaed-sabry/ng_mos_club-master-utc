import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { IGymRule } from 'src/app/models/management.model';
import { ManagementService } from 'src/app/services/management.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { SlicePipe } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RoleDirective } from '../../../directives/role.directive';

@Component({
    selector: 'app-gym-rules',
    templateUrl: './gym-rules.component.html',
    styleUrls: ['./gym-rules.component.scss'],
    imports: [RoleDirective, MatButtonModule, MatIconModule, MatTableModule, MatSortModule, MatCheckboxModule, FormsModule, MatMenuModule, MatPaginatorModule, MatFormFieldModule, MatInputModule, SlicePipe, TranslateModule]
})
export class GymRulesComponent implements OnInit {
  @ViewChild('gymRulesFormModal') gymRulesFormModal: TemplateRef<any>;
  gymRules: IGymRule[] = [];
  dataSource: MatTableDataSource<IGymRule>;
  displayedColumns: string[] = [
    'title',
    'englishDescription',
    'showOnReceipt',
    'showOnPTReceipt',
    'showOnMobileApp',
    'actions'
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  totalElements: number;
  page: number = 0;
  perPage: number = 10;
  selectedGymRule: IGymRule = {} as IGymRule;
  actionType: string;
  constructor(public dialog: MatDialog, private managementService: ManagementService, private translate: TranslateService) { }

  ngOnInit(): void {
    this.getGymRules();
  }

  onPaginationChange(e: PageEvent) {
    this.page = e.pageIndex;
    this.perPage = e.pageSize;
    this.getGymRules();
  }

  getGymRules() {
    this.managementService.getGymRules().subscribe({
      next: (res) => {
        this.gymRules = res.data;
        this.totalElements = res.totalCount;
        this.dataSource = new MatTableDataSource(this.gymRules);
        this.dataSource.sort = this.sort;
      }
    })
  }

  openGymRuleModal(actionType: string, gymRule: IGymRule = {} as IGymRule) {
    this.actionType = actionType;
    this.selectedGymRule = gymRule;
    this.dialog.open(this.gymRulesFormModal, {
      maxHeight: '80vh',
      width: '600px',
    });
  }

  toggleStatus(gymRule: IGymRule) {
    this.selectedGymRule = gymRule;
    this.managementService.editGymRule(this.selectedGymRule).subscribe();
  }

  submit(form: NgForm) {
    if (form.form.status === 'VALID') {
      if (this.actionType === 'add') {
        this.managementService.addGymRule(this.selectedGymRule).subscribe({
          next: () => {
            this.dialog.closeAll();
            this.getGymRules();
          }
        })
      } else {
        this.edit();
      }
    }
  }

  edit() {
    this.managementService.editGymRule(this.selectedGymRule).subscribe({
      next: () => {
        this.getGymRules();
        this.dialog.closeAll();
      }
    })
  }

  onDeleteGymRule(gymRule: IGymRule) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxHeight: '80vh',
      data: { mainTitle: this.translate.instant('management.msgToDeletedGymRule') },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'yes') {
        this.deleteGymRule(gymRule.id);
      }
    });
  }

  deleteGymRule(gymRuleID: number) {
    this.managementService.deleteGymRule(gymRuleID).subscribe({
      next: (res) => {
        if (res) {
          this.getGymRules();
        }
      }
    });
  }

  onChange(row: IGymRule) {
    this.selectedGymRule = row;
    this.edit();
  }
}
