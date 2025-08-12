import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChangeUserPasswordComponent } from 'src/app/admin/administration/users/change-user-password/change-user-password.component';
import { IAuthorizedUser } from 'src/app/models/user.model';
import { AppConfigService } from 'src/app/services/app-config.service';
import { AuthLoginService } from 'src/app/services/auth-login.service';
import { BrandService } from 'src/app/services/brand.service';
import { SignalRService } from 'src/app/services/signal-r.service';
import { TranslateModule } from '@ngx-translate/core';
import { RoleDirective } from '../../../directives/role.directive';
import { RouterLink } from '@angular/router';
import { MatOptionModule } from '@angular/material/core';

import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
    selector: 'app-user-menu',
    templateUrl: './user-menu.component.html',
    styleUrl: './user-menu.component.scss',
    imports: [MatMenuModule, MatIconModule, MatFormFieldModule, MatSelectModule, FormsModule, MatOptionModule, RouterLink, RoleDirective, TranslateModule]
})
export class UserMenuComponent {
  authLogin = inject(AuthLoginService)
  signalR = inject(SignalRService);
  dialog = inject(MatDialog);
  user: IAuthorizedUser = JSON.parse(localStorage.getItem('mosUser') || '');
  appConfig = inject(AppConfigService);
  brandService = inject(BrandService);
  proxyUrl = this.appConfig.envUrl;
  branchId = this.brandService.currentBranch ? this.brandService.currentBranch.id : null;
  onChangePW() {
    this.user.isAdmin = true;
    let dialogRef = this.dialog.open(ChangeUserPasswordComponent, {
      maxHeight: '80vh',
      maxWidth: '500px',
      data: { user: this.user, showCurrentPW: true },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
      }
    });
  }

  onChangeBranch() {
    let branch = this.brandService.branches.find(b => b.id === this.branchId);
    this.brandService.setBranch(branch!);
    window.location.reload();
  }

  logout() {
    this.authLogin.logout();
    this.signalR.closeConnection();
  }
}
