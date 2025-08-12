import { Component, OnInit, inject } from '@angular/core';
import { CommonService } from '../services/common.service';
import { SignalRService } from '../services/signal-r.service';
import { MemberAttendanceNotificationComponent } from '../shared/member-attendance-notification/member-attendance-notification.component';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../core/header/header.component';
import { NavigationComponent } from '../core/navigation/navigation.component';
import { NgClass } from '@angular/common';
import { LoaderComponent } from '../shared/loader/loader.component';
import { BrandService } from 'src/app/services/brand.service';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss'],
    imports: [
    LoaderComponent,
    NgClass,
    NavigationComponent,
    HeaderComponent,
    RouterOutlet,
    MemberAttendanceNotificationComponent
]
})
export class AdminComponent implements OnInit {
  isOpened: boolean;
  isHovered: boolean;
  private common = inject(CommonService);
  private signalRService = inject(SignalRService);
  private brandService = inject(BrandService);

  ngOnInit(): void {
    this.signalRService.startConnection(this.brandService);
    this.common.getMenuStatus.subscribe((state) => {
      this.isOpened = state;
    });
  }

  onHover(status?: string) {
    if (!this.isOpened) {
      if (status === 'enable') {
        this.isOpened = true;
        this.isHovered = true;
        return;
      }
    }

    if (this.isHovered) {
      this.isOpened = false;
      this.isHovered = false;
    }
  }
}
