import { Component, OnInit } from '@angular/core';
import { QuestPubSubService } from '../services/quest-pubsub.service';
import { ConfigService } from '../services/config.service';

@Component({
  selector: 'app-channel-settings',
  templateUrl: './channel-settings.component.html',
  styleUrls: ['./channel-settings.component.scss']
})
export class ChannelSettingsComponent implements OnInit {

  constructor(private pubsub: QuestPubSubService, private config:ConfigService) { }

  challengeFlowFlag = 0;
  challengeFlowFlagChanged(value){

  }

  newInviteCodeMax = 5;
  newInviteCodeMaxChanged(event){

  }
  generateInviteCode(){
    let channel = this.pubsub.getSelectedChannel();
    let code;
    code = this.config.createInviteCode(channel,this.newInviteCodeMax);
    code = channel + ":" + code;
    if(this.includeFolderStructure == 1){

    }
    code = Buffer.from(code,'utf8').toString('hex');
    this.channelInviteCodes.push( { usersMax: this.newInviteCodeMax, usersUsed: 0, code: code } );
  }

  newInviteExportFoldersChanged(value){

  }

  includeFolderStructure = 1;

  channelInviteCodes = [];

  copyToClipboard(code){
    console.log(code);
  }


  ngOnInit(): void {
    this.pubsub.selectedChannelSub.subscribe( (value) => {
      this.selectedChannel = value;
      console.log('App: Selected Channel: >>'+this.selectedChannel+'<<');
      console.log('App: noChannelSelected: >>'+this.noChannelSelected+"<<")
    });


  }

  selectedChannel = "NoChannelSelected";
  noChannelSelected = "NoChannelSelected";


}
