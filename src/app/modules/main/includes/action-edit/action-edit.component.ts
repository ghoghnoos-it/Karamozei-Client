import { Component, Inject, OnInit } from '@angular/core';
import { MDC_DIALOG_DATA, MdcDialogRef, MdcSnackbar } from '@angular-mdc/web';
import { Http } from '../../../../services/http/http.service';
import { Loading } from '../../../../services/loading/loading.service';

@Component({
  selector: 'app-action-edit',
  templateUrl: './action-edit.component.html',
  styleUrls: ['./action-edit.component.css']
})
export class ActionEditComponent implements OnInit {

  public action: Object = {};
  constructor(private dialogRef: MdcDialogRef<ActionEditComponent>, @Inject(MDC_DIALOG_DATA) public data: any, private http: Http, public loading: Loading, private snackbar: MdcSnackbar) { }

  ngOnInit() {
    if (this.data['action'] && this.data['action']['id']) {
      this.action = this.data['action'];
    }
    setTimeout(() => {
      this.action['time']['max'] = this.getMax();
    }, 500);
  }
  submit() {
    let data = this.action;
    data['time']['max'] = this.getMax();
    let id = data['id'];
    this.http.request('main', '/action/admin', 'PUT', {
      details: data['details'],
      time: data['time'],
      score: data['score'],
      verified: data['verified']
    }, true, { id })
      .then((res: any) => {
        this.snackbar.open(res['message']['fa'], '', {
          direction: 'rtl'
        });
        if (res['status'] == true) {
          this.close();
        }
      });
  }

  close() {
    this.dialogRef.close();
  }

  getMax() {
    /**
     * 14:38      22 + 21 = 43M
     * 22:21      22 - 14 =  8H - 1 = 7H
     * _____
     * 
     */
    let minute = (60 - parseInt(this.action['time']['start']['minute'])) + parseInt(this.action['time']['end']['minute']);
    let hour = (parseInt(this.action['time']['end']['hour']) - parseInt(this.action['time']['start']['hour'])) - 1;
    if (minute >= 60) {
      hour += ~~(minute / 60);
      minute = (minute % 60);
    }
    if (hour < 0) {
      hour = 0;
    }
    return {
      hour, minute
    }
  }

  setTime(to = '', data = { hour: "", minute: "" }) {
    this.action['time'][to]['hour'] = data['hour'];
    this.action['time'][to]['minute'] = data['minute'];
    this.action['time']['max'] = this.getMax();
  }

  setVerified(result) {
    this.action['verified'] = result.checked;
  }
}
