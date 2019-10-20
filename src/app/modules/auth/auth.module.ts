import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthComponent } from './auth/auth.component';

import {
  MdcCardModule,
  MdcTextFieldModule,
  MdcFormFieldModule,
  MdcButtonModule,
  MdcIconModule,
  MdcSnackbarModule,
  MdcFabModule,
} from '@angular-mdc/web';


@NgModule({
  declarations: [AuthComponent],
  imports: [
    CommonModule,
    FormsModule,
    MdcCardModule,
    MdcTextFieldModule,
    MdcFormFieldModule,
    MdcButtonModule,
    MdcIconModule,
    MdcSnackbarModule,
    MdcFabModule,
    RouterModule.forChild([
      { path: '', component: AuthComponent }
    ])
  ],
  exports: [RouterModule]
})
export class AuthModule { }
