import { Injectable } from '@angular/core';
import { qOS }  from '@questnetwork/quest-os-js';
import * as swarmJson from '../swarm.json';
import  packageJson from '../../../package.json';
import { ElectronService } from 'ngx-electron';
const version = packageJson.version;

@Injectable({
  providedIn: 'root'
})
export class QuestOSService {
  //
  public os;
  ready = false;
  config;
  constructor(private electron: ElectronService) {
    this.config = {
      ipfs: {
        swarm: swarmJson['ipfs']['swarm']
      },
      version: version,
      dependencies: {
        electronService: this.electron
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
