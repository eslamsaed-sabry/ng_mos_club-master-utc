import { Component, EventEmitter, OnInit, Output, Input, inject } from '@angular/core';
import { Member, styleMemberAction } from 'src/app/models/member.model';
import { AppConfigService } from 'src/app/services/app-config.service';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RoleDirective } from '../../directives/role.directive';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgClass, NgStyle } from '@angular/common';
import { MemberActionsComponent } from '../member-actions/member-actions.component';

@Component({
    selector: 'app-member-card',
    templateUrl: './member-card.component.html',
    styleUrls: ['./member-card.component.scss'],
    imports: [MemberActionsComponent, NgClass, NgStyle, MatProgressSpinnerModule, RoleDirective, MatButtonModule, MatIconModule, RouterLink, TranslateModule]
})
export class MemberCardComponent implements OnInit {
  public appConfig = inject(AppConfigService);
  proxyUrl = this.appConfig.envUrl;

  @Input() member: Member;
  @Output() onAction: EventEmitter<{ actionType: string, member: Member }> = new EventEmitter();
  imageLoader: boolean = true;
  styleMember: styleMemberAction;

  constructor() { }

  ngOnInit(): void {
    this.styleMember = {} as styleMemberAction;
    this.styleMember.isButton = false;
  }
}
