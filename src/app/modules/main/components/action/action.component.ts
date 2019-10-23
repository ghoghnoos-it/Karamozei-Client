import { Component, OnInit } from '@angular/core';
import { MdcDialog, MdcSnackbar } from '@angular-mdc/web';
import * as moment from 'jalali-moment';
import { ActionFormComponent } from '../../includes/action-form/action-form.component';
import { ActionEditComponent } from '../../includes/action-edit/action-edit.component';
import { ConfirmationComponent } from '../../includes/confirmation/confirmation.component';
import { Http } from '../../../../services/http/http.service';
import { Account } from '../../../../services/account/account.service';
import { Loading } from '../../../../services/loading/loading.service';
import { Toast } from '../../../../services/toast/toast.service';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.css']
})
export class ActionComponent implements OnInit {

  public days_name: String[] = ["شنبه", "یکشنبه", "دوشنبه", "سه شنبه", "چهارشنبه", "پنج شنبه", "جمعه"];
  public months_name: String[] = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
  public today: any[] = [];
  public days: any[] = [];
  public data: Object[] = null;
  public day: string;
  public month: number;
  public todayMonth: number = 0;
  public view: string = 'calender';
  constructor(private dialog: MdcDialog, private snackbar: MdcSnackbar, private http: Http, public account: Account, public loading: Loading, private toast: Toast) { }

  ngOnInit() {
    this.setDays();
  }

  setMonth(event) {
    this.setDays(event.index + 1);
  }
  setDays(MONTH = 0) {
    this.today = [];
    this.days = [];
    this.day = null;
    /**
     * مهر ۱۳۹۸
     * [
     *    [null, null, 1, 2, 3, 4, 5],
     *    [06, 07, 08, 09, 10, 11, 12],
     *    [13, 14, 15, 16, 17, 18, 19],
     *    [20, 21, 22, 23, 24, 25, 26],
     *    [27, 28, 29, 30, null, null, null]
     * ]
     */
    let today = moment().locale('fa').format("YYYY/M/D").split('/'),
      year = parseInt(today[0]),
      month = (MONTH == 0) ? parseInt(today[1]) : MONTH,
      day = parseInt(today[2]),
      todayEn = moment.from(`${year}/${month}/1`, 'fa', 'YYYY/MM/DD').format('YYYY/MM/DD').split('/'),
      monthName = moment(`${todayEn[0]}/${todayEn[1]}/${todayEn[2]}`).locale('fa').format('jMMMM'),
      start_index = moment(`${todayEn[0]}/${todayEn[1]}/${todayEn[2]}`).locale('fa').weekday(),
      last_day = moment(`${todayEn[0]}/${todayEn[1]}/${todayEn[2]}`).locale('fa').endOf('month').format('DD'),
      last_day_en = moment.from(`${year}/${month}/${last_day}`, 'fa', 'YYYY/MM/DD').format('YYYY/MM/DD').split('/'),
      end_index = moment(`${last_day_en[0]}/${last_day_en[1]}/${last_day_en[2]}`).locale('fa').weekday() + 1,
      day_index = 1;

    this.today = [year, month, day, monthName];
    this.day = day.toString();
    this.month = (month - 1);
    if (MONTH == 0) this.todayMonth = month;
    function setWeek(index = 0) {
      let array = Array(7);
      if (index == 0) {
        for (let i = 0; i < start_index; i++) {
          array[i] = '';
        }
      } else if (index == 4) {
        for (let i = end_index; i < 7; i++) {
          array[i] = '';
        }
      }
      for (let i = 0; i < 7; i++) {
        if (array[i] != '') {
          array[i] = day_index;
          day_index++;
        }
      }
      return array;
    }

    let array2D = Array(5).fill([]);
    for (let i = 0; i < array2D.length; i++) {
      array2D[i] = setWeek(i);
    }
    this.days = array2D;
  }

  getDay(day = moment().locale('fa').format("D")) {
    return new Promise((resolve, reject) => {
      let date = moment().locale("fa").format("YYYY");
      date = date + "/" + this.today[1];
      date = date + "/" + day;
      let query = ``;
      if (this.account.info['permission'] == 'user') {
        query = `{ actions(date: "${date}") { id details time { start { hour minute } end { hour minute } } } }`;
      } else if (this.account.info['permission'] == 'admin') {
        query = `{ actions(date: "${date}") { id user { name { first last } info { gender } }  details time { start { hour minute } end { hour minute } max { hour minute } } date { year month day } score verified } }`;
      }

      this.http.grapql('main', query)
        .then((res: any) => {
          if (res['data'] && res['data']['actions']) {
            if (this.account['info']['permission'] == 'user') {
              this.data = res['data']['actions'][0] || {};
            } else {
              this.data = res['data']['actions'] || [];
            }
            resolve();
          } else {
            reject();
          }
        });
    });
  }

  openForm(day = 0) {
    if (this.loading.show == true) return;
    if (this.account['info']['permission'] == 'user') {
      this.getDay(day.toString()).then(() => {
        this.dialog.open(ActionFormComponent, {
          data: {
            title: `${day}ام ${this.today[3]}`,
            date: {
              year: this.today[0],
              month: this.today[1],
              day
            },
            action: this.data
          },
          clickOutsideToClose: false,
          autoFocus: false
        })

      })
    } else {
      this.getDay(day.toString()).then(() => {
        this.day = day.toString();
        this.view = 'records';
      })
    }
  }

  editAction(data, index = 0) {
    this.dialog.open(ActionEditComponent, {
      data: {
        action: data
      }
    });
  }

  setGender(gender = '') {
    switch (gender) {
      case "woman":
        return "خانمِ"
        break;
      case "man":
        return "آقای"
        break;
      case "other":
        return ""
        break;
      default:
        return "";
        break;
    }
  }

  setVerified(id = "", index = 0) {
    this.confirm("آیا مطمئن به تایید این فعالیت هستید ؟", () => {
      this.http.request('main', '/action/admin', 'PUT', { verified: true }, true, { id })
        .then((res: any) => {
          this.toast.make(res['message']['fa'], this.snackbar);
          if (res['status'] == true) {
            this.data[index]['verified'] = true;
          }
        });
    })
  }

  removeAction(id = "", index = 0) {
    this.confirm('آیا مطمئن به حذف این فعالیت هستید ؟', () => {
      this.http.request('main', '/action/admin', 'DELETE', {}, true, { id })
        .then((res: any) => {
          this.toast.make(res['message']['fa'], this.snackbar);
          if (res['status'] == true) {
            this.data.splice(index, 1);
          }
        })
    })
  }
  confirm(text = '', callback) {
    this.dialog.open(ConfirmationComponent, {
      data: { text }
    }).afterClosed().subscribe(result => {
      if (result == 'accept') callback();
    })
  }
}
