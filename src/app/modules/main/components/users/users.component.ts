import { Component, OnInit } from '@angular/core';
import { MdcDialog, MdcSnackbar } from '@angular-mdc/web';
import { ConfirmationComponent } from '../../includes/confirmation/confirmation.component';
import { Http } from '../../../../services/http/http.service';
import { Toast } from '../../../../services/toast/toast.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  public items: any[] = [];
  public data: Object = null;
  public mode: string = 'table';
  public permission: string = 'user';
  public index: number = 0;
  public teachers: any[] = [];
  constructor(private http: Http, private toast: Toast, private dialog: MdcDialog, private snackbar: MdcSnackbar) { }

  async ngOnInit() {
    await this.setData({ index: this.index });
    if (this.index != 2) await this.setData({ index: 1 }, data => this.teachers = data);
  }

  setTab(event) {
    this.index = event.index;
  }

  setData(event = { index: 0 }, callback = (data: object[]) => { this.items = data }) {
    let by = '';
    if (event.index == 0) by = 'user';
    else if (event.index == 1) by = 'teacher';
    else if (event.index == 2) by = 'admin';
    else { return; }
    this.data = null;
    this.mode = 'table';
    this.index = 0;
    this.fetch(`{ users(by:"${by}") { id name { first last } phone { number } info { personal_code birth { year } gender married } parrent { name relationship phone } field time teacher entry { year season }  } }`)
      .then(callback)
  }

  fetch(query = '') {
    return new Promise((resolve, reject) => {
      this.http.grapql('main', query)
        .then((res: any) => {
          if (res['data']) {
            resolve(res['data']['users']);
          }
        })
    })
  }

  makeCall(phone = '') {
    window.open(`tel:${phone}`)
  }

  delete(id = '', index = 0) {
    this.confirm("آیا واقعا می خواهید این کاربر را حذف کنید ؟", () => {
      this.http.request('main', '/user/delete', 'DELETE', { id }, true)
        .then((res: any) => {
          this.toast.make(res['message']['fa'], this.snackbar);
          if (res['status'] == true) {
            this.items.splice(index);
          }
        })
    });
  }

  update() {
    if (this.permission != 'user' && this.data['id'] == null) {
      this.data['permission'] = this.permission;
      this.http.request('main', '/user/new', 'POST', this.data, true)
        .then((res: any) => {
          this.toast.make(res['message']['fa'], this.snackbar);
          if (res['status'] == true) {
            this.data = null;
            this.mode = 'table';
            this.ngOnInit();
          }
        })
    } else {
      this.http.request('main', '/user/update', 'PUT', this.data, true, { id: this.data['id'] })
        .then((res: any) => {
          this.toast.make(res['message']['fa'], this.snackbar);
          if (res['status'] == true) {
            this.data = null;
            this.mode = 'table';
          }
        })
    }
  }

  setEditable(data) {
    this.data = data;
    this.mode = 'edit';
  }

  confirm(text = '', callback) {
    this.dialog.open(ConfirmationComponent, {
      data: { text }
    }).afterClosed().subscribe(result => {
      if (result == 'accept') callback();
    })
  }
}
