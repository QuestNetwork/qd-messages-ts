import { Component, OnInit, Input,ViewChild} from '@angular/core';
import { UiService} from '../services/ui.service';
import { IpfsService} from '../services/ipfs.service';
import { ConfigService} from '../services/config.service';
import { QuestPubSubService } from '../services/quest-pubsub.service';
import packageJson from '../../../package.json';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { saveAs } from 'file-saver';
import swarmJson from '../swarm.json';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  @ViewChild('newMessage') newMessage;

  fs: any;

  constructor(private ui: UiService, private ipfs: IpfsService,private pubsub: QuestPubSubService, private config:ConfigService) {

  }

  stringifyStore;

  ngOnInit(): void {
    //auto login
    if(this.config.isSignedIn()){
      this.attemptImportSettings({}).then( (importSettingsStatus) => {
        console.log('Import Settings Status:',importSettingsStatus);
        console.log(importSettingsStatus);
        if(importSettingsStatus){
          console.log('SignIn: Settings Imported Successfully');
          this.ui.showSnack('Loading Channels...','Almost There', {duration:2000});
          this.jumpToChannels();
          this.ui.signIn();
          if(this.pubsub.getSelectedChannel() == 'NoChannelSelected'){
            this.ui.updateProcessingStatus(false);
          }
        }
        else{this.ui.showSnack('Error Importing Settings!','Oh No');}
      });
    }
    else{
      this.ui.updateProcessingStatus(false);
    }

  }


   DEVMODE = swarmJson['dev'];

  public processing;
  public completeChallengeScreen = false;

  async openFile(files){
    this.ui.updateProcessingStatus(true);
    const droppedFile = files[0];

      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {

          let fileStoreReader = new FileReader();
          fileStoreReader.addEventListener('load', (event) => {
            this.openFileLoaded(event);
          });

          fileStoreReader.readAsText(file);
        });
      }
    }



async openFileLoaded(event){

    this.ui.showSnack('Parsing File...','Almost There');
      let parsedStringify;
    try{
       parsedStringify = JSON.parse(event.target['result']);
    }catch(error){}

    this.DEVMODE && console.log(parsedStringify);

      //this is a quick file and settings save before payment
    if(typeof(parsedStringify) == 'undefined' || typeof(parsedStringify.version) == 'undefined' || typeof(parsedStringify.appId) == 'undefined' || parsedStringify.appId != "quest-messenger-js"){
      //iNVALID FIlE FORMAT
      this.ui.showSnack('Not a valid QuestNetwork Keychain!','Got it!',{duration:2000});
      this.ui.updateProcessingStatus(false);
      return false;
    }
    else if(typeof(parsedStringify) != 'undefined' && typeof(parsedStringify.version) != 'undefined' && typeof(parsedStringify.appId) != 'undefined' && parsedStringify.appId == "quest-messenger-js"){
      //IMPORTED A .KEYCHAIN FILE
      let importSettingsStatus = await this.attemptImportSettings(parsedStringify);
      console.log('Sign In: Import Settings Status:',importSettingsStatus);
      //set temporary participantlist with only me (unknown who else is in there and owner pubkey also unknown, only owner channelpubkey is known)
      if(importSettingsStatus){this.ui.showSnack('Opening Messages...','Almost There');await this.jumpToChannels();return true;}
      else{this.ui.showSnack('Error Importing Settings!','Oh No');}
    }
    return false;
  }

  async jumpToChannels(){
    this.ui.toTabIndex(1);
    this.ui.enableTab('channelTab');
    this.ui.disableTab('signInTab');

    if(this.pubsub.getSelectedChannel() == 'NoChannelSelected' ){
      this.ui.updateProcessingStatus(false);
    }

    return true;
  }


  async generateDefaultSettings(){
    this.ui.updateProcessingStatus(true);
    let importSettingsStatus = await this.attemptImportSettings({});
    console.log('Import Settings Status:',importSettingsStatus);
    let stringify = JSON.stringify({
        version: packageJson['version'],
        appId: 'quest-messenger-js',
        channelKeyChain:   this.pubsub.getChannelKeyChain(),
        channelParticipantList:  this.pubsub.getChannelParticipantList(),
        channelNameList: this.pubsub.getChannelNameList(),
        channelchannelFolderList: this.config.getChannelFolderList()
    });
    let jobFileBlob = new Blob([stringify], { type: 'text/plain;charset=utf-8' });
    saveAs(jobFileBlob, "profile.qcprofile");
    importSettingsStatus = await this.attemptImportSettings(stringify);
    //settemporary participantlist with only me (unknown who else is in there and owner pubkey also unknown, only owner channelpubkey is known)

    if(importSettingsStatus){
      this.ui.showSnack('Default Settings Loaded...','Almost There', {duration: 2000});
      console.log("Default Settings Loaded...");
      await this.jumpToChannels();
    }
    else{this.ui.showSnack('Error Importing Settings!','Oh No');}
  }

  channelNameList = [];
  channelName;
  async createNewMessengerNetwork(){
    this.pubsub.setChannelKeyChain({});
    this.pubsub.setChannelParticipantList({});
    this.pubsub.setChannelNameList([]);
    this.channelName = await this.pubsub.createChannel('general');
    this.channelNameList.push(this.channelName);
    this.channelName = await this.pubsub.createChannel('developer');
    this.channelNameList.push(this.channelName);
    this.pubsub.setChannelNameList(this.channelNameList);
    let jobFileBlob = new Blob([JSON.stringify({
        version: packageJson['version'],
        appId: 'quest-messenger-js',
        channelKeyChain:   this.pubsub.getChannelKeyChain(),
        channelParticipantList: this.pubsub.getChannelParticipantList(),
        channelNameList: this.pubsub.getChannelNameList()
    })], { type: 'text/plain;charset=utf-8' });
    saveAs(jobFileBlob, "profile.qcprofile");
    // this.ui.setSettingsLoaded(true);
  }


  async attemptImportSettings(parsedStringify){
    try{
        await this.importSettings(parsedStringify);
        return true;
    }
    catch(error){
      if(error == 'keychain invalid'){
        this.ui.showSnack('Invalid Keychain!','Start Over',{duration:8000});
        this.ui.delay(2000);
        //window.location.reload();
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

  async importSettings(parsedStringify){
    console.log('Importing Settings ...',parsedStringify);
      this.ui.setElectronSize('0');
      this.ui.updateProcessingStatus(true);
      this.completeChallengeScreen = false;

      if(this.ui.isElectron()){
            this.ui.showSnack('Importing key...','Yeh',{duration:1000});
          await this.ui.delay(1200);

      }
      else{
          this.ui.showSnack('Importing key...','Yeh');
      }

      await this.ui.delay(2000);
      this.DEVMODE && console.log('Unpacking Global Keychain...')
      this.config.readConfig(parsedStringify);
      this.config.autoSave();

      //wait for ipfs
      this.ui.showSnack('Discovering Swarm...','Yeh',{duration:1000});
      console.log('SignIn: Waiting for IPFS...');
      while(!this.ipfs.isReady()){
        console.log('SignIn: Waiting for IPFS...');
        await this.ui.delay(5000);
      }

      this.ui.showSnack('Swarm Discovered...','Cool',{duration:1000});

      let defaultChannel = "NoChannelSelected";
      if(typeof(this.config.getConfig()['selectedChannel']) != 'undefined'){
        defaultChannel = this.config.getConfig()['selectedChannel'];
      }

      this.pubsub.setIpfsId(this.ipfs.getIpfsId());
      console.log('SignIn: Selecting Channel: '+defaultChannel+'...');
      this.pubsub.selectChannel(defaultChannel);
      return true;
    }

    public async dropped(files) {
      this.ui.updateProcessingStatus(true);
      // console.log(files);
      if(String(files[0].relativePath).endsWith('.qcprofile')){
        return this.openFile(files);
      }
      else{
        this.ui.updateProcessingStatus(false);
        alert("No suitable Quest Chat Profile!");
        this.ui.snackBarDismiss();
      }
    }

  public fileOver(event){

  }



  public files: NgxFileDropEntry[] = [];





}
