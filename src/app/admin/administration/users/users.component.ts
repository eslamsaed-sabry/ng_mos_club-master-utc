import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { dialogUserData } from 'src/app/models/member.model';
import { IAuthorizedUser, IUser } from 'src/app/models/user.model';
import { AdministrationService } from 'src/app/services/administration.service';
import { ChangeUserPasswordComponent } from './change-user-password/change-user-password.component';
import { UserFormComponent } from './user-form/user-form.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
    imports: [MatFormFieldModule, MatIconModule, MatInputModule, MatTableModule, MatSortModule, MatSlideToggleModule, FormsModule, MatButtonModule, MatPaginatorModule, TranslateModule]
})
export class UsersComponent implements OnInit, OnDestroy {
  dataSource: MatTableDataSource<IAuthorizedUser>;
  displayedColumns: string[] = [
    // 'id',
    'englishName',
    'arabicName',
    'userName',
    'role',
    'isActive',
    'status',
    'edit',
    'changePW'
  ];
  isActive: boolean | undefined;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public dialog: MatDialog, private adminService: AdministrationService) { }

  ngOnInit(): void {
    this.getUsers();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getUsers() {
    if (this.isActive != false) {
      this.isActive = undefined;
    }
    this.adminService.getUsers(this.isActive).subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    })
  }

  toggleStatus(user: IAuthorizedUser) {
    if (!user.isActive) {
      this.adminService.deactivateUser(user.id).subscribe();
    } else {
      this.adminService.activateUser(user.id).subscribe();
    }
  }

  openUserForm(actionType: string, user?: IAuthorizedUser) {
    let data = {} as dialogUserData;
    if (user) {
      data.user = user;
    }
    data.type = actionType;
    let dialogRef = this.dialog.open(UserFormComponent, {
      maxHeight: '80vh',
      maxWidth: '500px',
      data: data,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getUsers();
      }
    });
  }

  changePW(user: IAuthorizedUser) {
    user.isAdmin = false;
    let dialogRef = this.dialog.open(ChangeUserPasswordComponent, {
      maxHeight: '80vh',
      maxWidth: '500px',
      data: { user: user, showCurrentPW: false },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
      }
    });
  }

  ngOnDestroy(): void {
    this.dialog.closeAll();
  }

}
