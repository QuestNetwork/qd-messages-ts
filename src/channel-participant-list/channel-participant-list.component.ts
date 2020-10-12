import { Component, Injectable,ElementRef,OnInit, TemplateRef, ViewChild, OnDestroy,ChangeDetectorRef } from '@angular/core';
import { QuestOSService } from '../../../qDesk/src/app/services/quest-os.service';
import { UiService } from '../../../qDesk/src/app/services/ui.service';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { NbDialogService } from '@nebular/theme';
import { v4 as uuidv4 } from 'uuid';


@Component({
  selector: 'messages-channel-participant-list',
  templateUrl: './channel-participant-list.component.html',
  styleUrls: ['./channel-participant-list.component.scss']
})
export class ChannelParticipantListComponent implements OnInit {

  clickParticipant(v){
    this.dev && console.log(v);
  }

  constructor(private cd: ChangeDetectorRef, private q: QuestOSService, private ui: UiService,private dialog:NbDialogService) {
    this.dev = false;
   }

   isOnline(channelPubKey){
     return this.q.os.channel.isPeerOnline(channelPubKey);
   }

   sortFoldersByName(objArray){
     objArray.sort(function(a, b) {
      return a.name.localeCompare(b.name);
     });

     let othersOnly = objArray.filter(e => e.id == 'others');
     objArray = objArray.filter(e => e.id != 'others');
     if(typeof othersOnly[0] != 'undefined'){
       objArray.push(othersOnly[0]);
     }
     return objArray;

   }


   channel = "NoChannelSelected";

   folders = [];
   connectedTo = [];

   drop(event: CdkDragDrop<string[]>) {
     if (event.previousContainer === event.container) {
       moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
     } else {
       transferArrayItem(event.previousContainer.data,
                         event.container.data,
                         event.previousIndex,
                         event.currentIndex);
     }

     this.q.os.channel.setParticipantFolders(this.channel,this.folders);
   }




  channelParticipantListArray = [];

  uiCheck;
  selectedChannelSub;
  ngOnDestroy(){
    clearInterval(this.uiCheck);
    this.selectedChannelSub.unsubscribe();
  }


  getFolderNameForId(id){
    for(let i=0;i<this.folders.length;i++){

        if(this.folders[i]['id'] == id){
          return this.folders[i]['name'];
        }

    }
  }


  async openSocialProfile(name,channelPublicKey){
    if(name == 'Anonymous'){
      return false;
    }

    //get profileId for channelPublicKey
    let profileId = await this.q.os.social.profile.getByChannelPubKey(channelPublicKey);
    profileId = profileId['key']['pubKey'];
    this.dev && console.log(profileId);

    //select this profile
    this.q.os.social.profile.select(profileId);

    //jump to social tabgo
    this.q.os.ui.toTabIndex('2');

  }


  getParticipantNameForId(id){
    for(let i=0;i<this.folders.length;i++){
      for(let i2=0;i2<this.folders[i]['participants'].length;i2++){
        if(this.folders[i]['participants'][i2]['pubKey'] == id){
          return this.folders[i]['participants'][i2]['name'];
        }
      }
    }
  }

  newFolderName;
  @ViewChild('folder') folderPop;
  createFolder(name){
    this.folders.push( { id: uuidv4(), name: name, participants: [] });
    // this.connectedTo = this.folders;

    this.folders = this.sortFoldersByName(this.folders);

    this.connectedTo = [];
    for(let i=0;i<this.folders.length;i++){
        this.connectedTo.push(this.folders[i]['id']);
    }


    this.q.os.channel.setParticipantFolders(this.channel,this.folders);
    this.closePopup();
  }

  removeFolder(id){
    this.folders = this.sortFoldersByName(this.folders.filter(e => e.id != id));

    for(let i=0;i<this.folders.length;i++){
        this.connectedTo.push(this.folders[i]['id']);
    }
    this.q.os.channel.setParticipantFolders(this.channel,this.folders);
  }

  editedFolderName;
  editedFolderId;
  @ViewChild('folderEdit') folderEditPop;
  editFolder(id, name){
    this.connectedTo = [];
    for(let i=0;i<this.folders.length;i++){
        if(this.folders[i]['id'] == id){
           this.folders[i]['name'] = this.editedFolderName;
        }

    }

    this.folders = this.sortFoldersByName(this.folders);
    for(let i=0;i<this.folders.length;i++){
      this.connectedTo.push(this.folders[i]['id']);
    }

    //save new folders
    // this.connectedTo = this.folders;
    this.q.os.channel.setParticipantFolders(this.channel,this.folders);
    this.closePopup();
  }

  editedParticipantId;
  editedParticipantName;
  @ViewChild('participantEdit') participantEditPop;
  editParticipant(id, name){
    this.connectedTo = [];
    for(let i=0;i<this.folders.length;i++){
      for(let i2=0;i2<this.folders[i]['participants'].length;i2++){
        if(this.folders[i]['participants'][i2]['pubKey'] == this.editedParticipantId){
          this.folders[i]['participants'][i2]['nick'] = this.editedParticipantName;
        }
      }
      this.connectedTo.push(this.folders[i]['id']);
    }

    //save new folders
    this.q.os.channel.setParticipantFolders(this.channel,this.folders);
    this.closePopup();
  }

  popupRef = [];
  openPopup(dialog: TemplateRef<any>, folderId = "", participantId = "") {
        if(folderId != ""){
          this.editedFolderId = folderId;
          this.editedFolderName = this.getFolderNameForId(folderId);
        }
        if(participantId != ""){
          this.editedParticipantId = participantId;
          this.editedParticipantName = this.getParticipantNameForId(participantId);
        }

        this.popupRef.push(this.dialog.open(dialog, { context: 'this is some additional data passed to dialog' }));
    }

    closePopup(){
      console.log('close toggled');
      // for(i=0;i<this.popupRef.length;i++){
        this.popupRef[this.popupRef.length-1].close();
        this.popupRef.pop();
      // }
    }


  async initRefresh(rerun = true){
    await this.q.os.utilities.delay(2000);
    this.cd.detectChanges();
    await this.q.os.utilities.delay(2000);
    this.cd.detectChanges();
    await this.q.os.utilities.delay(2000);
    this.cd.detectChanges();
    if(rerun){
      await this.q.os.utilities.delay(2000);
      this.initRefresh(false);
    }
  }

  async initProcess(){

    this.channel = this.q.os.channel.getSelected();
    let channel = this.channel;

    if(channel != 'NoChannelSelected'){

      try{
        let fullCListArr = this.q.os.ocean.dolphin.getChannelParticipantList(channel)['cList'].split(',');
        let fullCListArrCopy = fullCListArr;

        this.connectedTo = [];
        this.folders = [];
        if(fullCListArr.length > 0){

          let folderBase = this.q.os.channel.getParticipantFolders(channel);
          this.folders = [];
          if(folderBase.length > 0){
            for(let i=0;i<folderBase.length;i++){
              for(let i2=0;i2<folderBase[i]['participants'].length;i2++){

                if(typeof folderBase[i]['participants'][i2]['nick'] != 'undefined' &&  folderBase[i]['participants'][i2]['nick'] != ""){
                    folderBase[i]['participants'][i2]['name'] = folderBase[i]['participants'][i2]['nick'];
                }
                else{
                    let p;
                    try{
                      console.log('ChannelParticipantList: Getting Profile For Foldered Participant...');
                      p = await this.q.os.social.profile.getByChannelPubKey(folderBase[i]['participants'][i2]['pubKey']);
                    }catch(e){console.log(e)}
                    if(typeof p != 'undefined' && typeof p['alias'] != 'undefined'){

                      let isFavorite = false;
                      let isRequestedFavorite = false;
                      if(channel.indexOf('qprivatedch') > -1 && this.q.os.social.profile.isRequestedFavorite(p['key']['pubKey'])){
                        this.q.os.social.profile.addFavorite(p['key']['pubKey']);
                        isFavorite = true;
                        this.q.os.social.profile.removeFavoriteRequest(p['key']['pubKey']);
                      }
                      else if(this.q.os.social.profile.isRequestedFavorite(p['key']['pubKey'])){
                        // send invitation over the wire
                        let channel = this.q.os.social.profile.getRequestedFavoriteChannel(p['key']['pubKey']);
                        let reqObj = { invite:  this.q.os.channel.invite.create(channel,1), pubKey: await this.q.os.social.profile.getMyProfileId(), channel: channel};
                        let pubObj = { message: reqObj, toChannelPubKey: folderBase[i]['participants'][i2]['pubKey']};
                        if(this.isOnline(pubObj['toChannelPubKey'])){
                          this.q.os.channel.publish(this.channel,pubObj,'REQUEST_FAVORITE');
                        }
                        isRequestedFavorite = true;
                      }

                      folderBase[i]['participants'][i2]['name'] = p['alias'];
                      folderBase[i]['participants'][i2]['isFavorite'] = isFavorite;
                      folderBase[i]['participants'][i2]['isRequestedFavorite'] = isRequestedFavorite;
                    }
                }

                fullCListArr = fullCListArr.filter(e => e != folderBase[i]['participants'][i2]['pubKey']);
              }
            }
            this.folders = folderBase;
          }


        }

        let participantsPrototype = [];
        this.dev &&   console.log(fullCListArr);
        for(let i=0;i<fullCListArr.length;i++){

          let p;
          try{
          this.dev &&  console.log('ChannelParticipantList: Getting Profile For Unfoldered Participant...');
            p = await this.q.os.social.profile.getByChannelPubKey(fullCListArr[i]);
          this.dev &&  console.log(fullCListArr[i],p);
          }catch(e){console.log(e)}
        this.dev &&  console.log(p);
          if(typeof p != 'undefined' && typeof p['alias'] != 'undefined'){
            let isFavorite = false;
            let isRequestedFavorite = false;
            if(channel.indexOf('qprivatedch') > -1 && this.q.os.social.profile.isRequestedFavorite(p['key']['pubKey'])){
              this.q.os.social.profile.addFavorite(p['key']['pubKey']);
              isFavorite = true;
              this.q.os.social.profile.removeFavoriteRequest(p['key']['pubKey']);
            }
            else if(this.q.os.social.profile.isRequestedFavorite(p['key']['pubKey'])){
              //send invitation over the wire
              let channel = this.q.os.social.profile.getRequestedFavoriteChannel(p['key']['pubKey']);
              let reqObj = { invite:  this.q.os.channel.invite.create(channel,1), pubKey:  await this.q.os.social.profile.getMyProfileId(), channel: channel};
              if(this.isOnline(fullCListArr[i])){
                this.q.os.channel.publish(this.channel,{ message: reqObj, toChannelPubKey: fullCListArr[i] },'REQUEST_FAVORITE');
              }
              isRequestedFavorite = true;
            }
            participantsPrototype.push({ pubKey:fullCListArr[i], name: p['alias'], isFavorite: isFavorite,isRequestedFavorite: isRequestedFavorite });
          }
          else{
            participantsPrototype.push({ pubKey:fullCListArr[i], name: "Anonymous" });
          }

        }

        //see if others existsh
        let othersExist = false;
        for(let i=0;i<this.folders.length;i++){
          if(this.folders[i]['id'] == 'others'){
            this.folders[i]['participants'] = this.folders[i]['participants'].concat(participantsPrototype);
            othersExist = true;
          }
        }

        if(!othersExist){
          this.folders.push({ id: "others", name: "Crowd", participants: participantsPrototype });
        }

        this.folders = this.sortFoldersByName(this.folders);

        // let signedSocialObj;

        //check if social is public


        for (let folder of this.folders) {
          this.connectedTo.push(folder.id);
        };

        let time = new Date().getTime();
        let diff = 1000*60*3;
        time = time-diff;

        if(await this.q.os.social.profile.isPublic() && (typeof this.sharedPublicSocialTimestamp == 'undefined' || this.sharedPublicSocialTimestamp < time) ){
            let haveToGive = false;
            console.log('CPL: Checking who doesnt have my Social Profile...');
            for(let cPubKey of fullCListArrCopy){
              if(!await this.q.os.social.profile.hasMySocial(cPubKey) && this.isOnline(cPubKey)){
                haveToGive = true;
              }
            }
            if(haveToGive){
              console.log('CPL: Sharing Social Profile...');
              let socialObj = await this.q.os.social.profile.getMyProfile();
              let privKey =  socialObj['key']['privKey'];
              let safeSocialObj = { alias: socialObj['alias'], fullName: socialObj['fullName'], about: socialObj['about'], private: socialObj['private'], key: { pubKey: socialObj['key']['pubKey'] }  };

              let timeline = {};
              try{
                timeline = await this.q.os.social.timeline.getLatestRef(socialObj['key']['pubKey']);
              }catch(e){console.log(e)}

              if(typeof timeline['qHash'] != 'undefined' && typeof timeline['whistle'] != 'undefined' ){
                safeSocialObj['timeline'] = timeline;
              }

              // delete socialObj['key']['privKey'];
              console.log('SHARING');
              this.dev && console.log(privKey);
              let signedSafeSocialObj = await this.q.os.crypto.ec.sign(safeSocialObj,privKey);
              let pubObj = { message: signedSafeSocialObj };
            this.dev &&   console.log('qD Messages ChannelParticipantList: Publishing...',JSON.parse(JSON.stringify(pubObj)));
              this.q.os.channel.publish(this.channel, pubObj,'SHARE_PUBLIC_SOCIAL');
              this.sharedPublicSocialTimestamp = new Date().getTime();

            }
        }


      }
      catch(e){console.log(e)}
    }

    this.cd.detectChanges();


    return true;

  }
  dev = false;

  sharedPublicSocialTimestamp;

  async ngOnInit() {

    while(!this.q.isReady() || !this.q.os.isSignedIn()){
      await this.ui.delay(1000);
    }

    this.selectedChannelSub = this.q.os.channel.onSelect().subscribe( (value) => {
      console.log('ChannelParticipantList: changed channel');
      this.initProcess();

      this.channel = value;
      console.log('App: Selected Channel: >>'+this.channel+'<<');
      console.log('App: noChannelSelected: >>'+this.noChannelSelected+"<<")
    });



    this.uiCheck = setInterval( () =>{
      this.initProcess();
    },20000);

    await this.initProcess();


  }

  noChannelSelected = "NoChannelSelected";





}
