import { Component, ElementRef, input, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import SignaturePad from 'signature_pad';

@Component({
  selector: 'app-digital-signature',
  imports: [MatButtonModule, MatIcon],
  templateUrl: './digital-signature.component.html'
})
export class DigitalSignatureComponent {
  @ViewChild("canvas", { static: true }) canvas: ElementRef;
  sig: SignaturePad;
  width = input<number>(800);
  height = input<number>(150);

  ngOnInit() {
    this.sig = new SignaturePad(this.canvas.nativeElement,{
      dotSize: 2
    });
  }

  getDrawing() {
    console.log(this.sig.toDataURL());
  }

  clear() {
    this.sig.clear();
  }
}
