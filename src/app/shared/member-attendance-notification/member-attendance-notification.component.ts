import { Component, OnInit, Input, inject } from '@angular/core';
import { MemberService } from 'src/app/services/member.service';
import { SignalRService } from 'src/app/services/signal-r.service';
import { FullMember, MembershipMatchedData } from '../../models/member.model';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PhotoCompareComponent } from '../photo-compare/photo-compare.component';
import { IMemberPhotoDialog } from 'src/app/models/common.model';
import { AppConfigService } from 'src/app/services/app-config.service';
import { TranslateModule } from '@ngx-translate/core';
import { MembershipStatusPipe } from '../../pipes/membership-status.pipe';
import { MatIconModule } from '@angular/material/icon';
import { NgClass, NgStyle } from '@angular/common';
import { BrandService } from 'src/app/services/brand.service';

@Component({
    selector: 'app-member-attendance-notification',
    templateUrl: './member-attendance-notification.component.html',
    styleUrls: ['./member-attendance-notification.component.scss'],
    imports: [MatIconModule, NgClass, NgStyle, MembershipStatusPipe, TranslateModule]
})
export class MemberAttendanceNotificationComponent implements OnInit {
  private brandService = inject(BrandService);
  @Input() id: number;
  membersNotifications: FullMember[] = [] as FullMember[];
  public appConfig = inject(AppConfigService);
  proxyUrl = this.appConfig.envUrl;
  user = JSON.parse(localStorage.getItem('mosUser')!);
  constructor(private memberService: MemberService, private signalR: SignalRService, private router: Router,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.signalR.getMemberAtt.subscribe((data: {memberId: number, branchId: number}) => {
      if (data.branchId === this.brandService.currentBranch.id) {
        this.getMemberInfo(data.memberId);
      }
    })
  }

  getMemberInfo(id: number) {
    let props: any = {
      searchText: id,
      searchMethod: 0,
      includeSearchByPhone: true,
      autoAddAttendance: false,
      branchId: this.brandService.currentBranch.id,
      showSpinner: 'false'
    };
    this.memberService.getFullMemberData(props).subscribe({
      next: (res) => {
        res.data.show = true;
        this.signalR.playNotification(res.data.membershipMatchedData.statusCode === 1);
        this.membersNotifications.push(res.data);
        this.getUnlockDoor(res.data.membershipMatchedData);
        this.autoDismiss();
      }
    })
  }

  getUnlockDoor(membership: MembershipMatchedData) {
    if (membership.statusCode === 1) {
      if (this.user.gateUrl) {
        this.memberService.unlockGate(this.user.gateUrl).subscribe({
          next: (res) => {
            console.warn('Gate is unlocked.')
          }
        });
      }
    }
  }

  autoDismiss() {
    this.membersNotifications.forEach((el, index) => {
      el.show = false;
      setTimeout(() => {
        if (!el.show)
          this.membersNotifications.splice(index, 1)
      }, 8000 * (index + 1));
    })
  }

  onImgCompare(notification: FullMember) {
    let data: IMemberPhotoDialog = {
      confirmedPhoto: notification.personalData.confirmedPhoto,
      newPhoto: notification.personalData.photo,
      memberId: notification.personalData.id
    };

    let dialogRef = this.dialog.open(PhotoCompareComponent, {
      maxHeight: '80vh',
      width: '600px',
      data: data,
      disableClose: true,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  openMemberMonitoring(m: FullMember) {
    this.membersNotifications = this.membersNotifications.filter(el => el.personalData.id != m.personalData.id);
    this.router.navigate(['/admin/attendance-monitoring'], {
      queryParams: {
        code: m.personalData.code
      }
    })
  }

  dismiss(e: Event, m: FullMember) {
    e.stopPropagation();
    this.membersNotifications = this.membersNotifications.filter(el => el.personalData.id != m.personalData.id);
  }
}
