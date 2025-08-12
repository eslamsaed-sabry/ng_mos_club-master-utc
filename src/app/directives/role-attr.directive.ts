import { Directive, Input, OnInit, ElementRef } from '@angular/core';
import { UserPermissionsService } from '../services/user-permissions.service';

@Directive({
    selector: '[appRoleAttr]',
    standalone: true
})
export class RoleAttrDirective implements OnInit {
    @Input('appRoleAttr') roles: string[];
    accessKeys: string[];

    constructor(private elmRef: ElementRef, private permissions: UserPermissionsService) {
    }

    ngOnInit() {
        this.check();
    }

    getPrivilege() {
        if (this.roles.length > 1) {
            let permissionArray = this.roles[0];
            this.accessKeys = this.roles.splice(1);
            if (this.permissions.entitiesList[permissionArray].some((r: string) => this.accessKeys.includes(r))) {
                return true
            }
            return false
        }
        return true
    }

    check() {
        if (!this.getPrivilege()) this.elmRef.nativeElement.style.display = 'none';
    }

}
