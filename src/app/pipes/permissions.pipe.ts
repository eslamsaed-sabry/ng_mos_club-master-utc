import { Pipe, PipeTransform } from '@angular/core';
import { UserPermissionsService } from '../services/user-permissions.service';

@Pipe({
    name: 'permission',
    standalone: true
})
export class PermissionsPipe implements PipeTransform {

  // has / hasNo
  constructor(private permissionService: UserPermissionsService) { }

  transform(value: any, key: string, permissionName: string): boolean {
    let permissionArray: string[] = this.permissionService.entitiesList[key];
    let isIncluded: boolean = permissionArray.includes(permissionName);

    switch (value) {
      case 'has':
        if (isIncluded)
          return true
        else
          return false;
        break;

      case 'hasNo':
      default:
        if (isIncluded)
          return false
        else
          return true;
        break;
    }

  }

}
