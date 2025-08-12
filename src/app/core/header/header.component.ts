import { Component, OnInit, inject, DOCUMENT } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { dialogMemberSessionData, dialogPossibleMemberData } from 'src/app/models/member.model';
import { CommonService } from 'src/app/services/common.service';
import { SessionFormComponent } from 'src/app/admin/members/sessions/session-form/session-form.component';
import { SearchConfig } from 'src/app/models/common.model';
import { Redirection, Theme } from 'src/app/models/enums';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { PotentialMemberFormComponent } from 'src/app/admin/members/potential-members/potential-member-form/potential-member-form.component';

import { UserMenuComponent } from './user-menu/user-menu.component';
import { UserNotificationsComponent } from '../user-notifications/user-notifications.component';
import { DayNightSwitcherComponent } from '../../shared/day-night-switcher/day-night-switcher.component';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { RoleAttrDirective } from '../../directives/role-attr.directive';
import { AdvancedSearchComponent } from '../../shared/advanced-search/advanced-search.component';
import { RoleDirective } from '../../directives/role.directive';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    imports: [
    MatButtonModule,
    MatIconModule,
    RoleDirective,
    AdvancedSearchComponent,
    RoleAttrDirective,
    RouterLink,
    MatTooltipModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatOptionModule,
    DayNightSwitcherComponent,
    UserNotificationsComponent,
    UserMenuComponent,
    TranslateModule
]
})
export class HeaderComponent implements OnInit {
  isOpened: boolean = true;
  screen: number;
  selectedLang: string;
  zoomLevel: string = 'zoom-lg';
  searchConfig: SearchConfig = {
    placeholder: this.translate.instant('common.topSearchPlaceholder'),
    redirectionType: Redirection.Profile,
    theme: Theme.Header,
    parentClass: 'HEADER'
  };
  document = inject(DOCUMENT);
  constructor(
    private translate: TranslateService,
    public common: CommonService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.screen = window.innerWidth;
    this.selectedLang = localStorage.getItem('mosLang') || 'en';
    // this.dateAdapter.setLocale(this.selectedLang === 'en' ? 'en-UK' : this.selectedLang);

    this.common.getMenuStatus.subscribe(status => {
      this.isOpened = status;
    })

    this.zoomLevel = localStorage.getItem('mosZoom') || 'zoom-lg';
  }

  onChangeLang(lang: string) {
    // document.location.reload();
    this.selectedLang = lang;
    let dir = this.selectedLang === 'en' ? 'ltr' : 'rtl';
    this.translate.use(this.selectedLang);
    localStorage.setItem('mosLang', this.selectedLang);
    let htmlTag = this.document.getElementsByTagName("html")[0] as HTMLHtmlElement;
    htmlTag.dir = dir;
    htmlTag.lang = this.selectedLang;
  }


  toggleSideMenu() {
    this.isOpened = !this.isOpened;
    this.common.updateMenuStatus(this.isOpened);
  }

  openSessionForm() {
    let data = {} as dialogMemberSessionData;
    data.type = 'addSession';
    let dialogRef = this.dialog.open(SessionFormComponent, {
      maxHeight: '80vh',
      width: '500px',
      data: data,
    });
  }

  onNewPotentialMember() {
    let data = {} as dialogPossibleMemberData;
    data.type = 'addMember';

    let dialogRef = this.dialog.open(PotentialMemberFormComponent, {
      maxHeight: '80vh',
      width: '500px',
      data: data,
      disableClose: true,
      autoFocus: false
    });

  }

  onChangeZoom() {
    switch (this.zoomLevel) {
      case 'zoom-md':
        document.body.className = "zoom-md";
        localStorage.setItem('mosZoom', 'zoom-md');
        break;
      case 'zoom-sm':
        document.body.className = "zoom-sm";
        localStorage.setItem('mosZoom', 'zoom-sm');
        break;
      default:
        document.body.className = "zoom-lg";
        localStorage.setItem('mosZoom', 'zoom-lg');
        break;
    }
  }




}
