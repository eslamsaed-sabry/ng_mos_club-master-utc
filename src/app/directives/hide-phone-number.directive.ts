import { Directive, ElementRef, Renderer2, OnInit, inject } from '@angular/core';

@Directive({
    selector: '[appHidePhoneNumber]',
    standalone: true,
})
export class HidePhoneNumberDirective implements OnInit {
    private originalPhone: string = '';
    private isVisible: boolean = false;
    private el = inject(ElementRef);
    private renderer = inject(Renderer2);

    ngOnInit() {
        setTimeout(() => {
            this.originalPhone = this.el.nativeElement.innerText.trim();
            if (!this.originalPhone) return;

            // Clear the original content
            this.renderer.setProperty(this.el.nativeElement, 'innerText', '');

            // Create wrapper span with display: flex
            const wrapper = this.renderer.createElement('span');
            this.renderer.setStyle(wrapper, 'display', 'inline-flex');
            this.renderer.setStyle(wrapper, 'align-items', 'center');
            this.renderer.setStyle(wrapper, 'gap', '6px');

            // Create the masked/unmasked text span
            const textSpan = this.renderer.createElement('span');
            this.renderer.setStyle(textSpan, 'color', '#858585');
            this.renderer.setProperty(textSpan, 'innerText', '*'.repeat(this.originalPhone.length));

            // Create the visibility icon
            const iconElement = this.renderer.createElement('span');
            this.renderer.addClass(iconElement, 'material-icons');
            this.renderer.setStyle(iconElement, 'cursor', 'pointer');
            this.renderer.setStyle(iconElement, 'font-size', '18px');
            this.renderer.setStyle(iconElement, 'color', '#2196f3');
            this.renderer.setProperty(iconElement, 'innerText', 'visibility');

            // Toggle visibility
            this.renderer.listen(iconElement, 'click', (event: MouseEvent) => {
                event.stopPropagation();
                const isVisible = textSpan.innerText === this.originalPhone;
                this.renderer.setProperty(
                    textSpan,
                    'innerText',
                    isVisible ? '*'.repeat(this.originalPhone.length) : this.originalPhone
                );
                this.renderer.setProperty(
                    iconElement,
                    'innerText',
                    isVisible ? 'visibility' : 'visibility_off'
                );
            });

            // Append text and icon to wrapper
            this.renderer.appendChild(wrapper, textSpan);
            this.renderer.appendChild(wrapper, iconElement);

            // Append wrapper to host element
            this.renderer.appendChild(this.el.nativeElement, wrapper);
        });
    }
}
