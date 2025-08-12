import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MemberNotificationsComponent } from './member-notifications.component';
import { SetupMemberNotificationComponent } from './setup-member-notification/setup-member-notification.component';

const routes: Routes = [
  { path: '', component: MemberNotificationsComponent },
  { path: 'notification/:notificationId', component: MemberNotificationsComponent },
  { path: 'setup-notification', component: SetupMemberNotificationComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MemberNotificationsRoutingModule { }
