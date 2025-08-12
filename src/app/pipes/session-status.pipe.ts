import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'sessionStatus',
    standalone: true
})
export class SessionStatusPipe implements PipeTransform {
  // NotApproved = 0,
  // Approved = 1,
  // FinalApproved = 2
  transform(value: number, date: string): any {
    let now = new Date().getTime();
    let sessionDate = new Date(date).getTime();


    switch (value) {
      case 0:
        return 'Pending Approval';
      case 1:
        return 'Pending Final Approval';
      case 2:
        if (now > sessionDate) return 'Expired'
        else
          return 'Active';
    }
  }

}
