
import { Component, OnInit, TemplateRef, ViewChild, ChangeDetectorRef, OnDestroy} from '@angular/core';
import { QuestOSService } from '../../../qDesk/src/app/services/quest-os.service';
import { UiService } from '../../../qDesk/src/app/services/ui.service';
import { NbMenuService,NbDialogService } from '@nebular/theme';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-channel-settings',
  templateUrl: './channel-settings.component.html',
  styleUrls: ['./channel-settings.component.scss']
})
export class ChannelSettingsComponent implements OnInit {

  constructor(private cd:ChangeDetectorRef, private _sanitizer:DomSanitizer,private ui: UiService,private dialog:NbDialogService,private nbMenuService: NbMenuService, private q: QuestOSService) {
}
  challengeFlowFlag = 0;


  newInviteCodeMax = 5;
  newInviteCodeMaxChanged(event){

  }
  qrCodeURLSafe;

  async generateQR(text){
    console.log(text);
    this.qrCodeURLSafe = this._sanitizer.bypassSecurityTrustUrl(await this.q.os.utilities.qr.generate(text));
  }

  isOwner = false;
  generateInviteCode(){
    let channel = this.selectedChannel;
    let link;
    if(this.includeFolderStructure == 1){
      link = this.q.os.channel.invite.create(channel,this.newInviteCodeMax, true);
    }
    else{
      link =  this.q.os.channel.invite.create(channel,this.newInviteCodeMax);
    }

    let ivC =  this.q.os.ocean.dolphin.getInviteCodes(this.selectedChannel);
    this.channelInviteCodes = [];
    if(typeof ivC != 'undefined' && typeof ivC['items'] != 'undefined'){
             this.channelInviteCodes = ivC['items'];
    }
  }


  popupRef;
  openPopup(dialog: TemplateRef<any>) {
        this.popupRef = this.dialog.open(dialog, { context: 'this is some additional data passed to dialog' });
    }
  closePopup(){
    this.popupRef.close();
  }

  @ViewChild('qrCode') qrCode;
  showQR(text){
    this.generateQR(text);
    this.openPopup(this.qrCode);
  }

  removeInviteCode(link){
    this.q.os.channel.invite.remove(this.selectedChannel,link);
    this.channelInviteCodes = this.q.os.channel.invite.get(this.selectedChannel);
  }

  newInviteExportFoldersChanged(value){

  }

  includeFolderStructure = 1;

  channelInviteCodes = [];

  copyToClipboard(code){
    console.log(code);
  }

ngOnDestroy(){
  this.selectedChannelSub.unsubscribe();
}

selectedChannelSub;
  async initChannel(selectedChannel){
    this.selectedChannel = selectedChannel;
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

      console.log('getting flag for:',this.selectedChannel);
      this.challengeFlowFlag = this.q.os.channel.challenge.isEnabled();
    }

    this.cd.detectChanges();
  }

  async ngOnInit() {
    while(!this.q.isReady()){
      await this.ui.delay(1000);
    }

    this.initChannel(this.q.os.channel.getSelected());

    this.selectedChannelSub = this.q.os.channel.onSelect().subscribe( (value) => {
      this.initChannel(value);
    });




  }

  challengeFlowFlagChanged(){
      let flag = this.challengeFlowFlag;
      let ch = this.q.os.channel.getSelected();
      if(flag){
        this.q.os.channel.challenge.enable(ch)
      }
      else{
        this.q.os.channel.challenge.disable(ch)
      }
  }

  selectedChannel = "NoChannelSelected";
  noChannelSelected = "NoChannelSelected";

  deleteCurrentChannel(){
    this.q.os.channel.remove(this.selectedChannel);
  }


}
