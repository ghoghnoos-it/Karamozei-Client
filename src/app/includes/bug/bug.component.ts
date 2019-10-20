import { Component, Inject } from '@angular/core';
import { MDC_DIALOG_DATA, MdcDialogRef, MdcSnackbar } from '@angular-mdc/web';

@Component({
  selector: 'app-bug',
  templateUrl: './bug.component.html',
  styleUrls: ['./bug.component.css']
})
export class BugComponent {

  constructor(private dialogRef: MdcDialogRef<BugComponent>, @Inject(MDC_DIALOG_DATA) public item: any) { }
  close() {
    this.dialogRef.close();
  }
}
