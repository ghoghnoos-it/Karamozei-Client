import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Account } from '../../services/account/account.service';
import { Loading } from '../../services/loading/loading.service';
import { Versions } from '../../services/versions/versions.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public version: String = '';
  public open: Boolean = false;
  public closeable: Boolean = false;
  public path: String = window.location.pathname;
  public name: String = 'ناشناس';
  public code: String = '0900000000';
  public installable: Boolean = false;
  public list: object[] = [
    {
      path: '/panel/dashboard',
      icon: 'dashboard',
      title: 'پیشخوان'
    },
    {
      path: '/panel/action',
      icon: 'event',
      title: 'فعالیت ها',
      permission: ['admin', 'user']
    },
    {
      path: '/panel/me',
      icon: 'account_box',
      title: 'پروفایل'
    },
    {
      path: '/panel/users',
      icon: 'group',
      title: 'کاربران',
      permission: ['admin']
    },
    {
      path: "/panel/help",
      icon: "help",
      title: "سوالات متداول"
    },
    {
      path: '/panel/bug',
      icon: 'bug_report',
      title: 'گزارش بروزرسانی'
    }
  ];

  private deferredPrompt = null;
  @Output() drawer: EventEmitter<any> = new EventEmitter();
  constructor(public account: Account, public loading: Loading, public versions: Versions, private router: Router) { }

  ngOnInit() {
    window.onresize = () => this.setOpen();
    this.setOpen();
    this.pwaEvent();
    
    setInterval(() => {
      if (this.account.info && this.account.info['info'] && this.account.info['info']['personal_code']) {
        this.code = this.account.info['info']['personal_code'];
      }
      if (this.account.info && this.account.info['name'] && this.account.info['name']['first'] && this.account.info['name']['last']) {
        this.name = this.account.info['name']['first'] + ' ' + this.account.info['name']['last'];
      }
    }, 100);
    this.router.events.subscribe(() => {
      this.path = window.location.pathname;
    })
  }
  toggleDrawer() {
    this.drawer.emit(this.open);
    this.open = !this.open;
  }
  setOpen() {
    if (window.innerWidth <= 600) {
      this.open = false;
      this.closeable = true;
    } else {
      this.open = true;
      this.closeable = false;
    }
    this.drawer.emit(!this.open);
  }
  goTo(path = '') {
    if (this.loading.show == true) {
      this.path = window.location.pathname;
    } else {
      this.router.navigate([path]);
      if (this.closeable == true) {
        this.drawer.emit(this.open);
        this.open = false;
      }
    }
  }
  pwaEvent() {
    window.addEventListener('beforeinstallprompt', async (e) => {
      try {
        await e.preventDefault();
        this.deferredPrompt = e;
        console.log('[Installer] : Before installing.');
        if (window.localStorage.getItem('installed') == null) {
          this.installable = true;
        }
      } catch (error) {
        console.warn('[Installer Error] : ' + error);
      }
    });
    window.addEventListener('appinstalled', (evt) => {
      this.installable = false;
      console.log('[Installer] : App installed.');
    });
  }

  install() {
    if (this.deferredPrompt == null) { return; } else {
      this.deferredPrompt.prompt();
      this.deferredPrompt.userChoice
        .then((choiceResult) => {
          this.deferredPrompt = null;
          if (choiceResult['outcome'] === 'accepted') {
            window.localStorage.setItem('installed', 'True');
            this.installable = false;
            return true;
          } else {
            this.installable = true;
            return false;
          }
        });
    }
  }
}
