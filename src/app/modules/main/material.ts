import { NgModule } from '@angular/core';

import {
  MdcCardModule,
  MdcDialogModule,
  MdcTextFieldModule,
  MdcFormFieldModule,
  MdcButtonModule,
  MdcSelectModule,
  MdcListModule,
  MdcFabModule,
  MdcRadioModule,
  MdcTabBarModule,
  MdcIconModule,
  MdcSnackbarModule,
  MDCDataTableModule,
  MdcIconButtonModule,
  MdcCheckboxModule,
  MdcElevationModule,
} from '@angular-mdc/web';

const array = [
  MdcCardModule,
  MdcDialogModule,
  MdcTextFieldModule,
  MdcFormFieldModule,
  MdcButtonModule,
  MdcSelectModule,
  MdcListModule,
  MdcFabModule,
  MdcRadioModule,
  MdcTabBarModule,
  MdcIconModule,
  MdcSnackbarModule,
  MDCDataTableModule,
  MdcIconButtonModule,
  MdcCheckboxModule,
  MdcElevationModule,
];

@NgModule({
  imports: array,
  exports: array
})
export class MaterialModule { }
