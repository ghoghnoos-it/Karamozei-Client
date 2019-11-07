import { Component, Inject, OnInit } from '@angular/core';
import { MDC_DIALOG_DATA, MdcDialogRef, MdcSnackbar } from '@angular-mdc/web';
import { Http } from '../../../../services/http/http.service';
import { Loading } from '../../../../services/loading/loading.service';

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
  public time = {
    start: "00:00",
    end: "00:00"
  }
  public date = {
    year: null,
    month: null,
    day: null
  }
  public title: string = "";
  public disable: boolean = true;
  constructor(private dialogRef: MdcDialogRef<ActionFormComponent>, @Inject(MDC_DIALOG_DATA) public data: any, private http: Http, public loading: Loading, private snackbar: MdcSnackbar) { }
  ngOnInit() {
    if(this.data['title']){
      this.title = this.data['title'];      
    }
    if(this.data['date']){
      let date = this.data['date'];
      this.date['year'] = date['year'];
      this.date['month'] = date['month'];
      this.date['day'] = date['day'];
    }
    if (this.data['action'] && this.data['action']['id']) {
      this.action = this.data['action'];
      if (this.action['time']['start']) {
        this.setDefaultTime('start', this.action['time']['start']);
      }
      if (this.action['time']['end']) {
        this.setDefaultTime('end', this.action['time']['end']);
      }
      setTimeout(() => {
        this.action['time']['max'] = this.getMax();
        console.clear();
      }, 500);
    } else {
      this.data = {
        details: "",
        time: {
          start: {
            hour: "0",
            minute: "0"
          },
          end: {
            hour: "0",
            minute: "0"
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
      }
    }
  }
  submit() {
    this.action['time']['max'] = this.getMax();    
    this.action['date'] = {};
    this.action['date']['year'] = this.date['year'].toString();
    this.action['date']['month'] = this.date['month'].toString();
    this.action['date']['day'] = this.date['day'].toString();
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
    if (minute < 0) {
      minute = 0;
    }


    if ((isNaN(hour) != true && isNaN(minute) != true)) {
      if (hour >= 0 && minute >= 0) {
        if(hour == 0 && minute == 0) {
          this.disable = true;
        } else if (hour != 0 || minute != 0) {
          this.disable = false;
        } else {
          this.disable = true;
        }
      } else {
        this.disable = true;
      }
    } else {
      this.disable = true;
    }
    return {
      hour, minute
    }
  }

  setDefaultTime(to = '', entry = { hour: "00", minute: "00" }) {
    let time = "";
    if (entry['hour']) {
      if (entry['hour'].length == 1) entry['hour'] = "0" + entry['hour'];
      time = entry['hour'];
    } else {
      time = "00";
    }
    time += ":";
    if (entry['minute']) {
      if (entry['minute'].length == 1) entry['minute'] = "0" + entry['minute'];
      time += entry['minute'];
    } else {
      time += "00";
    }
    this.time[to] = time;

  }

  setTime(data = "", to = '') {
    let time = data.split(":");
    this.action['time'][to] = { "hour": parseInt(time[0]), "minute": parseInt(time[1]) };
    this.action['time']['max'] = this.getMax();
  }
}
