import { Component, OnInit } from '@angular/core';
import { Http } from '../../../../services/http/http.service';
import { Account } from '../../../../services/account/account.service';
import { ActivatedRoute } from '@angular/router';
import { Chart } from 'chart.js';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  public action: object[] = null;
  public user = {
    name: {
      first: "",
      last: ""
    }
  }
  public time = {
    verified: 0,
    notVerified: 0,
    full: 240
  };
  public score = {
    full: 0,
    yours: 0
  };
  constructor(private http: Http, public account: Account, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    let id = this.activatedRoute.params['_value']['id'];
    this.fetch(id);
  }

  fetch(id = "") {
    this.http.grapql('main', `{ actions(user:"${id}") { details time { max { hour, minute } } date { year month day } score verified } users(id:"${id}" by:"user") { id name { first last } time } }`)
      .then((res: any) => {        
        this.action = res['data']['actions'].reverse();
        this.user = res['data']['users'][0]
        if (this.account.info['permission'] == 'admin') {
          this.time.full = this.user['time'];
        }
        this.calc();
      })
  }

  async calc() {
    await this.calcTimeNotVerified();
    await this.calcTimeVerified();
    await this.calcScore();
    setTimeout(() => {
      this.createTimeChart(true);
    }, 100);
  }

  calcTimeVerified() {
    let hour = 0,
      minute = 0;

    for (let i in this.action) {
      let action = this.action[i];
      if (action['verified'] == true) {
        let time = action['time']['max'];
        hour += parseInt(time['hour'])
        minute += parseInt(time['minute'])
      }
    }
    hour += ~~(minute / 60);
    minute = ~~(minute % 60);
    let time = hour;
    if (minute >= 30) time += 1;
    this.time.verified = time;
  }

  calcTimeNotVerified() {
    let hour = 0,
      minute = 0;

    for (let i in this.action) {
      let action = this.action[i];
      let time = action['time']['max'];
      hour += parseInt(time['hour'])
      minute += parseInt(time['minute'])
    }
    hour += ~~(minute / 60);
    minute = ~~(minute % 60);
    let time = hour;
    if (minute >= 30) time += 1;
    this.time.notVerified = time;
  }

  calcScore() {
    let score = 0
    for (let i in this.action) {
      score += this.action[i]['score'] || 0;
    }

    this.score.full = score;
    this.score.yours = Math.round(score / this.action.length);
  }
  createTimeChart(verified = false) {
    let time = 0, title = '';
    if (verified == true) {
      time = this.time.verified;
      title = 'ساعت تایید شده';
    } else if (verified == false) {
      time = this.time.notVerified;
      title = 'ساعت گذرانده شده';
    }
    var ctx = (<HTMLCanvasElement>document.getElementById('time')).getContext('2d');
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: [title, 'ساعت باقی مانده'],
        datasets: [{
          data: [time, this.time.full - time],
          backgroundColor: [
            "#2196f3",
            "#6ec6ff"
          ],
          borderWidth: 0
        }]
      }
    });
  }
}
