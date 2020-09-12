import { Component, OnInit } from '@angular/core';
import { QuestOSService } from '../services/quest-os.service';
import { UiService } from '../services/ui.service';

@Component({
  selector: 'app-channel-participant-list',
  templateUrl: './channel-participant-list.component.html',
  styleUrls: ['./channel-participant-list.component.scss']
})
export class ChannelParticipantListComponent implements OnInit {

  constructor(private q: QuestOSService, private ui: UiService) { }

  channelParticipantListArray = [];


  async initProcess(){

    while(!this.q.isReady()){
      await this.ui.delay(1000);
    }

    if(this.q.os.ocean.dolphin.getSelectedChannel() != 'NoChannelSelected'){
      let uiCheck = setInterval( () =>{
        try{
          let fullPListArr = this.q.os.ocean.dolphin.getChannelParticipantList(this.q.os.ocean.dolphin.getSelectedChannel())['cList'].split(',');
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
        let fullPListArr = this.q.os.ocean.dolphin.getChannelParticipantList(this.q.os.ocean.dolphin.getSelectedChannel())['cList'].split(',');
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


          this.q.os.ocean.dolphin.selectedChannelSub.subscribe( (value) => {
            this.initProcess();

            this.selectedChannel = value;
            console.log('App: Selected Channel: >>'+this.selectedChannel+'<<');
            console.log('App: noChannelSelected: >>'+this.noChannelSelected+"<<")
          });




        }


  selectedChannel = "NoChannelSelected";
  noChannelSelected = "NoChannelSelected";

}
