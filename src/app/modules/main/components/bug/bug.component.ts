import { Component, OnInit } from '@angular/core';
import { Versions } from '../../../../services/versions/versions.service';

@Component({
  selector: 'app-bug',
  templateUrl: './bug.component.html',
  styleUrls: ['./bug.component.css']
})
export class BugComponent implements OnInit {
  public items = [];
  public index: number = 0
  constructor(private versions: Versions) { }

  ngOnInit() {
    this.items = this.versions['bugs'];
    let version: any = window.localStorage.getItem('latest')
    if (!version) this.index = 0;
    else {
      try {
        version = parseInt(version);
        if (isNaN(version)) this.index = 0;
        else {
          let index = this.items.length - version;
          if (index >= 0) this.index = index;
          else this.index = 0;
        }
      } catch (error) {
        this.index = 0;
      }
    }
  }

  reset() {
    caches.keys().then(keys => {
      for (let i in keys) {
        caches.delete(keys[i]);
      }
      window.location.reload();
    });
  }
}
