import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'membershipStatus',
    standalone: true
})
export class MembershipStatusPipe implements PipeTransform {

  transform(value: number): any {
    switch (value) {
      case 0:
        return 'Expired'
      case 1:
        return 'Active'
      case 2:
        return 'Postponed'
      case 3:
        return 'Freezed'
      case 4:
        return 'Suspended'
      case 5:
        return 'Cancelled'
      case 6:
        return 'PendingApproval'
      case 7:
        return 'Transferred';
      default:
        return 'Active';
    }
  }

}
