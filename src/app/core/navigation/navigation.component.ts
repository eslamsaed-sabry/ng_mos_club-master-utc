import { Component, OnInit, inject } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { BrandService } from 'src/app/services/brand.service';
import { TranslateModule } from '@ngx-translate/core';
import { RoleDirective } from '../../directives/role.directive';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass } from '@angular/common';
import { IMenuItem, MENU_ITEMS } from 'src/app/models/main-nav.model';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  imports: [
    NgClass,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    RoleDirective,
    TranslateModule,
    MatInputModule
]
})
export class NavigationComponent implements OnInit {
  menuItems = MENU_ITEMS;
  isOpened: boolean;
  isHovered: boolean;
  brand = inject(BrandService).brand;
  theme: string = localStorage.getItem('theme') || 'light-theme';
  constructor(private common: CommonService) {
    this.common.getTheme.subscribe((res: any) => {
      if (res.theme) {
        this.theme = res.theme;
      }
    })
  }

  ngOnInit(): void {
    if (window.innerWidth < 1120) {
      this.common.updateMenuStatus(false);
    }
    this.common.getMenuStatus.subscribe((state) => {
      this.isOpened = state;
    });

  }

  onNavigate(item: IMenuItem) {
    if (window.innerWidth < 1120 && item.path) {
      this.common.updateMenuStatus(false);
    }
    if (item.children) {
      item.isExpanded = !item.isExpanded;
    }
  }

  onHover(status?: string) {
    if (!this.isOpened) {
      if (status === 'enable') {
        this.isOpened = true;
        this.isHovered = true;
        return
      }
    }
    if (this.isHovered) {
      this.isHovered = false;
      this.isOpened = false;
    }
  }


  onFilterMenuItems(event: Event) {
    const _value = (event.target as HTMLInputElement).value.trim().toLowerCase();
    const _mainMenu = document.getElementById("main-menu");
    this.getMenuItems(_mainMenu!, _value)
  }

  getMenuItems(ul: HTMLElement, searchTerm: string) {
    let hasVisibleChild = false;

    Array.from(ul.children).forEach(li => {
      const linkNameSpan = li.querySelector(".link-name");
      const linkText = linkNameSpan?.textContent?.toLowerCase() || "";

      const nestedUl = li.querySelector("ul");
      let childVisible = false;

      if (nestedUl) {
        childVisible = this.getMenuItems(nestedUl, searchTerm);
      }

      const match = linkText.includes(searchTerm);
      const shouldShow = match || childVisible;

      (li as HTMLElement).style.display = shouldShow ? "" : "none";
      hasVisibleChild = hasVisibleChild || shouldShow;
    });

    return hasVisibleChild;
  }
}
