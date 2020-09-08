import { Injectable } from '@angular/core';
import { qOS }  from '@questnetwork/quest-os-js';
import * as swarmJson from '../swarm.json';


@Injectable({
  providedIn: 'root'
})
export class QuestOSService {
  //
  public os;
  ready = false;
  config;
  constructor() {
    this.config = {
      ipfs: {
        swarm: swarmJson['ipfs']['swarm']
      }
    };
    this.os = qOS;
  }
  async boot(){
    await this.os.boot(this.config);
    this.ready = true;
  }
  isReady(){
    return this.ready;
  }
}
