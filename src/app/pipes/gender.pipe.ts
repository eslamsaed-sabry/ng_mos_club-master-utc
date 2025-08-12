import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
    name: 'gender',
    standalone: true
})
export class GenderPipe implements PipeTransform {

  constructor(private translate: TranslateService) { }

  transform(value: number): string {
    if (value === 1)
      return this.translate.instant('members.male')
    else
      return this.translate.instant('members.female');
  }

}
