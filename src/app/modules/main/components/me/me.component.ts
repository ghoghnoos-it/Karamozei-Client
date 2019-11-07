import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MdcSnackbar } from '@angular-mdc/web';
import { Account } from '../../../../services/account/account.service';
import { Http } from '../../../../services/http/http.service';
import { Loading } from '../../../../services/loading/loading.service';
import { Toast } from '../../../../services/toast/toast.service';

@Component({
  selector: 'app-me',
  templateUrl: './me.component.html',
  styleUrls: ['./me.component.css']
})
export class MeComponent implements OnInit {

  public sessions: any[] = null;
  public password = {
    'new': '',
    'try-new': ''
  }
  constructor(public account: Account, private http: Http, public loading: Loading, private router: Router, private snackbar: MdcSnackbar, private toast: Toast) { }

  ngOnInit() {
    this.fetch();
  }

  submit() {
    let data = this.account.info;
    this.http.request('main', '/user/update', 'PUT', this.account.info, true)
      .then((res: any) => {
        this.snackbar.open(res['message']['fa'], '', {
          direction: 'rtl'
        });
        if (res['status'] == true) {
          this.account.set(this.account.auth, data);
        }
      })
  }

  fetch() {
    if (this.account.login == true) {
      this.http.grapql('main', `{ me { name { first last } phone { number } info { personal_code birth { year } gender married } parrent { name relationship phone } permission field } session { os browser isMobile isDesktop current } }`)
        .then((res: any) => {
          if (res['errors'] == null) {
            this.sessions = res['data']['session'];
            if (res['data']['me'] == null) {
              this.logout();
            } else {
              this.account.set(this.account.auth, res['data']['me']);
            }
          }
        });
    }
  }

  changePassword() {
    let n = this.password['new'],
      tn = this.password["try-new"];

    if (!n || n.length == 0) this.toast.make('رمز عبور جدید را وارد کنید.', this.snackbar, 4000);
    else if (!tn || tn.length == 0) this.toast.make('تکرار رمز عبور جدید را وارد کنید.', this.snackbar, 4000);
    else if (tn != n) this.toast.make('رمزعبور با تکرار آن همخوانی ندارند.', this.snackbar, 4000);
    else {
      this.http.request('main', '/user/update', 'PUT', { password: n }, true)
        .then((res: any) => {
          this.snackbar.open(res['message']['fa'], '', {
            direction: 'rtl'
          });
        })
    }
  }

  logout() {
    let timeout = setTimeout(() => {
      this.account.logout();
      this.router.navigate(['/']);
      this.loading.show = false;
      clearTimeout(timeout);
    }, 5000)
    this.http.request('main', '/auth/logout', 'POST', {}, true)
      .then((res: any) => {
        this.snackbar.open(res['message']['fa'], '', {
          direction: 'rtl'
        });
        if (res['status'] == true || res['message']['fa'] == 'حساب کاربری یافت نشد.') {
          this.account.logout();
        }
        clearTimeout(timeout);
      })
  }
  kick(index) {
    this.http.request('main', '/auth/kick', 'POST', { id: index.toString() }, true)
      .then((res: any) => {
        this.snackbar.open(res['message']['fa'], '', {
          direction: 'rtl'
        });
        if (res['status'] == true) {
          this.sessions.splice(index, 1);
        }
      })
  }
}
