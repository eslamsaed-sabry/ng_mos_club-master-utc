import { Component, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { isNumber } from 'lodash-es';
import { combineLatest } from 'rxjs';
import { PermissionsPipe } from '../../pipes/permissions.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-counter-input',
    templateUrl: './counter-input.component.html',
    styleUrls: ['./counter-input.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: CounterInputComponent,
            multi: true,
        },
    ],
    imports: [MatButtonModule, MatIconModule, FormsModule, ReactiveFormsModule, PermissionsPipe]
})
export class CounterInputComponent implements OnInit, ControlValueAccessor {
  public readonly counterValue = new FormControl(0, [
    Validators.required,
    Validators.min(0)
  ]);

  constructor() { }

  public ngOnInit(): void {
    combineLatest([this.counterValue.valueChanges]).subscribe(() => {
      const value = this._getValue();
      this._onChange(value);
    });
  }

  /** Return a Date if the fields are ready or null otherwise */
  private _getValue(): number | null {
    try {
      if (this.counterValue.invalid)
        return null;

      const value: any = this.counterValue.value;
      return value;
    } catch {
      // Return null if something throws
      return null;
    }
  }

  private _onChange = (_value: number | null): void => undefined;
  public registerOnChange(fn: (value: number | null) => void): void {
    this._onChange = fn;
  }

  /** It's called in the component template when we have a "blur" or "input" event */
  public onTouched = (): void => undefined;
  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public writeValue(value: number | null): void {
    if (value && isNumber(+value)) {
      this.counterValue.setValue(+value);
    } else {
      this.counterValue.setValue(0);
    }
  }

  public setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.counterValue.disable();
    } else {
      this.counterValue.enable();
    }
  }

  onClick(type: string) {
    let value = Number(this.counterValue.value);
    if (type === 'plus') {
      let val = (isNumber(value)) ? value + 1 : 0
      this.counterValue.setValue(val);
    } else {
      let val = (isNumber(value)) ? value - 1 : 0
      this.counterValue.setValue(val);
    }
  }

  validate(event: KeyboardEvent) {
    const allowedCharacters = /[0-9]/; // Regular expression to allow only numeric characters

    // Check if the pressed key is allowed
    if (!allowedCharacters.test(event.key)) {
      event.preventDefault(); // Prevent the key press if it's not a numeric character
    }
  }

}
