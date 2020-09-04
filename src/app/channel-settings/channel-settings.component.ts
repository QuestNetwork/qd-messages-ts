import { Component, OnInit } from '@angular/core';
import { QuestPubSubService } from '../services/quest-pubsub.service';

@Component({
  selector: 'app-channel-settings',
  templateUrl: './channel-settings.component.html',
  styleUrls: ['./channel-settings.component.scss']
})
export class ChannelSettingsComponent implements OnInit {

  constructor(private pubsub: QuestPubSubService) { }

  challengeFlowFlag = 0;
  challengeFlowFlagChanged(value){

  }

  newInviteCodeMax = 5;
  newInviteCodeMaxChanged(event){

  }
  generateInviteCode(){

  }

  newInviteExportFoldersChanged(value){

  }

  includeFolderStructure = 1;

  channelInviteCodes = [ { usersMax: 5, usersUsed: 2, code: "1234567812378136218376128371238761387126312873612873612837621378126371238126387126318273126382173612836217368127" } ];

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
