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
    sideBarVisible: { left: true, right: false},
    inviteCodes: {}
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
        sideBarVisible: this.getSideBarVisible(),
        inviteCodes: this.pubsub.getInviteCodes()
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

    if(typeof(config['inviteCodes']) != 'undefined' && Object.keys(config['inviteCodes']).length !== 0){
      this.setInviteCodes(config['inviteCodes']);
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

  async addChannel(channelNameClean, parentFolderId = ""){
    await this.pubsub.addChannel(channelNameClean);
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

pFICache;
  parseFolderStructureAndPushItem(folderStructure, parentFolderId = "", newFolder,ifdoesntexist = false){
    for(let i=0;i<folderStructure.length;i++){
      if(folderStructure[i]['id'] == parentFolderId){
        if(!ifdoesntexist){
          folderStructure[i]['children'].push(newFolder);
        }
        else{

          let exists = false;
          if(typeof folderStructure[i]['children'] == 'undefined'){
             folderStructure[i]['children'] = [];
          }

          for (let i2=0;i2<folderStructure[i]['children'].length;i2++){
            if(folderStructure[i]['children'][i2]['data']['name'] == newFolder['data']['name']){
              exists = true;
              if(typeof folderStructure[i]['children'][i2]['id'] == 'undefined'){
                folderStructure[i]['children'][i2]['id'] = uuidv4();
              }
              parentFolderId = folderStructure[i]['children'][i2]['id'];
            }
          }
          if(!exists){
            parentFolderId = newFolder['id'];
            this.pFICache = parentFolderId;
            console.log(parentFolderId);
            folderStructure[i]['children'].push(newFolder);
          }

        }
      }
      else{
        if(typeof(folderStructure[i]['children']) != 'undefined'){
          folderStructure[i]['children'] = this.parseFolderStructureAndPushItem(folderStructure[i]['children'], parentFolderId, newFolder,ifdoesntexist);
        }
      }
    }
    return folderStructure;
  }

  parseFolderStructureAndGetPath(folderStructure, channelName, path = []){
    path = this.parseFolderStructureAndGetPathProcess(folderStructure, channelName);
    path.shift();
    return path.reverse();
  }

  parseFolderStructureAndGetPathProcess(folderStructure, channelName, path = []){
    for(let i=0;i<folderStructure.length;i++){
      if(folderStructure[i]['data']['name'] == channelName){
        path.push("F");
       return path;
      }
      else{
        if(typeof folderStructure[i]['children'] != 'undefined'){
          let testPath = this.parseFolderStructureAndGetPathProcess(folderStructure[i]['children'], channelName, path);
          // console.log('PTEST:',testPath);
          if(testPath[0] == "F"){
            path = testPath;
            path.push(folderStructure[i]['data']['name']);
            return path;
          }

        }
      }
    }
    return path;
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

  async importChannel(channelName,folders,parentFolderId,inviteToken,importFolderStructure){

    if(importFolderStructure == 1 && folders.length > 0){
        //see if folders exist starting at parentFolderId
        let chfl = this.getChannelFolderList();
        for(let i=0; i<folders.length;i++){
          let newFolder = { data: { name: folders[i], kind:"dir", items: 0 }, id: uuidv4(),expanded: true, children: [] };

          if(parentFolderId == ""){
            //check if exist at top level
            let exists = false;
            for (let i2=0;i2<chfl.length;i2++){
              if(chfl[i2]['data']['name'] == newFolder['data']['name']){
                exists = true;
                if(typeof chfl[i2]['id'] == 'undefined'){
                  chfl[i2]['id'] = uuidv4();
                }
                parentFolderId = chfl[i2]['id'];
              }
            }
            if(!exists){
              parentFolderId = newFolder['data']['id'];
              chfl.push(newFolder);
            }
          }
          else{
            chfl = this.parseFolderStructureAndPushItem(chfl, parentFolderId, newFolder, true);
            if(typeof this.pFICache != 'undefined' && this.pFICache != null){
              parentFolderId = this.pFICache;
            }
            console.log(parentFolderId);
         }


        }
        this.pFICache = null;
       this.setChannelFolderList(chfl);
    }
    await this.addChannel(channelName, parentFolderId);
    this.addInviteToken(channelName,inviteToken);
    return true;
  }

  setInviteCodes(codeObject, channel = 'all'){
    if(channel == 'all'){
      this.config['inviteCodes'] = codeObject;
      this.pubsub.setInviteCodes(this.config['inviteCodes']);
    }
    return true;
  }
  addInviteToken(channel,token){
    this.pubsub.addInviteToken(channel,token);
    return true;
  }
  removeInviteCode(channel,link){
    this.pubsub.removeInviteCode(channel, link)
  }


  createInviteCode(channel,newInviteCodeMax, importFolders = false){
    let code = uuidv4();
    let link = ""
    if(importFolders){
      //traverse folders and find this channel in the tree
      let pathArray = this.parseFolderStructureAndGetPath(this.config.channelFolderList, channel);
      if(pathArray.length > 0){
        link = pathArray.join("/////") + "/////" + channel + ":" + code;
      }
      else{
        link = channel + ":" + code;
      }
      console.log(pathArray);
    }
    else{
        link = channel + ":" + code;
    }

    link = Buffer.from(link,'utf8').toString('hex');
    this.pubsub.addInviteCode(channel,link,code,newInviteCodeMax);
    this.commitNow();
    return link;
  }

}
