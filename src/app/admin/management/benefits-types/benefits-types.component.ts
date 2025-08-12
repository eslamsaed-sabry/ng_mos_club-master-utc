import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { StaffTypes } from 'src/app/models/enums';
import { IBenefitsType } from 'src/app/models/management.model';
import { ManagementService } from 'src/app/services/management.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RoleDirective } from '../../../directives/role.directive';

@Component({
    selector: 'app-benefits-types',
    templateUrl: './benefits-types.component.html',
    styleUrls: ['./benefits-types.component.scss'],
    imports: [RoleDirective, MatButtonModule, MatIconModule, MatTableModule, MatSortModule, MatMenuModule, MatPaginatorModule, FormsModule, MatFormFieldModule, MatInputModule, MatRadioModule, TranslateModule]
})
export class BenefitsTypesComponent implements OnInit {
  @ViewChild('benefitsTypeFormModal') benefitsTypeFormModal: TemplateRef<any>;
  benefits: IBenefitsType[] = [];
  dataSource: MatTableDataSource<IBenefitsType>;
  displayedColumns: string[] = [
    'name',
    'arabicName',
    'staffType',
    'actions'
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  totalElements: number;
  page: number = 0;
  perPage: number = 10;
  selectedBenefit: IBenefitsType = {} as IBenefitsType;
  actionType: string;
  staffTypes = StaffTypes;
  constructor(public dialog: MatDialog, private managementService: ManagementService, private translate: TranslateService) { }

  ngOnInit(): void {
    this.getBenefits();
  }

  onPaginationChange(e: PageEvent) {
    this.page = e.pageIndex;
    this.perPage = e.pageSize;
    this.getBenefits();
  }

  getBenefits() {
    this.managementService.getBenefitsTypes().subscribe({
      next: (res) => {
        this.benefits = res.data;
        this.totalElements = res.totalCount;
        this.dataSource = new MatTableDataSource(this.benefits);
        this.dataSource.sort = this.sort;
      }
    })
  }

  openBenefitModal(actionType: string, benefit: IBenefitsType = {} as IBenefitsType) {
    this.actionType = actionType;
    this.selectedBenefit = benefit;
    this.dialog.open(this.benefitsTypeFormModal, {
      maxHeight: '80vh',
      maxWidth: '550px',
    });
  }

  toggleStatus(benefit: IBenefitsType) {
    this.selectedBenefit = benefit;
    this.managementService.editBenefitsType(this.selectedBenefit).subscribe();
  }

  submit(form: NgForm) {
    if (form.form.status === 'VALID') {
      if (this.actionType === 'add') {
        this.managementService.addBenefitsType(this.selectedBenefit).subscribe({
          next: () => {
            this.dialog.closeAll();
            this.getBenefits();
          }
        })
      } else {
        this.managementService.editBenefitsType(this.selectedBenefit).subscribe({
          next: () => {
            this.getBenefits();
            this.dialog.closeAll();
          }
        })
      }
    }
  }

  onDeleteBenefit(benefit: IBenefitsType) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxHeight: '80vh',
      data: { mainTitle: this.translate.instant('members.msgToDeletedBenefits') },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'yes') {
        this.deleteBenefit(benefit.id);
      }
    });
  }

  deleteBenefit(benefitID: number) {
    this.managementService.deleteBenefitsType(benefitID).subscribe({
      next: (res) => {
        if (res) {
          this.getBenefits();
        }
      }
    });
  }

}
