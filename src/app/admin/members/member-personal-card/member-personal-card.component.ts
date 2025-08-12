import { Component, Input, OnInit, TemplateRef, ViewChild, EventEmitter, Output, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CardStyle } from 'src/app/models/enums';
import { Member } from 'src/app/models/member.model';
import { AppConfigService } from 'src/app/services/app-config.service';
import { TranslateModule } from '@ngx-translate/core';
import { GenderPipe } from '../../../pipes/gender.pipe';

import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgClass, DatePipe } from '@angular/common';
import { PermissionsPipe } from 'src/app/pipes/permissions.pipe';
import { MembershipStatusPipe } from 'src/app/pipes/membership-status.pipe';
import { HiddenParentDirective } from 'src/app/directives/hidden-parent.directive';

@Component({
    selector: 'app-member-personal-card',
    templateUrl: './member-personal-card.component.html',
    styleUrls: ['./member-personal-card.component.scss'],
    imports: [NgClass, MatTooltipModule, MatIconModule, MatProgressSpinnerModule, MatButtonModule, RouterLink, DatePipe, GenderPipe, TranslateModule, MembershipStatusPipe, HiddenParentDirective],
    providers: [PermissionsPipe]
})
export class MemberPersonalCardComponent implements OnInit {
  @Output() showNotes: EventEmitter<any> = new EventEmitter();
  @ViewChild('photoModal') photoModal: TemplateRef<any>;
  @Input() personalData: Member;
  @Input() notesLength: number;
  @Input() style: string = CardStyle.standard;
  @Input() membershipStatus: number;
  @Input() pageName: string = '';
  public appConfig = inject(AppConfigService);
  proxyUrl = this.appConfig.envUrl;
  imageLoader: boolean = true;
  cardStyles = CardStyle;
  showBtns: boolean;
  barcode: string;
  dialog = inject(MatDialog);
  public permissionPipe = inject(PermissionsPipe);
  private router = inject(Router);
  ngOnInit(): void {
    this.showBtns = !window.location.pathname.split("/").includes("member-profile");
    this.barcode = `https://barcode.tec-it.com/barcode.ashx?data=${this.personalData.applicationNo}&code=Code128&translate-esc=true&hidehrt=True&width=100&height=20`
  }

  pictureZoom() {
    if (this.personalData.photo) {
      this.dialog.open(this.photoModal, {
        maxHeight: '95vh',
        maxWidth: '95vw'
      });
    }
  }

  editMember() {
    this.router.navigate(['/admin/form/member/edit'], {
      queryParams: { memberId: this.personalData.id }
    })
  }


  viewNotes() {
    this.showNotes.emit();
  }

}
