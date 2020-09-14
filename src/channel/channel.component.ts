import { Component, OnInit, Input,ViewChild, ChangeDetectorRef} from '@angular/core';
import { UiService} from '../../../qDesk/src/app/services/ui.service';
import { QuestOSService } from '../../../qDesk/src/app/services/quest-os.service';

import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';

import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import swarmJson from '../swarm.json';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
})
export class ChannelComponent implements OnInit {




  @Input() channel: string;
  @ViewChild('newMessage') newMessage;

  constructor(private _sanitizer: DomSanitizer, private aChD: ChangeDetectorRef, private ui: UiService, private q: QuestOSService) {
    //parse channels
  }
  DEVMODE = swarmJson['dev'];

  noChannelSelected = "NoChannelSelected";

  ngOnInit(): void {

    console.log("Channel: Initializing...");

    //load channel
    console.log("Channel: Bootstrapping Channel...");
    if(this.channel != 'NoChannelSelected'){
      this.attemptJoinChannel(this.channel);
    }
}

  public showChallengeScreen = false;
  public showJoinScreen = false;
  public showInviteScreen = false;

  goToCaptcha(){
    this.showChallengeScreen = true;
    this.showJoinScreen = false;
    this.showInviteScreen = false;
  }

  goToInviteScreen(){
    this.showChallengeScreen = false;
    this.showJoinScreen = false;
    this.showInviteScreen = true;
  }

  goToJoin(){
    this.showChallengeScreen = false;
    this.showJoinScreen = true;
    this.showInviteScreen = false;
  }

  challengeFail(){
    this.showChallengeScreen = true;
    this.ui.updateProcessingStatus(false);
    this.ui.setElectronSize('0-keyimport');
    //we didn't prove that we are human when first initializing the quest
    this.ui.showSnack('Prove that you are smart', 'Please',{duration:4000});
    return false;
  }

  captchaCode;
  inviteToken;
  completedChallenge(tokenorcode){
    setTimeout( () => {
      this.ui.updateProcessingStatus(false);
    },30000);
    this.ui.updateProcessingStatus(true);
    this.q.os.ocean.dolphin.completedChallenge(this.channel, tokenorcode);
  }

  messages = [];

  captchaImageResource: SafeUrl;
  async handleNewMessage(pubObj){
    if(pubObj['type'] == "CHALLENGE" ){

      console.log('Received Challenge');
      let imageBuffer = pubObj['captchaImageBuffer'];
      let imageB64 = Buffer.from(imageBuffer.data).toString('base64');

      this.captchaImageResource = this._sanitizer.bypassSecurityTrustUrl("data:image/png;base64,"+imageB64);
      // this.showChallengeScreen = true;
      this.showJoinScreen = true;
      this.ui.updateProcessingStatus(false);
      this.aChD.detectChanges();
      // this.challengeFail()

    }
    else if(pubObj['type'] == "ownerSayHi"){
      //load chat
      this.ui.updateProcessingStatus(false);
      this.showChallengeScreen = false;
      this.showJoinScreen = false;
      this.showInviteScreen = false;
      this.aChD.detectChanges();
    }
    else if(pubObj['type'] == "CHANNEL_MESSAGE"){
      pubObj['participant'] = {};
      if(pubObj['self']){
        pubObj['reply'] = true;
      }
      else{
        pubObj['reply'] = false;
      }
      pubObj['channelPubKey'] = pubObj['channelPubKey'].substr(130);
      pubObj['participant']['avatar'] = "./assets/defaultAvatar.png";
      this.messages.push(pubObj);
      this.aChD.detectChanges();
    }

    return true;
  }

  async attemptJoinChannel(channel){
    console.log('attempting to join: ',channel);
    try{
        if(!this.q.os.ocean.dolphin.isSubscribed(this.channel)){
          await this.q.os.ocean.dolphin.joinChannel(channel);
        }
        this.ui.showSnack('Loading Channel...','All right', {duration: 2500});

        let messageHistory = this.q.os.ocean.dolphin.getChannelHistory(this.channel);
        this.DEVMODE && console.log('got history: ',messageHistory);
        for(let i = 0;i<messageHistory.length;i++){
          await this.handleNewMessage(messageHistory[i]);
        }
        this.q.os.ocean.dolphin.listen(channel).subscribe( async (pubObj) => {
          await this.handleNewMessage(pubObj)
        });

        let isOwner = this.q.os.ocean.dolphin.isOwner(channel,this.q.os.ocean.dolphin.getChannelKeyChain(channel)['channelPubKey']);
        console.log('isOwner:',isOwner);
        if(isOwner){
          this.showChallengeScreen = false;
          this.showJoinScreen = false;
          this.showInviteScreen = false;
          this.ui.updateProcessingStatus(false);
        }
    }
    catch(error){
      if(error == 'reCaptcha'){
        return this.challengeFail();
      }
      else if(error == 'key invalid'){
        this.ui.showSnack('Invalid Key!','Start Over',{duration:8000});
        this.ui.delay(2000);
        //window.location.reload(;
        return false;
      }
      else{
        this.ui.showSnack('Swarm Error =(','Start Over', {duration:8000});
        console.log(error);
        await this.ui.delay(5000);
      //  window.location.reload();
        return false;
      }
    }
  }

  async publishChannelMessage(event){
    this.q.os.channel.publish(this.channel, event.message);
    this.newMessage.nativeElement.value = "";
  }



}
