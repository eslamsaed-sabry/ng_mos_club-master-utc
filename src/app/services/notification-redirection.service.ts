import { Injectable } from '@angular/core';

export interface INotificationRedirection {
  url: string,
  contextId: number | null,
  extra?: string
}

export enum NOTIFICATION_TYPE_ID {
  POTENTIAL_MEMBER = 1,
  MEMBER = 2,
  MEMBERSHIP = 3,
  REMINDERS = 4,
  COMPLAINTS = 9,
  COMPLAINT_COMMENT = 10,
  MEMBER_TASKS = 11,
  ATTENDANCE = 12,
  FREE_PRIVATE_TRAINING = 24,
}

@Injectable()
export class NotificationRedirectionService {

  getRedirectionUrl(notificationType: NOTIFICATION_TYPE_ID, contextId: number): INotificationRedirection {
    switch (notificationType) {
      case NOTIFICATION_TYPE_ID.POTENTIAL_MEMBER:
      case NOTIFICATION_TYPE_ID.MEMBER:
        return { url: `/admin/member-profile`, contextId: contextId };

      case NOTIFICATION_TYPE_ID.MEMBERSHIP:
        return { url: `/admin/memberships`, contextId: contextId };

      case NOTIFICATION_TYPE_ID.REMINDERS:
        return { url: `/admin/extra/reminders`, contextId: contextId };

      case NOTIFICATION_TYPE_ID.COMPLAINTS:
        return { url: `/admin/extra/complaints`, contextId: contextId };
      case NOTIFICATION_TYPE_ID.COMPLAINT_COMMENT:
        return { url: `/admin/extra/complaints`, contextId: contextId, extra: 'openComment' };
      case NOTIFICATION_TYPE_ID.MEMBER_TASKS:
        return { url: `/admin/member-profile`, contextId: contextId, extra: 'tasks' };
      case NOTIFICATION_TYPE_ID.ATTENDANCE:
        return { url: `/admin/attendance`, contextId: contextId };
      case NOTIFICATION_TYPE_ID.FREE_PRIVATE_TRAINING:
        return { url: `/admin/freePrivateTraining`, contextId: contextId };
      default:
        return { url: '', contextId: null }

    }
  }



}
