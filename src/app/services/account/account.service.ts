import { Injectable } from '@angular/core';
import * as crypto from 'crypto-js';
import { Router } from '@angular/router';

let password = 'q*=SP8g%}R/$a3/(';

@Injectable({
  providedIn: 'root'
})
export class Account {

  public auth: Object = {
    'access_token': null,
    'refresh_token': null
  };
  public info = {};
  public login: Boolean = false;
  constructor(private router: Router) { }
  async set(auth = {}, info) {
    delete auth['type'];
    delete auth['expire_in'];

    this.auth = auth;
    this.info = info;
    this.login = true;

    const data = await crypto.AES.encrypt(JSON.stringify({ auth }), password);
    window.localStorage.setItem('account', data.toString());
    return Promise.resolve();
  }
  async load() {
    let data = await window.localStorage.getItem('account');
    if (data == null) {
      this.login = false;
    } else {
      try {
        let result = await crypto.AES.decrypt(data, password);
        result = await JSON.parse(result.toString(crypto.enc.Utf8));
        this.auth = result['auth'];
        this.login = true;
        return { auth: this.auth };
      } catch (error) {
        this.login = false;
      }
    }
  }
  logout() {
    this.auth = {
      access_token: null,
      refresh_token: null
    };
    this.info = null;
    this.login = false;
    window.localStorage.removeItem("account");
    this.router.navigate(['/']);
  }

}
