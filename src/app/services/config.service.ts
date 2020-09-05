import { Injectable } from '@angular/core';
// import { IpfsService } from './ipfs.service'
// import { UiService } from '../services/ui.service'
import { v4 as uuidv4 } from 'uuid';
import { Subject } from 'rxjs';
// import { GlobalPubSub as QuestPubSub }  from '@questnetwork/quest-pubsub-js';
import { QuestPubSubService }  from './quest-pubsub.service';
import { ElectronService } from 'ngx-electron';
import { UiService }  from './ui.service';
import  packageJson from '../../../package.json';
const version = packageJson.version;
import { saveAs } from 'file-saver';

interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}

interface FSEntry {
  name: string;
  kind: string;
  items?: number;
}


@Injectable({
  providedIn: 'root'
})


export class ConfigService {

  isElectron = false;

  constructor(private pubsub:QuestPubSubService, private electron: ElectronService, private ui: UiService) {
    var userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.indexOf(' electron/') > -1) {
      this.isElectron = true;
      this.fs = this.electron.remote.require('fs');
      let configPath = this.electron.remote.app.getPath('userData');
      this.configFilePath = configPath + "/user.qcprofile";
    }

    this.pubsub.commitNowSub.subscribe( (value) => {
      this.commitNow();
    });

    this.pubsub.selectedChannelSub.subscribe( (value) => {
      this.config['selectedChannel'] = value;
      this.commit();
    });
  }

  configFilePath;
  autoSaveInterval;
  commitChanges = false;

  commit(){
    this.commitChanges = true;
  }

  fs:any;

  autoSave(){
    this.autoSaveInterval = setInterval( () => {
        if(this.ui.isElectron && this.commitChanges){
          this.commitNow();
          this.commitChanges = false;
        }
    },30000)
  }

    isInArray(value, array) {
     return array.indexOf(value) > -1;
   }


  config = {
    version: version,
    appId: 'quest-messenger-js',
    channelKeyChain:   {},
    channelParticipantList: {},
    channelNameList: [],
    channelFolderList: [],
    selectedChannel: "NoChannelSelected",
    sideBarFixed: { left: true, right: true},
    sideBarVisible: { left: true, right: false}
  };
  getChannelFolderList(){
    return this.config.channelFolderList;
  }
  commitNow(){
      // let folderList: TreeNode<FSEntry> = ;
      this.commitChanges=false;
      this.config = {
        version: version,
        appId: 'quest-messenger-js',
        channelKeyChain:   this.pubsub.getChannelKeyChain(),
        channelParticipantList: this.pubsub.getChannelParticipantList(),
        channelNameList: this.pubsub.getChannelNameList(),
        channelFolderList: this.config.channelFolderList,
        selectedChannel: this.pubsub.getSelectedChannel(),
        sideBarFixed: this.getSideBarFixed(),
        sideBarVisible: this.getSideBarVisible()
      };

      if(this.isElectron){
        this.fs.writeFileSync(this.configFilePath, JSON.stringify(this.config),{encoding:'utf8',flag:'w'})
      }
      else{
        let userProfileBlob = new Blob([ JSON.stringify(this.config)], { type: 'text/plain;charset=utf-8' });
        saveAs(userProfileBlob, "profile.qcprofile");
      }

  }
  getConfig(){
    return this.config;
  }
  channelFolderListSub = new Subject();
  setChannelFolderList(list){
    this.config.channelFolderList = list;
    this.channelFolderListSub.next(list);
  }

  isSignedIn(){
    if(this.isElectron){
      return this.fs.existsSync(this.configFilePath);
    }
    else{
      return false;
    }
  }
  readConfig(config = {}){
    try{
      if(this.isElectron){
       config = JSON.parse(this.fs.readFileSync(this.configFilePath,"utf8"));
      }
    }catch(error){console.log(error);}
    //put config into pubsub
    if(typeof(config['channelKeyChain']) != 'undefined'){
      this.pubsub.setChannelKeyChain(config['channelKeyChain']);
    }
    if(typeof(config['channelParticipantList']) != 'undefined'){
      console.log('Config: Importing ParticipantList ...',config['channelParticipantList']);
      this.pubsub.setChannelParticipantList(config['channelParticipantList']);
    }
    else{
        this.pubsub.setChannelParticipantList(this.config['channelParticipantList']);
    }
    if(typeof(config['channelNameList']) != 'undefined'){
      console.log('Config: Importing channelNameList ...',config['channelNameList']);
      this.pubsub.setChannelNameList(config['channelNameList']);
    }
    else{
      this.pubsub.setChannelNameList(this.config['channelNameList']);
    }
    if(typeof(config['channelFolderList']) != 'undefined'){
      console.log('Config: Importing Folder List ...',config['channelFolderList']);
      this.setChannelFolderList(config['channelFolderList']);
    }
    if(typeof(config['selectedChannel']) != 'undefined'){
      console.log('Config: Importing Selected Channel ...',config['selectedChannel']);
      this.setSelectedChannel(config['selectedChannel']);
    }

    if(typeof(config['sideBarFixed']) != 'undefined'){
      this.setSideBarFixed(config['sideBarFixed']);
    }
    if(typeof(config['sideBarVisible']) != 'undefined'){
      this.setSideBarVisible(config['sideBarVisible']);
    }


    return true;
  }

  setSelectedChannel(value){
    this.config['selectedChannel'] = value;
  }

  sideBarFixedSub = new Subject();
  setSideBarFixed(sideBarFixed){
    this.config.sideBarFixed = sideBarFixed
    this.sideBarFixedSub.next(sideBarFixed);
  }
  getSideBarFixed(){
      return this.config.sideBarFixed;
  }
  sideBarVisibleSub = new Subject();
  setSideBarVisible(sideBarVisible){
    this.config.sideBarVisible = sideBarVisible;
    this.sideBarVisibleSub.next(sideBarVisible);
  }
  getSideBarVisible(){
    return this.config.sideBarVisible;
  }

  async createChannel(channelNameDirty, parentFolderId = ""){
    let channelNameClean = await this.pubsub.createChannel(channelNameDirty);
    this.addToChannelFolderList(channelNameClean, parentFolderId);
    return channelNameClean;
  }

  async createFolder(newFolderNameDirty, parentFolderId = ""){
      let chfl = this.getChannelFolderList();
      let newFolder = { data: { name: newFolderNameDirty, kind:"dir", items: 0 }, expanded: true, children: [] };
      if(parentFolderId == ""){
        chfl.push(newFolder);
      }
      else{
        chfl = this.parseFolderStructureAndPushItem(chfl, parentFolderId, newFolder);
     }
     this.setChannelFolderList(chfl);
   }

  parseFolderStructureAndPushItem(folderStructure, parentFolderId = "", newFolder){
    for(let i=0;i<folderStructure.length;i++){
      if(folderStructure[i]['id'] == parentFolderId){

        folderStructure[i]['children'].push(newFolder);
      }
      else{
        if(typeof(folderStructure[i]['children']) != 'undefined'){
          folderStructure[i]['children'] = this.parseFolderStructureAndPushItem(folderStructure[i]['children'], parentFolderId, newFolder);
        }
      }
    }
    return folderStructure;
  }

  async addToChannelFolderList(channelNameClean, parentFolderId = "", newChannel = { data: { name: channelNameClean, kind:"rep", items: 0 }, expanded: true, children: [] }){
    let chfl = this.getChannelFolderList();
    if(parentFolderId == ""){
      chfl.push(newChannel);
    }
    else{
      chfl = this.parseFolderStructureAndPushItem(chfl, parentFolderId, newChannel);
   }
   this.setChannelFolderList(chfl);
  }

  createInviteCode(channel,newInviteCodeMax){
    if(typeof this.config['inviteCode'] == 'undefined'){
       this.config['inviteCode'] = {};
    }
    if(typeof this.config['inviteCode'][channel] == 'undefined'){
       this.config['inviteCode'][channel] = {};
    }
    if(typeof this.config['inviteCode'][channel]['codes'] == 'undefined'){
       this.config['inviteCode'][channel]['codes'] = [];
    }
    if(typeof this.config['inviteCode'][channel]['items'] == 'undefined'){
       this.config['inviteCode'][channel]['items'] = {};
    }


    let code = uuidv4();
    this.config['inviteCode'][channel]['codes'].push(  code  );
    this.config['inviteCode'][channel]['items'][code] = { max: newInviteCodeMax, used: 0 };

    return code;
  }


}
