import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MdcDialog, MdcSnackbar } from '@angular-mdc/web';
import { BugComponent } from './includes/bug/bug.component';
import { Account } from './services/account/account.service';
import { Http } from './services/http/http.service';
import { Loading } from './services/loading/loading.service';
import { Versions } from './services/versions/versions.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public panel: Boolean = false;
  public drawer: Boolean = true;
  public splash: Boolean = true;
  private bug: Boolean = false;
  constructor(private account: Account, private http: Http, public loading: Loading, private versions: Versions, private router: Router, private dialog: MdcDialog, private snackbar: MdcSnackbar) { }
  ngOnInit() {
    this.account.load().then(() => {
      if (this.account.login == true) {
        this.getMe();
      }
    })
    this.panel = window.location.pathname != '/';
    this.changeThemeColor();
    this.router.events.subscribe(() => {
      this.panel = window.location.pathname != '/';
      this.changeThemeColor();
      if (this.panel == true && this.bug == false) {
        this.bug = true;
        this.showBug();
      }
    });
  }
  setDrawer(event = true) {
    this.drawer = event;
  }
  changeThemeColor() {
    if (this.panel == true) {
      document.querySelector('meta[name="theme-color"]').setAttribute('content', '#363640')
    } else {
      document.querySelector('meta[name="theme-color"]').setAttribute('content', '#fff')
    }
  }
  getMe() {
    this.http.request('main', '/user/me', 'GET', {}, true)
      .then((res: any) => {
        if (res['status'] == true) {
          this.splash = false;
          this.account.set(this.account.auth, res['data']);
        } else {
          this.account.logout();
        }
      }).catch(() => {
        this.snackbar.open("خطایی رخ داده است.", "خروج از حساب")
        .afterDismiss().subscribe(()=>{
          this.account.logout();
        })
      })
  }
  showBug() {
    let database = window.localStorage.getItem('latest')
    this.http.versions().then((bug: object[]) => {
      this.versions.bugs = bug;
      this.versions.version = bug[0]['version'];

      if (database && parseInt(database) >= bug.length) return;
      this.dialog.open(BugComponent, { data: bug[0], escapeToClose: false, clickOutsideToClose: false }).afterClosed().subscribe(() => {
        window.localStorage.setItem('latest', (bug.length).toString());
        caches.keys().then(keys => {
          for (let i in keys) {
            caches.delete(keys[i]);
          }
          window.location.reload();
        });
      });
    })
  }
}
