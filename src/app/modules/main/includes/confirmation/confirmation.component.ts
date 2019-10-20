import { Component, Inject } from '@angular/core';
import { MDC_DIALOG_DATA } from '@angular-mdc/web';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent {

  constructor(@Inject(MDC_DIALOG_DATA) public data: any) { }
}
