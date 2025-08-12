import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { IRole, IPermission } from 'src/app/models/common.model';
import { AdministrationService } from 'src/app/services/administration.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RoleDirective } from '../../../directives/role.directive';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

interface PermissionList {
  pageName: string,
  permissions: IPermission[];
  hide: boolean;
}

@Component({
    selector: 'app-permissions',
    templateUrl: './permissions.component.html',
    styleUrls: ['./permissions.component.scss'],
    imports: [MatFormFieldModule, MatInputModule, RoleDirective, MatButtonModule, MatIconModule, MatSelectModule, FormsModule, MatOptionModule, MatExpansionModule, NgClass, MatCheckboxModule, TranslateModule]
})
export class PermissionsComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  roles: IRole[] = [];
  selectedRole: number = 1;
  permissionsList: PermissionList[] = [];
  selectedPermissions: IPermission[] = [];
  constructor(private adminService: AdministrationService) { }

  ngOnInit(): void {
    this.getRoles();
    this.getPermissions();
  }

  getRoles() {
    this.adminService.getRoles().subscribe({
      next: (res) => {
        this.roles = res.data;
      }
    })
  }

  getPermissions() {
    this.permissionsList = [];
    this.adminService.getPermissions(this.selectedRole).subscribe({
      next: (res) => {
        let pageNames: any[] = [];
        res.data.forEach((permission: IPermission) => {
          if (!pageNames.includes(permission.pageName)) {
            pageNames.push(permission.pageName)
          }
        });
        pageNames.forEach((name) => {
          let obj: PermissionList = {} as PermissionList;
          obj.pageName = name;
          obj.permissions = [];
          res.data.forEach((permission: IPermission) => {
            if (permission.pageName === name)
              obj.permissions.push(permission)
          });

          this.permissionsList.push(obj);
        })
      }
    })
  }

  onChange(p: IPermission) {
    this.selectedPermissions.push(p);
  }

  onSearch(value: any) {
    this.permissionsList.forEach(o => {
      if ((o.pageName).toLowerCase().includes(value.target.value.toLowerCase())) {
        o.hide = false;
      } else {
        o.hide = true;
      }
    });
  }

  save() {
    this.adminService.editPermissions(this.selectedRole, this.selectedPermissions).subscribe((res) => {
      if (res.data) {
        this.selectedPermissions = [];
      }
    })
  }
}
