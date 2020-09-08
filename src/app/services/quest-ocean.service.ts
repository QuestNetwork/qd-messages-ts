import { Injectable } from '@angular/core';
import { Ocean }  from '@questnetwork/quest-ocean-js';
import * as swarmJson from '../swarm.json';


@Injectable({
  providedIn: 'root'
})
export class QuestOceanService {
  //
  ocean;
  constructor() {
    this.ocean = Ocean;
  }

  config = {};
  async start(){
    this.config = {
      ipfs: {
        swarm: swarmJson['ipfs']['swarm']
      }
    };
    await this.ocean.create(this.config);
  }


}
