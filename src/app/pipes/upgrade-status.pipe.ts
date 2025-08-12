import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
    name: 'upgradeStatus',
    standalone: true
})
export class UpgradeStatusPipe implements PipeTransform {

  constructor(private translate:TranslateService){}

  transform(value: number): any {
    switch (value) {
      case 0:
        return this.translate.instant('common.pendingApproval');
      case 1:
        return this.translate.instant('common.pendingFinalApproval');
      case 2:
        return this.translate.instant('common.approved');
    }
  }

}
