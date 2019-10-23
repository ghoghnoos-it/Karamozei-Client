import { Component, OnInit } from '@angular/core';
import { Http } from '../../../../services/http/http.service';
import { Account } from '../../../../services/account/account.service';
import { Router } from '@angular/router';
import * as moment from 'jalali-moment';
import { Chart } from 'chart.js';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public action: any[] = null;
  public time = {
    verified: 0,
    notVerified: 0,
    full: 240
  };
  public score = {
    full: 0,
    yours: 0
  };
  public season: string = '';
  public user: any[] = null;
  constructor(private http: Http, public account: Account, private router: Router) { }

  ngOnInit() {
    if (this.account.info['permission'] == 'user') {
      this.getDataForUser();
    } else if (this.account.info['permission'] != "user") {
      this.getDataForNotUser();
    }
  }

  getDataForUser() {
    this.http.grapql('main', `{ actions { time { max { hour, minute } } date { year month day } score verified } me { time } }`)
      .then((res: any) => {
        this.action = res['data']['actions'];
        this.time.full = parseInt(res['data']['me']['time'].toString());
        setTimeout(() => {
          this.calc().then(() => {
            this.createTimeChart();
            this.createScoreChart();
          })
        }, 50);
      })
  }

  getDataForNotUser() {
    let date = moment().locale('fa').format("YYYY/M").split("/");
    let month = parseInt(date[1].toString()), season = "";
    if (4 <= month && month <= 6) {
      season = "تابستان";
    } else if (7 <= month && month <= 9) {
      season = "پاییز";
    } else {
      season = "زمستان-بهار";
    }
    this.season = season;
    let query = `{ users (by: "user" entryYear: "${date[0]}" entrySeason: "${season}") { id name { first last } phone { number } } }`;
    this.http.grapql('main', query).then((res: any) => {
      this.user = res['data']['users'];
    })
  }

  async calc() {
    await this.calcTimeNotVerified();
    await this.calcTimeVerified();
    await this.calcScore();
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

  changeChart(event) {
    if (event.index == 0) {
      this.createTimeChart(false);
    } else if (event.index == 1) {
      this.createTimeChart(true)
    }
  }

  createTimeChart(verified = false) {
    let time = 0, title = '', full = 240;
    if (verified == true) {
      time = this.time.verified;
      title = 'ساعت تایید شده';
    } else if (verified == false) {
      time = this.time.notVerified;
      title = 'ساعت گذرانده شده';
    }
    if (this.time['full']) {
      full = this.time['full'];
    }
    var ctx = (<HTMLCanvasElement>document.getElementById('time')).getContext('2d');
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: [title, 'ساعت باقی مانده'],
        datasets: [{
          data: [time, full - time],
          backgroundColor: [
            "#2196f3",
            "#6ec6ff"
          ],
          borderWidth: 0
        }]
      }
    });
  }
  createScoreChart() {
    let labels = ["شنبه", "یکشنبه", "دوشنبه", "سه شنبه", "چهارشنبه", "پنج شنبه", "جمعه"];
    let days = [];
    let data = [];
    let backgroundColor = Array(6).fill("#6ec6ff");
    let dayWeekIndex = parseInt(moment().locale("fa").weekday().toString());
    let startDayWeek = parseInt(moment().locale("fa").format("D").toString()) - dayWeekIndex;

    for (let i = 0; i < dayWeekIndex; i++) {
      days.push(startDayWeek + i);
      data.push(0);
    }

    let min = this.action.length - dayWeekIndex;
    if (this.action.length < 6) min = 0;
    //      i = 3                  ;  0 <= 3 
    for (let i = this.action.length - 1; min <= i; i--) {
      let day = parseInt(this.action[i]['date']['day']);
      if (day >= startDayWeek) {
        data[days.indexOf(day)] = this.action[i]['score'];
      }
    }

    var ctx = (<HTMLCanvasElement>document.getElementById('score')).getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: "امتیاز روز",
          data,
          backgroundColor,
          borderWidth: 0,
        }]
      }
    });
  }

  makeCall(phone = '') {
    window.open(`tel:${phone}`)
  }

  showUser(id = '') {
    this.router.navigate([`/panel/user/${id}`]);
  }
}
