import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-membership-status-badge',
    templateUrl: './membership-status-badge.component.html',
    styleUrls: ['./membership-status-badge.component.scss'],
    imports: [NgClass]
})
export class MembershipStatusBadgeComponent {
@Input() status:number;
@Input() statusName:string;
}
