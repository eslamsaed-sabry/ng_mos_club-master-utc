import { Pipe, PipeTransform } from '@angular/core';
import { IUserNotificationType } from '../models/common.model';

@Pipe({
    name: 'notification',
    standalone: true
})
export class NotificationTypePipe implements PipeTransform {

  transform(typeId: number): IUserNotificationType {
    let userNotification = {} as IUserNotificationType;
    switch (typeId) {
      case 1:
        userNotification.icon = 'person_add_alt';
        userNotification.textColorClass = 'mo-text-info-500';
        return userNotification;
       case 2:
       case 3:
        userNotification.icon = 'repeat';
        userNotification.textColorClass = 'mo-text-warning-500';
        return userNotification;
      default:
        userNotification.icon = 'notifications_none';
        return userNotification;
    }
  }

}
