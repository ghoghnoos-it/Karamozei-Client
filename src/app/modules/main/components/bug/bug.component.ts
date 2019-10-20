import { Component, OnInit } from '@angular/core';
import bug from '../../../../../database/bug';

@Component({
  selector: 'app-bug',
  templateUrl: './bug.component.html',
  styleUrls: ['./bug.component.css']
})
export class BugComponent implements OnInit {
  public items = [];
  constructor() { }

  ngOnInit() {
    this.items = bug;
  }

}
