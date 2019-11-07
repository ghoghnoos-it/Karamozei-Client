import { Component } from '@angular/core';
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
export class AuthComponent {

  public loading: Boolean = false;
  public username: string = '';
  public password: string = '';
  constructor(private snackbar: MdcSnackbar, protected toast: Toast, private http: Http, private account: Account, private router: Router) { }

  submit() {
    let username = this.username,
      password = this.password;

    if (!username || username.length == 0) return this.toast.make('نام کاربری را وارد کنید.', this.snackbar, 4000);
    else if (!password || password.length == 0) return this.toast.make('رمزعبور را وارد کنید.', this.snackbar, 4000);
    else {
      this.http.request('main', '/auth', 'POST', { username, password })
        .then((res: any) => {
          this.toast.make(res['message']['fa'], this.snackbar, 4000);
          if (res['status'] == true) {
            this.account.set(res['auth'], res['data']);
            this.router.navigate(['/panel/dashboard']);
          }
        });
    }
  }
}
