import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Toast {

  make(message = "", snackbar, timeout = 4000) {
    snackbar.open(message || "خطا از سوی سرور رخ داده است.", "", {
      direction: "rtl",
      timeoutMs: timeout
    })
  }
}
