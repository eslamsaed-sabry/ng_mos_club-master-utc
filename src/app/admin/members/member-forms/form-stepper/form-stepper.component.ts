import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MemberFormTypes } from 'src/app/models/enums';

@Component({
    selector: 'app-form-stepper',
    imports: [CommonModule, TranslateModule, MatIcon],
    templateUrl: './form-stepper.component.html'
})
export class FormStepperComponent {
  private translate = inject(TranslateService);
  activeStep = input<number>(0);
  isStepper = input<boolean>(true);
  types = MemberFormTypes;
  formType = input.required<MemberFormTypes>();
  steps = [
    { id: 0, label: this.translate.instant('members.addMember') },
    { id: 1, label: this.translate.instant('members.addMembership') },
  ]
}
