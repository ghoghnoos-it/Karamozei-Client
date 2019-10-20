import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MdcSnackbar } from '@angular-mdc/web';
import { Toast } from '../../../services/toast/toast.service';
import { Account } from '../../../services/account/account.service';
import { Http } from '../../../services/http/http.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  public loading: Boolean = false;
  public sent: Boolean = false;
  public phone: String = '';
  public token: String = '';
  public time: number = 0;
  public interval;
  constructor(private snackbar: MdcSnackbar, protected toast: Toast, private http: Http, private account: Account, private router: Router) { }

  ngOnInit() {
  }

  submit() {
    if (this.sent == false) {
      this.send();
    } else {
      this.check();
    }
  }

  send() {
    let phone = this.phone;
    if (phone.length == 0) this.toast.make('شماره موبایل را وارد کنید.', this.snackbar);
    else if (phone.length != 11) this.toast.make('شماره موبایل باید ۱۱ رقمی باشد.', this.snackbar);
    else {
      this.loading = true;
      this.http.request('main', '/auth/send', 'POST', { phone })
        .then((result: any) => {
          this.loading = false;
          if (result['status'] == true) {
            this.sent = true;
            this.startTimer();
          }
          this.toast.make(result['message']['fa'], this.snackbar);
        }).catch(() => {
          this.loading = false;
          this.toast.make(null, this.snackbar);
        });
    }
  }

  check() {
    let phone = this.phone,
      token = this.token;
    if (token.length == 0) this.toast.make('کد تایید را وارد کنید.', this.snackbar);
    else if (token.length != 5) this.toast.make('کد تایید باید ۵ رقمی باشد.', this.snackbar);
    else {
      this.loading = true;
      this.http.request('main', '/auth', 'POST', { phone, token })
        .then((result: any) => {
          this.loading = false;
          if (result['status'] == true) {
            this.account.set(result['auth'], result['data']).then(() => this.router.navigate(['/panel/dashboard']));
          }
          this.toast.make(result['message']['fa'], this.snackbar);
        }).catch(() => {
          this.loading = false;
          this.toast.make(null, this.snackbar);
        });
    }
  }

  startTimer() {
    this.time = 60;
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      if (this.time - 1 == 0) {
        clearInterval(this.interval);
      }
      this.time -= 1;
    }, 1000);
  }

  onKeyup(what = '', length = 0) {
    if (this[what].length == length) this.submit();
  }
}
