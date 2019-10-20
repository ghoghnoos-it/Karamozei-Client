import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Account } from '../account/account.service';
import { Loading } from '../loading/loading.service';

const micro = {
  "main": `https://api.karamozi.ghoghnoosit.ir`,
  "stream": `https://stream.ghoghnoosit.ir`
};

const methods = ['GET', 'POST', 'PUT', 'DELETE'];
@Injectable({
  providedIn: 'root'
})
export class Http {

  constructor(private account: Account, private loading: Loading, private router: Router) { }
  request(server = '', path = '', method = 'GET', data = {}, auth = false, header = {}) {
    this.loading.show = true;
    return new Promise(async (resolve, reject) => {
      let url = null;
      if (server in micro) {
        url = micro[server] + path;
      } else {
        this.loading.show = false;
        reject('Server not found.');
      }

      method = method.toUpperCase();
      if (methods.includes(method)) {
        method = method.toUpperCase();
      } else {
        this.loading.show = false;
        reject("Method is not correct.")
      }

      let options = {};
      if (typeof data === 'object' && Object.keys(data).length !== 0) {
        header['Accept'] = header['Content-Type'] = 'application/json';
        options['body'] = JSON.stringify(data);
      }

      if (typeof auth == 'boolean') {
        if (auth === true) {
          await this.account.load();
          if (this.account.login == true && this.account.auth['access_token']) {
            header['authorization'] = `Bearer ${this.account.auth['access_token']}`;
          } else {
            this.loading.show = false;
            reject("User has not logged in.")
          }
        }
      } else {
        this.loading.show = false;
        reject("Auth must be boolean.")
      }

      options['headers'] = header;
      options['method'] = method;

      try {
        let res = await window.fetch(url, options);
        res = await res.json();
        if (res['forget'] && res['forget'] == true) {
          window.localStorage.removeItem("account");
          this.router.navigate(['/']);
        }
        else if (res['expired'] && res['expired'] == true) {
          this.reAuth()
            .then(() => {
              let res = this.request(server, path, method, data, auth);
              this.loading.show = false;
              return res;
            }).then(resolve).catch(reject);
        } else {
          this.loading.show = false;
          resolve(res);
        }
      } catch (error) {
        this.loading.show = false;
        reject(error);
      }
    });
  }

  reAuth() {
    return new Promise(async (resolve, reject) => {
      try {
        let url = micro['main'] + '/auth/re';
        let res: any = await window.fetch(url, {
          method: 'POST',
          body: JSON.stringify({ refresh_token: this.account.auth['refresh_token'] }),
          headers: {
            'Content-Type': 'application/json',
            "Accept": 'application/json'
          }
        });
        res = await res.json();
        if (res['status'] == false) reject(res['message']);
        else {
          await this.account.set(res['auth'], res['info'])
          resolve();
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  grapql(server = '', query = '') {
    return this.request(server, `/graph/ql?query=${query}`, 'GET', {}, true);
  }

  stream(file = '') {
    if (file == null) return;
    let url = micro['stream'];
    if (file.slice(0, 1) == '/') url += file;
    else url += '/' + file;
    return url;
  }
}

