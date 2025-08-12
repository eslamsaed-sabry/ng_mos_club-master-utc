import { Component, Input } from '@angular/core';

@Component({
    selector: 'ico-whatsapp',
    templateUrl: './ico-whatsapp.component.html',
    standalone: true
})
export class IcoWhatsappComponent {
  @Input() width: string = '30px';
  @Input() height: string = '30px';
}
