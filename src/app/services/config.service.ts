import { Injectable } from '@angular/core';
// import { IpfsService } from './ipfs.service'
// import { UiService } from '../services/ui.service'
import { v4 as uuidv4 } from 'uuid';
import { Subject } from 'rxjs';
// import { GlobalPubSub as QuestPubSub }  from '@questnetwork/quest-pubsub-js';
import { QuestPubSubService }  from './quest-pubsub.service';
import { ElectronService } from 'ngx-electron';
import { UiService }  from './ui.service';
const version = require('../swarm.json').version;


// declare var require;
// const QuestPubSub = require( 'local/quest-pubsub-js/dist/index.js' );


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

  constructor(private pubsub:QuestPubSubService, private electron: ElectronService, private ui: UiService) {
    this.fs = this.electron.remote.require('fs');
    let configPath = this.electron.remote.app.getPath('userData');
    this.configFilePath = configPath + "/user.qcprofile";

    this.pubsub.commitNowSub.subscribe( (value) => {
      this.commitNow();
    });
  }
  configFilePath;
  autoSaveInterval;
  commit = false;


  commitChanges(){
    this.commit = true;
  }
  fs:any;

  autoSave(){
    this.autoSaveInterval = setInterval( () => {
        if(this.ui.isElectron && this.commit){
          this.commitNow();
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
    channelNameList: ["general-----7b22637276223a22502d353231222c22657874223a747275652c226b65795f6f7073223a5b22766572696679225d2c226b7479223a224543222c2278223a2241466f686d414a3677706d41644767596549615a344b772d51446f715f50587670737361796141467a6b624b645f43577a3241747649585538395a52334d506f356e335346384b6a616c71382d57412d3758433243464155222c2279223a2241654a5671785f474e5f4a6e75464b75335951475457373275474f567671767a77765744624e57535532335f61734e304f4534772d43363951306668744f68466e58753558526d56376e35684248594e77656e58656f426d227d-----30820222300d06092a864886f70d01010105000382020f003082020a0282020100ef21ccbf260f39cf7659d56c4115aa7abcf2b093818b3fc0c43a675ffa40ab147d7a8a2c8c9278bf51cc81155eff7e040b300e6214f2240f2f48ecd66c1ad178c3a2c0cc91d3eeaea11c709f03d3df4da7029d3410c24de1e187f99aa9718d7ee2903d05c0200649113937cb99ae12aa963b310c40b072a78fb3b18dd3ba9b98b9800123ebc7924deef3f46f4eb23c9d51b2c21bdbaf7191d191b08e636ff0253aee519640d2be0adb21db45bd0aadef13ee3aee46345bcf178d0d48f1d89f9a0f6e8a14c20076014b7665866d19d2680f51a0a666bba422d3c66e752eacf7369524d69f761cfc44992bdc029920be334839cd9d333755a4c0549b9a110bbf9258fac27f5548f57173e1e9714d25408e787ca8c2b87955ef95651acf01bd2267196f68c2521c1de030ccdb476545505568c7a9f035d76c5c66b149214e7fbe40023349cb92f88066a4eec87cfbb863699edc0d7a2a1ef8d5c507f70fdc04489bc84fd1417f1af973d3fce41e12be6eb6b0374d56425d14a415d4a57ec2360be7d32d9c09d50c99f8ef61e5a8dd56a42b53bce4f52dd4ba42a23451a6ad2e00ca8259d829fb4292ed9dc236952a8928f44b07e0f762075eeacb3f9c0f6f89a88fac7e708c2a7134e4ef7ab540bceb7d497d8644513403fe745f3f7a2960976eb0a7074573cde3097939103c09425df29601a8f5e1890c89d25a628e25a71ae1d50203010001-----rep","developer-----7b22637276223a22502d353231222c22657874223a747275652c226b65795f6f7073223a5b22766572696679225d2c226b7479223a224543222c2278223a224145573931584948526772465f5755795065467768582d41615a4549494f566735545061554a4f454c61544e4e56424c61634463755536695a75546579476867714b42447573654e57704f4f6c41706d6179416255734273222c2279223a22414c71353159347366387832304857306d514b797a4c694764624c4e7159777a375668586738687355372d74386251682d4639757331394766624b614d7145427130504c706a6c4f69733958536b364a6e71564f52707a2d227d-----30820222300d06092a864886f70d01010105000382020f003082020a0282020100b8df55fc74e04daed69d6b2c20faf94fded0a0473876dd618b95efd253717d594ae420741ee46b60297894435877ec91ee9f00fed58f8398205fab6080da322dc70c3b9b9d470b112ce3e7a4a40f3d1f2b535c8aa3453dc9e8b3266eafaf9003dd6396902761b2e360f63feb5b863c286c01054c3b69c7d36247da18280df926038e4bf1cbb8850f65fa8a93ba3adb065aba4ee0c3064632bcdfe6cf2e7f2036ecc962e4e886c59144a7c7393a9ebad2f8b2e0578f90376c08fa4e1f6287efe8934161bab124a6fac1b40c566f2e2f3848bcba90a00479c84744dd4a9bcd49c816725d51a77fe7c88b76cc235881f25a482bc9ec8a92b3530e561615803bc26e91c6bbf4d10fe1bf7563d9c3f1acb522a03a73897bb069c283fc94196aed93e5ed03b684037f7401fb0bef4bc1cc369d7eead4eb9a9b2afd6588dbad4f01e7cc77dcbb763b8bac91ec0b096098362d7de774567ffb588d6c7d584d88affc3d427d8bec41eb4daead4e3338f64beec398c5fe06e4a2a239fef1bf540d86e8764beb28931a461bbff45baa27bd94f29922f67f1e641a164f50bd684cf5df1e6b131d5f9e06124375142bb756586b9a672ae6e461e9ec0510fe7df1ea329bf688fca206f317bf9632ec4b3018e516adf4f987afe679b70222e221153abc50ece3498edeab2ba6800fcaee1400cbf130ebd36c010a331b17422842d99d19685a29bb0203010001-----rep"],
    channelFolderList: [
      {
        data: { name: 'Quest Network (ipfs/pubsub)', kind: 'dir', items: 1 },
        expanded: true,
        children: [
          {
            data: { name: 'Community', kind: 'dir', items: 2 },
            expanded: true,
            children: [
              { data: { name: 'general-----7b22637276223a22502d353231222c22657874223a747275652c226b65795f6f7073223a5b22766572696679225d2c226b7479223a224543222c2278223a2241466f686d414a3677706d41644767596549615a344b772d51446f715f50587670737361796141467a6b624b645f43577a3241747649585538395a52334d506f356e335346384b6a616c71382d57412d3758433243464155222c2279223a2241654a5671785f474e5f4a6e75464b75335951475457373275474f567671767a77765744624e57535532335f61734e304f4534772d43363951306668744f68466e58753558526d56376e35684248594e77656e58656f426d227d-----30820222300d06092a864886f70d01010105000382020f003082020a0282020100ef21ccbf260f39cf7659d56c4115aa7abcf2b093818b3fc0c43a675ffa40ab147d7a8a2c8c9278bf51cc81155eff7e040b300e6214f2240f2f48ecd66c1ad178c3a2c0cc91d3eeaea11c709f03d3df4da7029d3410c24de1e187f99aa9718d7ee2903d05c0200649113937cb99ae12aa963b310c40b072a78fb3b18dd3ba9b98b9800123ebc7924deef3f46f4eb23c9d51b2c21bdbaf7191d191b08e636ff0253aee519640d2be0adb21db45bd0aadef13ee3aee46345bcf178d0d48f1d89f9a0f6e8a14c20076014b7665866d19d2680f51a0a666bba422d3c66e752eacf7369524d69f761cfc44992bdc029920be334839cd9d333755a4c0549b9a110bbf9258fac27f5548f57173e1e9714d25408e787ca8c2b87955ef95651acf01bd2267196f68c2521c1de030ccdb476545505568c7a9f035d76c5c66b149214e7fbe40023349cb92f88066a4eec87cfbb863699edc0d7a2a1ef8d5c507f70fdc04489bc84fd1417f1af973d3fce41e12be6eb6b0374d56425d14a415d4a57ec2360be7d32d9c09d50c99f8ef61e5a8dd56a42b53bce4f52dd4ba42a23451a6ad2e00ca8259d829fb4292ed9dc236952a8928f44b07e0f762075eeacb3f9c0f6f89a88fac7e708c2a7134e4ef7ab540bceb7d497d8644513403fe745f3f7a2960976eb0a7074573cde3097939103c09425df29601a8f5e1890c89d25a628e25a71ae1d50203010001-----rep', kind: 'rep'} },
              { data: { name: 'developer-----7b22637276223a22502d353231222c22657874223a747275652c226b65795f6f7073223a5b22766572696679225d2c226b7479223a224543222c2278223a224145573931584948526772465f5755795065467768582d41615a4549494f566735545061554a4f454c61544e4e56424c61634463755536695a75546579476867714b42447573654e57704f4f6c41706d6179416255734273222c2279223a22414c71353159347366387832304857306d514b797a4c694764624c4e7159777a375668586738687355372d74386251682d4639757331394766624b614d7145427130504c706a6c4f69733958536b364a6e71564f52707a2d227d-----30820222300d06092a864886f70d01010105000382020f003082020a0282020100b8df55fc74e04daed69d6b2c20faf94fded0a0473876dd618b95efd253717d594ae420741ee46b60297894435877ec91ee9f00fed58f8398205fab6080da322dc70c3b9b9d470b112ce3e7a4a40f3d1f2b535c8aa3453dc9e8b3266eafaf9003dd6396902761b2e360f63feb5b863c286c01054c3b69c7d36247da18280df926038e4bf1cbb8850f65fa8a93ba3adb065aba4ee0c3064632bcdfe6cf2e7f2036ecc962e4e886c59144a7c7393a9ebad2f8b2e0578f90376c08fa4e1f6287efe8934161bab124a6fac1b40c566f2e2f3848bcba90a00479c84744dd4a9bcd49c816725d51a77fe7c88b76cc235881f25a482bc9ec8a92b3530e561615803bc26e91c6bbf4d10fe1bf7563d9c3f1acb522a03a73897bb069c283fc94196aed93e5ed03b684037f7401fb0bef4bc1cc369d7eead4eb9a9b2afd6588dbad4f01e7cc77dcbb763b8bac91ec0b096098362d7de774567ffb588d6c7d584d88affc3d427d8bec41eb4daead4e3338f64beec398c5fe06e4a2a239fef1bf540d86e8764beb28931a461bbff45baa27bd94f29922f67f1e641a164f50bd684cf5df1e6b131d5f9e06124375142bb756586b9a672ae6e461e9ec0510fe7df1ea329bf688fca206f317bf9632ec4b3018e516adf4f987afe679b70222e221153abc50ece3498edeab2ba6800fcaee1400cbf130ebd36c010a331b17422842d99d19685a29bb0203010001-----rep', kind: 'rep'} },
            ],
          }
        ],
      }
    ],
    selectedChannel: "0",
    sideBarFixed: { left: true, right: true},
    sideBarVisible: { left: true, right: false}
  };
  getChannelFolderList(){
    return this.config.channelFolderList;
  }
  commitNow(){
      // let folderList: TreeNode<FSEntry> = ;
      this.commit=false;
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

      console.log(JSON.stringify(this.config));
      this.fs.writeFileSync(this.configFilePath, JSON.stringify(this.config),{encoding:'utf8',flag:'w'})

  }
  channelFolderListSub = new Subject();
  setChannelFolderList(list){
    this.config.channelFolderList = list;
    this.channelFolderListSub.next(list);
  }
  readConfig(config = {}){
    this.sideBarVisibleSub = new Subject();
    this.sideBarFixedSub = new Subject();

    try{
       config = JSON.parse(this.fs.readFileSync(this.configFilePath,"utf8"));
    }catch(error){console.log(error);}
    //put config into pubsub
    if(typeof(config['channelKeyChain']) != 'undefined'){
      this.pubsub.setChannelKeyChain(config['channelKeyChain']);
    }
    if(typeof(config['channelParticipantList']) != 'undefined'){
      console.log('Importing ParticipantList ...',config['channelParticipantList']);
      this.pubsub.setChannelParticipantList(config['channelParticipantList']);
    }
    else{
        this.pubsub.setChannelParticipantList(this.config['channelParticipantList']);
    }
    if(typeof(config['channelNameList']) != 'undefined'){
      console.log('Importing NameList ...',config['channelNameList']);
      this.pubsub.setChannelNameList(config['channelNameList']);
    }
    else{
      this.pubsub.setChannelNameList(this.config['channelNameList']);
    }
    if(typeof(config['channelFolderList']) != 'undefined'){
      console.log('Importing Folder List ...',config['channelFolderList']);
      this.setChannelFolderList(config['channelFolderList']);
    }

    if(typeof(config['sideBarFixed']) != 'undefined'){
      this.setSideBarFixed(config['sideBarFixed']);
    }
    if(typeof(config['sideBarVisible']) != 'undefined'){
      this.setSideBarVisible(config['sideBarVisible']);
    }


    return true;
  }

  sideBarFixedSub;
  setSideBarFixed(sideBarFixed){
    this.config.sideBarFixed = sideBarFixed
    this.sideBarFixedSub.next(sideBarFixed);
  }
  getSideBarFixed(){
      return this.config.sideBarFixed;
  }
  sideBarVisibleSub;
  setSideBarVisible(sideBarVisible){
    this.config.sideBarVisible = sideBarVisible;
    this.sideBarVisibleSub.next(sideBarVisible);
  }
  getSideBarVisible(){
    return this.config.sideBarVisible;
  }




}
