import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { IRole } from 'src/app/models/common.model';
import { dialogRoleData } from 'src/app/models/member.model';
import { AdministrationService } from 'src/app/services/administration.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { RoleFormComponent } from './role-form/role-form.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RoleDirective } from '../../../directives/role.directive';

@Component({
    selector: 'app-roles',
    templateUrl: './roles.component.html',
    styleUrls: ['./roles.component.scss'],
    imports: [RoleDirective, MatButtonModule, MatIconModule, MatTableModule, MatSortModule, MatPaginatorModule, TranslateModule]
})
export class RolesComponent implements OnInit {
  calls: IRole[] = [];
  dataSource: MatTableDataSource<IRole>;
  displayedColumns: string[] = [
    // 'id',
    'nameAr',
    'nameEng',
    'edit',
    'delete'
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public dialog: MatDialog, private adminService: AdministrationService, private translate: TranslateService) { }

  ngOnInit(): void {
    this.getRoles();
  }

  getRoles() {
    this.adminService.getRoles().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    })
  }

  onDeleteRole(role: IRole) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxHeight: '80vh',
      data: {
        mainTitle: `${this.translate.instant('administration.msgToDeletedRole')} ( ${role.nameAr + ' ' + role.nameEng} )?`
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'yes') {
        this.adminService.deleteRole(role.id).subscribe({
          next: (res) => {
            this.getRoles();
          }
        })
      }
    });
  }

  openRoleForm(actionType: string, role?: IRole) {
    let data = {} as dialogRoleData;
    if (role) {
      data.role = role;
    }
    data.type = actionType;
    let dialogRef = this.dialog.open(RoleFormComponent, {
      maxHeight: '80vh',
      data: data,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getRoles();
      }
    });
  }


}
