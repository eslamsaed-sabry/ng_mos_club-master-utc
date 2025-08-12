import { Component, DestroyRef, Input, TemplateRef, ViewChild, inject, output } from '@angular/core';
import { IBookingListMember } from 'src/app/models/schedule.model';
import { AppConfigService } from 'src/app/services/app-config.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { NgClass } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { ScheduleService } from 'src/app/services/schedule.service';
import { RoleDirective } from 'src/app/directives/role.directive';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Membership } from 'src/app/models/member.model';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-single-booking-list-item',
  templateUrl: './single-booking-list-item.component.html',
  styleUrls: ['./single-booking-list-item.component.scss'],
  imports: [NgClass, MatButtonModule, RouterLink, TranslateModule, MatMenuModule, MatIcon, RoleDirective, MatSelectModule, MatDialogModule, FormsModule]
})
export class SingleBookingListItemComponent {
  @ViewChild('memberMembershipsModalRef') memberMembershipsModalRef: TemplateRef<any>;
  public appConfig = inject(AppConfigService);
  proxyUrl = this.appConfig.envUrl;
  private dialog = inject(MatDialog);
  @Input() item: IBookingListMember;
  onRefresh = output();
  private translate = inject(TranslateService)
  private scheduleService = inject(ScheduleService);
  private destroyRef = inject(DestroyRef);
  memberships: Membership[];
  membershipId: number;
  removeMemberFromClass(item: IBookingListMember) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxHeight: '80vh',
      data: { mainTitle: this.translate.instant('members.msgToRemoveMemberFromClass') },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'yes') {
        this.scheduleService.removeClassBooking(item.memberId, item.classId).subscribe();
      }
    });
  }

  openMembershipDialog() {
    this.getMemberMemberships();
    this.dialog.open(this.memberMembershipsModalRef, { width: '300px' });
  }

  getMemberMemberships() {
    this.scheduleService.selectSubscription(this.item.memberId, true).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.memberships = res.data;
      }
    })
  }

  linkMembership() {
    if (this.membershipId) {
      this.scheduleService.linkMembership(this.item.memberId, this.item.classId, this.membershipId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (res) => {
          this.dialog.closeAll();
          this.onRefresh.emit();
        }
      })
    }
  }

}
