import { Component, OnInit } from '@angular/core';
import { QuestOSService } from '../services/quest-os.service';
import { UiService } from '../services/ui.service';

@Component({
  selector: 'app-channel-settings',
  templateUrl: './channel-settings.component.html',
  styleUrls: ['./channel-settings.component.scss']
})
export class ChannelSettingsComponent implements OnInit {

  constructor(private ui: UiService,private q: QuestOSService) { }

  challengeFlowFlag = 0;
  challengeFlowFlagChanged(value){

  }

  newInviteCodeMax = 5;
  newInviteCodeMaxChanged(event){

  }

  isOwner = false;
  generateInviteCode(){
    let channel = this.selectedChannel;
    let link;
    if(this.includeFolderStructure == 1){
      link = this.q.os.createInvite(channel,this.newInviteCodeMax, true);
    }
    else{
      link =  this.q.os.createInvite(channel,this.newInviteCodeMax);
    }

    let ivC =  this.q.os.ocean.dolphin.getInviteCodes(this.selectedChannel);
    this.channelInviteCodes = [];
    if(typeof ivC != 'undefined' && typeof ivC['items'] != 'undefined'){
             this.channelInviteCodes = ivC['items'];
    }
  }

  removeInviteCode(link){
    this.q.os.ocean.dolphin.removeInviteCode(this.selectedChannel,link);
    this.channelInviteCodes = this.q.os.ocean.dolphin.getInviteCodes(this.selectedChannel)['items'];
  }

  newInviteExportFoldersChanged(value){

  }

  includeFolderStructure = 1;

  channelInviteCodes = [];

  copyToClipboard(code){
    console.log(code);
  }


  async ngOnInit() {
    while(!this.q.isReady()){
      await this.ui.delay(1000);
    }

    this.q.os.ocean.dolphin.selectedChannelSub.subscribe( (value) => {
      this.selectedChannel = value;
      console.log('Channel-Settings: Selected Channel: >>'+this.selectedChannel+'<<');
      console.log('Channel-Settings: noChannelSelected: >>'+this.noChannelSelected+"<<");

      if(this.selectedChannel.indexOf('-----') > -1){
        this.isOwner = this.q.os.ocean.dolphin.isOwner(this.selectedChannel);
        console.log('Channel-Settings:',this.isOwner);

        this.channelInviteCodes = [];
        let ivC = this.q.os.ocean.dolphin.getInviteCodes(this.selectedChannel);
        if(typeof ivC != 'undefined' && typeof ivC['items'] != 'undefined'){
                 this.channelInviteCodes = ivC['items'];
        }
      }
    });




  }

  selectedChannel = "NoChannelSelected";
  noChannelSelected = "NoChannelSelected";

  deleteCurrentChannel(){
    this.q.os.removeChannel(this.selectedChannel);
  }


}
