import { Component, OnInit } from '@angular/core';
import { QuestOSService } from '../../../qDesk/src/app/services/quest-os.service';
import { UiService } from '../../../qDesk/src/app/services/ui.service';

@Component({
  selector: 'app-channel-participant-list',
  templateUrl: './channel-participant-list.component.html',
  styleUrls: ['./channel-participant-list.component.scss']
})
export class ChannelParticipantListComponent implements OnInit {

  constructor(private q: QuestOSService, private ui: UiService) { }

  channelParticipantListArray = [];

  uiCheck;
  selectedChannelSub;
  ngOnDestroy(){
    clearInterval(this.uiCheck);
    this.selectedChannelSub.unsubscribe();
  }

  async initProcess(){

    if(this.q.os.channel.getSelected() != 'NoChannelSelected'){

      try{
        let fullPListArr = this.q.os.ocean.dolphin.getChannelParticipantList(this.q.os.channel.getSelected())['cList'].split(',');
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

    while(!this.q.isReady() || !this.q.os.isSignedIn()){
      await this.ui.delay(1000);
    }

    this.uiCheck = setInterval( () =>{
      this.initProcess();
    },10000);

    await this.initProcess();

    this.selectedChannelSub = this.q.os.channel.onSelect().subscribe( (value) => {
      console.log('ChannelParticipantList: changed channel');
      this.initProcess();

      this.selectedChannel = value;
      console.log('App: Selected Channel: >>'+this.selectedChannel+'<<');
      console.log('App: noChannelSelected: >>'+this.noChannelSelected+"<<")
    });




        }

  selectedChannel = "NoChannelSelected";
  noChannelSelected = "NoChannelSelected";

}
