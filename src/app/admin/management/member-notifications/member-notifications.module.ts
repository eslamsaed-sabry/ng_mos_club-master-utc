import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MemberNotificationsRoutingModule } from './member-notifications-routing.module';

import { MemberNotificationsFiltersComponent } from './member-notifications-filters/member-notifications-filters.component';
import { SetupMemberNotificationComponent } from './setup-member-notification/setup-member-notification.component';
import { MemberNotificationsComponent } from './member-notifications.component';
import { TranslateModule } from '@ngx-translate/core';

import { FormsModule } from '@angular/forms';
import { MemberNotificationFormComponent } from './member-notification-form/member-notification-form.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';


@NgModule({
    imports: [
        CommonModule,
        MemberNotificationsRoutingModule,
        TranslateModule,
        
        FormsModule,
        PickerModule,
        
        MemberNotificationsComponent,
        SetupMemberNotificationComponent,
        MemberNotificationsFiltersComponent,
        MemberNotificationFormComponent
    ],
    exports: [
        MemberNotificationsComponent
    ]
})
export class MemberNotificationsModule { }
