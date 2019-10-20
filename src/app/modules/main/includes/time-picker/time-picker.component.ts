import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.css']
})
export class TimePickerComponent implements OnInit {

  @Input() hour: number = null;
  @Input() minute: number = null;
  @Input() min: string = "0";
  @Output() onChange: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit() {
    let now = new Date();
    if(this.hour == null){
      this.hour = now.getHours();
    }
    if(this.minute == null){
      this.minute = now.getMinutes();
    }
    this.emit();
  }
  emit() {
    this.onChange.emit(
      {
        time: `${this.hour}:${this.minute}`,
        hour: this.hour,
        minute: this.minute
      }
    )
  }
}
