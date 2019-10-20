import { Component, OnInit } from '@angular/core';
import { Versions } from '../../../../services/versions/versions.service';

@Component({
  selector: 'app-bug',
  templateUrl: './bug.component.html',
  styleUrls: ['./bug.component.css']
})
export class BugComponent implements OnInit {
  public items = [];
  constructor(private versions: Versions) { }

  ngOnInit() {
    this.items = this.versions['bugs'];
    console.log(this.versions);
    
  }

}
