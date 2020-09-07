import { Component, OnInit } from '@angular/core';
import { NbSidebarService } from '@nebular/theme';
import { ConfigService } from '../services/config.service';
import { QuestPubSubService } from '../services/quest-pubsub.service';

@Component({
  selector: 'app-channel-tab',
  templateUrl: './channel-tab.component.html',
  styleUrls: ['./channel-tab.component.scss']
})
export class ChannelTabComponent implements OnInit {

  constructor( private sidebarService: NbSidebarService,private config: ConfigService, private pubsub: QuestPubSubService) { }
  channelNameList = [];

  ngOnInit(): void {


      this.sideBarFixed = this.config.getSideBarFixed();
      this.sideBarVisible = this.config.getSideBarVisible();
      console.log('toggling:',this.sideBarVisible);
      if(!this.sideBarVisible['left']){
        this.sidebarService.collapse('left');
      }
      else if(this.sideBarVisible['left']){
        this.sidebarService.expand('left');
      }
      if(!this.sideBarVisible['right']){
        this.sidebarService.collapse('right');
      }
      if(this.sideBarVisible['right']){
        this.sidebarService.expand('right');
      }

      setTimeout( () => {
            this.sideBarFixed = this.config.getSideBarFixed();
            this.sideBarVisible = this.config.getSideBarVisible();
            console.log('toggling:',this.sideBarVisible);
            if(!this.sideBarVisible['left']){
              this.sidebarService.collapse('left');
            }
            else if(this.sideBarVisible['left']){
              this.sidebarService.expand('left');
            }
            if(!this.sideBarVisible['right']){
              this.sidebarService.collapse('right');
            }
            if(this.sideBarVisible['right']){
              this.sidebarService.expand('right');
            }
      },100);

      this.config.sideBarFixedSub.subscribe( (sideBarFixed) => {
        this.sideBarFixed = this.config.getSideBarFixed();
      });

      this.config.sideBarVisibleSub.subscribe( (sideBarVisible) => {
        console.log('getting',sideBarVisible);
        this.sideBarVisible = this.config.getSideBarVisible();
        if(!this.sideBarVisible['left']){
          this.sidebarService.collapse('left');
        }
        else if(this.sideBarVisible['left']){
          this.sidebarService.expand('left');
        }
        if(!this.sideBarVisible['right']){
          this.sidebarService.collapse('right');
        }
        if(this.sideBarVisible['right']){
          this.sidebarService.expand('right');
        }
    });

      this.channelNameList = this.pubsub.getChannelNameList();
        this.config.channelFolderListSub.subscribe( (chFL: []) => {
          this.channelNameList = this.pubsub.getChannelNameList();
        });


      this.pubsub.selectedChannelSub.subscribe( (value) => {
        this.selectedChannel = value;
        console.log('Channel-Tab: Selected Channel: >>'+this.selectedChannel+'<<');
        console.log('Channel-Tab: noChannelSelected: >>'+this.noChannelSelected+"<<")
      });


    }

    selectedChannel = "NoChannelSelected";
    noChannelSelected = "NoChannelSelected";


    sideBarFixed = { right: true, left: true };
    sideBarVisible = { right: false, left: true };


     lockSideBar(side,value){
       this.sideBarFixed[side] = value;
       this.config.setSideBarFixed(this.sideBarFixed);
       this.config.commitNow();
     }

      toggleSideBar(side) {
        this.sideBarVisible = this.config.getSideBarVisible();
        if( this.sideBarVisible[side] == true ){
          this.sideBarVisible[side]  = false;
        }
        else{
          this.sideBarVisible[side]  = true;
        }
        this.config.setSideBarVisible(this.sideBarVisible);
        this.config.commitNow();
      }



}
