import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment-timezone';
import { IAuthorizedUser } from '../models/user.model';

export enum DateType {
  NOW_DATE_TIME,
  CURRENT_DATE_TIME,
  NOW_DATE,
  NOW_TIME,
  DATE_TIME_INPUT,
  DATE_START,
  DATE_END,
  TO_UTC,
  TO_TIMEZONE,
  TO_UTC_FORMATTED,
  TO_TIMEZONE_FORMATTED,
  DATE_START_INPUT,
  DATE_END_INPUT
}

export enum DateFormats {
  MEDIUM = 'MMM DD yyyy hh:mm a',
  MEDIUM_DATE = 'dd/MM/yyyy',
  DATE_TIME_INPUT = 'YYYY-MM-DDTHH:mm'
}

@Pipe({
    name: 'standardDate',
    standalone: true
})
export class StandardDatePipe implements PipeTransform {

  user: IAuthorizedUser = JSON.parse(localStorage.getItem('mosUser')!);

  transform(date: any, dateType?: DateType, timezone?: string, format: string = DateFormats.MEDIUM): string {

    switch (dateType) {
      case DateType.NOW_DATE_TIME:
        const nowDateTime = moment().format();
        return nowDateTime;

      case DateType.DATE_TIME_INPUT:
        return moment(date).format(DateFormats.DATE_TIME_INPUT);

      case DateType.DATE_START:
        return moment(date).startOf('day').format();

      case DateType.DATE_END:
        return moment(date).endOf('day').format();

      case DateType.DATE_START_INPUT:
        return moment(date).startOf('day').format(DateFormats.DATE_TIME_INPUT);

      case DateType.DATE_END_INPUT:
        return moment(date).endOf('day').format(DateFormats.DATE_TIME_INPUT);

      case DateType.TO_UTC:
        return moment(date).utc().format();

      case DateType.TO_TIMEZONE:
        let tz = timezone ? timezone : this.user.timezone;
        return moment(date).tz(tz).format();

      case DateType.TO_UTC_FORMATTED:
        return moment(date).utc().format(format);

      case DateType.TO_TIMEZONE_FORMATTED:
        let tzFormatted = timezone ? timezone : this.user.timezone;
        return moment(date).tz(tzFormatted).format(format);

      default:
        const nowTime = moment().format('HH:mm');
        const currentDate = moment(date).format('yyyy-MM-DD');
        const currentFullDate = moment(currentDate + ' ' + nowTime).format();
        return currentFullDate;
    }


  }

}
