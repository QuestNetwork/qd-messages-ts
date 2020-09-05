import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { GlobalPubSub as QuestPubSub }  from '@questnetwork/quest-pubsub-js';
import { IpfsService }  from './ipfs.service';
import { UiService }  from './ui.service';


@Injectable({
  providedIn: 'root'
})
export class QuestPubSubService {

  constructor(private ipfs:IpfsService, private ui: UiService) {
    QuestPubSub.commitNowSub.subscribe( (value) => {
      this.commitNowSub.next(value);
    });
  }

  commitNowSub = new Subject();


    isInArray(value, array) {
     return array.indexOf(value) > -1;
   }


   selectedChannel;
   selectedChannelSub = new Subject<any>();
   public selectChannel(value){
     this.selectedChannel = value;
     this.selectedChannelSub.next(value);
   }
   public getSelectedChannel(){
     return this.selectedChannel;
   }

    listen(channel){
        return QuestPubSub.subs[channel];
    }

    async createChannel(channelInput){
        //generate keypair and register channel
        let channelName = await QuestPubSub.createChannel(channelInput);
        this.getChannelKeyChain(channelName);
        this.getChannelParticipantList(channelName);
        return channelName;
    }

    getChannelParticipantList(channel = "all"){
      let pl = QuestPubSub.getChannelParticipantList(channel);
      this.setChannelParticipantList(pl, channel);
      return pl;
    }
    setChannelParticipantList(partList, channel = "all"){
      return QuestPubSub.setChannelParticipantList(partList, channel);
    }

    channelNameListSub = new Subject();
    getChannelNameList(){
      return QuestPubSub.getChannelNameList();
    }
    setChannelNameList(list){
      this.channelNameListSub.next(list);
      QuestPubSub.setChannelNameList(list);
    }



    public setChannelKeyChain(channelKeyChain, channel = "all"){
      return QuestPubSub.setChannelKeyChain(channelKeyChain, channel);
    }
    getChannelKeyChain(channel = 'all'){
      let kc = QuestPubSub.getChannelKeyChain(channel);
      this.setChannelKeyChain(kc, channel);
      return kc;
    }

    getIpfsId(){
      return QuestPubSub.getIpfsId();
    }
    setIpfsId(id){
      return QuestPubSub.setIpfsId(id);
    }

    getPubSubPeersSub(){
      return QuestPubSub.pubSubPeersSub;
    }

    async joinChannelProcess(channel){
       //TODO: we can retry and all that
    await QuestPubSub.joinChannel(this.ipfs.ipfsNode.pubsub,channel);
    }

    async completedChallenge(channel, code){
      let ownerChannelPubKey = QuestPubSub.getOwnerChannelPubKey(channel);
      let pubObj = {
        channel: channel,
        type: 'CHALLENGE_RESPONSE',
        toChannelPubKey: ownerChannelPubKey,
        response: { code: code }
      }
      QuestPubSub.publish(this.ipfs.ipfsNode.pubsub,pubObj);
    }




    async joinChannel(channel){
      try {
        if(this.ipfs.isReady()){
            return await this.joinChannelProcess(channel);
        }
        else{
          console.log('Waiting for ipfsNodeReadySub...');
          this.ipfs.ipfsNodeReadySub.subscribe(async () => {
            return await this.joinChannelProcess(channel);
          });
        }
      }
      catch(error){
        console.log(error);
      }
    }

    async publishChannelMessage(channel, message){
      let pubObj = { channel: channel, type: 'CHANNEL_MESSAGE',message }
      QuestPubSub.publish(this.ipfs.ipfsNode.pubsub,pubObj);
    }

    getChannelHistory(channel){
      return QuestPubSub.getChannelHistory(channel);
    }

isSubscribed(channel){
  return QuestPubSub.isSubscribed(channel);
}

isOwner(channel,key){
  return QuestPubSub.isOwner(channel,key);
}




}
