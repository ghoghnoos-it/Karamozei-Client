import { NgModule } from '@angular/core';

import {
  MdcTopAppBarModule,
  MdcIconModule,
  MdcDrawerModule,
  MdcListModule,
  MdcButtonModule,
  MdcLinearProgressModule,
  MdcDialogModule,
  MdcCardModule,
  MdcSnackbarModule
} from '@angular-mdc/web';

const array = [
  MdcTopAppBarModule,
  MdcIconModule,
  MdcDrawerModule,
  MdcListModule,
  MdcButtonModule,
  MdcLinearProgressModule,
  MdcDialogModule,
  MdcCardModule,
  MdcSnackbarModule
];

@NgModule({
  imports: array,
  exports: array
})
export class MaterialModule { }
