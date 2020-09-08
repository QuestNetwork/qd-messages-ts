import { Component, OnInit } from '@angular/core';
import { QuestOceanService } from '../services/quest-ocean.service';
import { UiService } from '../services/ui.service';

@Component({
  selector: 'app-channel-participant-list',
  templateUrl: './channel-participant-list.component.html',
  styleUrls: ['./channel-participant-list.component.scss']
})
export class ChannelParticipantListComponent implements OnInit {

  constructor(private os: QuestOceanService, private ui: UiService) { }

  channelParticipantListArray = [];


  async initProcess(){

    while(!this.os.ocean.isReady()){
      await this.ui.delay(1000);
    }

    if(this.os.ocean.dolphin.getSelectedChannel() != 'NoChannelSelected'){
      let uiCheck = setInterval( () =>{
        try{
          let fullPListArr = this.os.ocean.dolphin.getChannelParticipantList(this.os.ocean.dolphin.getSelectedChannel())['cList'].split(',');
          if(fullPListArr.length > 0){
            for(let i=0;i<fullPListArr.length;i++){
              fullPListArr[i] =   fullPListArr[i].substr(130);
            }
          }
          this.channelParticipantListArray = fullPListArr;
        }
        catch(e){}

      },10000);

      try{
        let fullPListArr = this.os.ocean.dolphin.getChannelParticipantList(this.os.ocean.dolphin.getSelectedChannel())['cList'].split(',');
        if(fullPListArr.length > 0){
          for(let i=0;i<fullPListArr.length;i++){
            fullPListArr[i] =   fullPListArr[i].substr(130);
          }
        }
        this.channelParticipantListArray = fullPListArr;
      }
      catch(e){}
    }

    return true;

  }

  async ngOnInit() {

    await this.initProcess()


          this.os.ocean.dolphin.selectedChannelSub.subscribe( (value) => {
            this.initProcess();

            this.selectedChannel = value;
            console.log('App: Selected Channel: >>'+this.selectedChannel+'<<');
            console.log('App: noChannelSelected: >>'+this.noChannelSelected+"<<")
          });




        }


  selectedChannel = "NoChannelSelected";
  noChannelSelected = "NoChannelSelected";

}
