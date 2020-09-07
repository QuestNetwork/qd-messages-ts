import { Component, OnInit } from '@angular/core';
import { QuestPubSubService } from '../services/quest-pubsub.service';

@Component({
  selector: 'app-channel-participant-list',
  templateUrl: './channel-participant-list.component.html',
  styleUrls: ['./channel-participant-list.component.scss']
})
export class ChannelParticipantListComponent implements OnInit {

  constructor(private pubsub: QuestPubSubService) { }

  channelParticipantListArray = [];


  initProcess(){
    if(this.pubsub.getSelectedChannel() != 'NoChannelSelected'){
      let uiCheck = setInterval( () =>{
        try{
          let fullPListArr = this.pubsub.getChannelParticipantList(this.pubsub.getSelectedChannel())['cList'].split(',');
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
        let fullPListArr = this.pubsub.getChannelParticipantList(this.pubsub.getSelectedChannel())['cList'].split(',');
        if(fullPListArr.length > 0){
          for(let i=0;i<fullPListArr.length;i++){
            fullPListArr[i] =   fullPListArr[i].substr(130);
          }
        }
        this.channelParticipantListArray = fullPListArr;
      }
      catch(e){}
    }

  }

  ngOnInit(): void {

    this.initProcess()



          this.pubsub.selectedChannelSub.subscribe( (value) => {
            this.initProcess();

            this.selectedChannel = value;
            console.log('App: Selected Channel: >>'+this.selectedChannel+'<<');
            console.log('App: noChannelSelected: >>'+this.noChannelSelected+"<<")
          });




        }


  selectedChannel = "NoChannelSelected";
  noChannelSelected = "NoChannelSelected";

}
