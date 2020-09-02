import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WhistleService {

  constructor() { }

  private sessionWhistles = [];

  public addSessionWhistle(whisle){
    this.sessionWhistles.push(whisle);
  }

  public getSessionWhistle(){
    if(typeof(this.sessionWhistles[0]) == 'undefined'){
      throw('no whistles');
    }
    let whistle = this.sessionWhistles[0];
    this.sessionWhistles = this.sessionWhistles.slice(0,0);
    return whistle;
  }

}
