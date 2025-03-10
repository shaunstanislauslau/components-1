/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ENTER} from '@angular/cdk/keycodes';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ErrorStateMatcher, MatCommonModule} from '@angular/material/core';
import {MatChip, MatChipAvatar, MatChipCssInternalOnly, MatChipTrailingIcon} from './chip';
import {MatChipRow} from './chip-row';
import {MatChipOption} from './chip-option';
import {MAT_CHIPS_DEFAULT_OPTIONS, MatChipsDefaultOptions} from './chip-default-options';
import {MatChipInput} from './chip-input';
import {MatChipSet} from './chip-set';
import {MatChipGrid} from './chip-grid';
import {MatChipListbox} from './chip-listbox';

@NgModule({
  imports: [MatCommonModule, CommonModule],
  exports: [
    MatChip,
    MatChipAvatar,
    MatChipCssInternalOnly,
    MatChipGrid,
    MatChipInput,
    MatChipListbox,
    MatChipOption,
    MatChipRow,
    MatChipSet,
    MatChipTrailingIcon,
    MatCommonModule
  ],
  declarations: [
    MatChip,
    MatChipAvatar,
    MatChipCssInternalOnly,
    MatChipGrid,
    MatChipInput,
    MatChipListbox,
    MatChipOption,
    MatChipRow,
    MatChipSet,
    MatChipTrailingIcon
  ],
  providers: [
    ErrorStateMatcher,
    {
      provide: MAT_CHIPS_DEFAULT_OPTIONS,
      useValue: {
        separatorKeyCodes: [ENTER]
      } as MatChipsDefaultOptions
    }
  ]
})
export class MatChipsModule {
}
