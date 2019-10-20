import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Versions {
  public version: string = "";
  public bugs: object[] = [];
  constructor() { }
}
