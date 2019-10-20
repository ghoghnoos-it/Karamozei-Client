import { Component, Inject, OnInit } from '@angular/core';
import { MDC_DIALOG_DATA, MdcDialogRef, MdcSnackbar } from '@angular-mdc/web';
import { Http } from '../../../../services/http/http.service';
import { Loading } from '../../../../services/loading/loading.service';
import * as moment from 'jalali-moment';

@Component({
  selector: 'app-action-form',
  templateUrl: './action-form.component.html',
  styleUrls: ['./action-form.component.css']
})
export class ActionFormComponent implements OnInit {

  public action: Object = {
    details: "",
    time: {
      start: {
        hour: null,
        minute: null
      },
      end: {
        hour: null,
        minute: null
      },
      max: {
        hour: "0",
        minute: "0"
      }
    },
    date: {
      year: "1300",
      month: "1",
      day: "1"
    }
  };
  constructor(private dialogRef: MdcDialogRef<ActionFormComponent>, @Inject(MDC_DIALOG_DATA) public data: any, private http: Http, public loading: Loading, private snackbar: MdcSnackbar) { }
  ngOnInit() {
    if (this.data['action'] && this.data['action']['id']) {
      this.action = this.data['action'];
    }
    setTimeout(() => {
      this.action['time']['max'] = this.getMax();
    }, 500);
  }
  submit() {
    this.action['time']['max'] = this.getMax();
    let today = moment().locale("fa").format("YYYY/M/D").split('/');
    this.action['date'] = {};
    this.action['date']['year'] = this.data['date']['year'].toString() || today[0];
    this.action['date']['month'] = this.data['date']['month'].toString() || today[1];
    this.action['date']['day'] = this.data['date']['day'].toString() || today[2];
    let method = (this.action['id']) ? 'PUT' : 'POST';
    let header = {};
    if (method == "PUT") {
      header['id'] = this.action['id'];
    }
    this.http.request('main', '/action', method, this.action, true, header)
      .then((res: any) => {
        this.snackbar.open(res['message']['fa'], '', {
          direction: 'rtl'
        });
        if (res['status'] == true) {
          this.dialogRef.close(true);
        }
      });
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
}
