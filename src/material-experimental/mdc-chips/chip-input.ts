/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {Directive, ElementRef, EventEmitter, Inject, Input, OnChanges, Output} from '@angular/core';
import {hasModifierKey, TAB} from '@angular/cdk/keycodes';
import {MAT_CHIPS_DEFAULT_OPTIONS, MatChipsDefaultOptions} from './chip-default-options';
import {MatChipGrid} from './chip-grid';
import {MatChipTextControl} from './chip-text-control';

/** Represents an input event on a `matChipInput`. */
export interface MatChipInputEvent {
  /** The native `<input>` element that the event is being fired for. */
  input: HTMLInputElement;

  /** The value of the input. */
  value: string;
}

// Increasing integer for generating unique ids.
let nextUniqueId = 0;

/**
 * Directive that adds chip-specific behaviors to an input element inside `<mat-form-field>`.
 * May be placed inside or outside of a `<mat-chip-grid>`.
 */
@Directive({
  selector: 'input[matChipInputFor]',
  exportAs: 'matChipInput, matChipInputFor',
  host: {
    'class': 'mat-chip-input mat-input-element',
    '(keydown)': '_keydown($event)',
    '(blur)': '_blur()',
    '(focus)': '_focus()',
    '(input)': '_onInput()',
    '[id]': 'id',
    '[attr.disabled]': 'disabled || null',
    '[attr.placeholder]': 'placeholder || null',
    '[attr.aria-invalid]': '_chipGrid && _chipGrid.ngControl ? _chipGrid.ngControl.invalid : null',
  }
})
export class MatChipInput implements MatChipTextControl, OnChanges {
  /** Whether the control is focused. */
  focused: boolean = false;
  _chipGrid: MatChipGrid;

  /** Register input for chip list */
  @Input('matChipInputFor')
  set chipGrid(value: MatChipGrid) {
    if (value) {
      this._chipGrid = value;
      this._chipGrid.registerInput(this);
    }
  }

  /**
   * Whether or not the chipEnd event will be emitted when the input is blurred.
   */
  @Input('matChipInputAddOnBlur')
  get addOnBlur(): boolean { return this._addOnBlur; }
  set addOnBlur(value: boolean) { this._addOnBlur = coerceBooleanProperty(value); }
  _addOnBlur: boolean = false;

  /**
   * The list of key codes that will trigger a chipEnd event.
   *
   * Defaults to `[ENTER]`.
   */
  @Input('matChipInputSeparatorKeyCodes')
  separatorKeyCodes: number[] | Set<number> = this._defaultOptions.separatorKeyCodes;

  /** Emitted when a chip is to be added. */
  @Output('matChipInputTokenEnd')
  chipEnd: EventEmitter<MatChipInputEvent> = new EventEmitter<MatChipInputEvent>();

  /** The input's placeholder text. */
  @Input() placeholder: string = '';

  /** Unique id for the input. */
  @Input() id: string = `mat-chip-list-input-${nextUniqueId++}`;

  /** Whether the input is disabled. */
  @Input()
  get disabled(): boolean { return this._disabled || (this._chipGrid && this._chipGrid.disabled); }
  set disabled(value: boolean) { this._disabled = coerceBooleanProperty(value); }
  private _disabled: boolean = false;

  /** Whether the input is empty. */
  get empty(): boolean { return !this._inputElement.value; }

  /** The native input element to which this directive is attached. */
  protected _inputElement: HTMLInputElement;

  constructor(
    protected _elementRef: ElementRef<HTMLInputElement>,
    @Inject(MAT_CHIPS_DEFAULT_OPTIONS) private _defaultOptions: MatChipsDefaultOptions) {
    this._inputElement = this._elementRef.nativeElement as HTMLInputElement;
  }

  ngOnChanges() {
    this._chipGrid.stateChanges.next();
  }

  /** Utility method to make host definition/tests more clear. */
  _keydown(event?: KeyboardEvent) {
    // Allow the user's focus to escape when they're tabbing forward. Note that we don't
    // want to do this when going backwards, because focus should go back to the first chip.
    if (event && event.keyCode === TAB && !hasModifierKey(event, 'shiftKey')) {
      this._chipGrid._allowFocusEscape();
    }

    this._emitChipEnd(event);
  }

  /** Checks to see if the blur should emit the (chipEnd) event. */
  _blur() {
    if (this.addOnBlur) {
      this._emitChipEnd();
    }
    this.focused = false;
    // Blur the chip list if it is not focused
    if (!this._chipGrid.focused) {
      this._chipGrid._blur();
    }
    this._chipGrid.stateChanges.next();
  }

  _focus() {
    this.focused = true;
    this._chipGrid.stateChanges.next();
  }

  /** Checks to see if the (chipEnd) event needs to be emitted. */
  _emitChipEnd(event?: KeyboardEvent) {
    if (!this._inputElement.value && !!event) {
      this._chipGrid._keydown(event);
    }
    if (!event || this._isSeparatorKey(event)) {
      this.chipEnd.emit({ input: this._inputElement, value: this._inputElement.value });

      if (event) {
        event.preventDefault();
      }
    }
  }

  _onInput() {
    // Let chip list know whenever the value changes.
    this._chipGrid.stateChanges.next();
  }

  /** Focuses the input. */
  focus(): void {
    this._inputElement.focus();
  }

  /** Checks whether a keycode is one of the configured separators. */
  private _isSeparatorKey(event: KeyboardEvent) {
    if (hasModifierKey(event)) {
      return false;
    }

    const separators = this.separatorKeyCodes;
    const keyCode = event.keyCode;
    return Array.isArray(separators) ? separators.indexOf(keyCode) > -1 : separators.has(keyCode);
  }
}

