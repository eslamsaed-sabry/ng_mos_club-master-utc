import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { UserPermissionsService } from '../services/user-permissions.service';

@Directive({
  selector: '[appRole]',
  standalone: true
})
export class RoleDirective {

  constructor(private templateRef: TemplateRef<any>, private viewContainer: ViewContainerRef, private permissions: UserPermissionsService) {
  }

  // Structural way
  @Input() set appRole(condition: string[] | undefined) {
    if (condition) {
      let permissionArray = condition[0];
      let accessKeys = condition.filter((el, i) => i > 0);
      if (this.permissions.entitiesList[permissionArray].some((r: string) => accessKeys.includes(r))) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
    } else {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
