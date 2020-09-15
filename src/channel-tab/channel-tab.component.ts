import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { NbSidebarService } from '@nebular/theme';
import { UiService } from '../../../qDesk/src/app/services/ui.service';
import { QuestOSService } from '../../../qDesk/src/app/services/quest-os.service';

@Component({
  selector: 'app-channel-tab',
  templateUrl: './channel-tab.component.html',
  styleUrls: ['./channel-tab.component.scss']
})
export class ChannelTabComponent implements OnInit {

  constructor( private cd: ChangeDetectorRef, private ui: UiService, private sidebarService: NbSidebarService, private q: QuestOSService) { }
  channelNameList = [];

  ngOnDestroy(){
    this.sideBarFixedSub.unsubscribe();
    this.sideBarVisibleSub.unsubscribe();

    this.channelFolderListSub.unsubscribe();
    this.selectedChannelSub.unsubscribe();
  }

  sideBarFixedSub;
  channelFolderListSub;
  selectedChannelSub;
sideBarVisibleSub;
  async ngOnInit() {

    while(!this.q.isReady() || !this.q.os.isSignedIn()){
      await this.ui.delay(1000);
    }



      this.sideBarFixed = this.q.os.bee.config.getSideBarFixed();
      this.sideBarVisible = this.q.os.bee.config.getSideBarVisible();
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

      this.sideBarFixedSub = this.q.os.bee.config.sideBarFixedSub.subscribe( (sideBarFixed) => {
        this.sideBarFixed = this.q.os.bee.config.getSideBarFixed();
      });

      this.sideBarVisibleSub = this.q.os.bee.config.sideBarVisibleSub.subscribe( (sideBarVisible) => {
        console.log('getting',sideBarVisible);
        this.sideBarVisible = this.q.os.bee.config.getSideBarVisible();
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



      setTimeout( () => {
            this.sideBarFixed = this.q.os.bee.config.getSideBarFixed();
            this.sideBarVisible = this.q.os.bee.config.getSideBarVisible();
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


            this.channelNameList = this.q.os.ocean.dolphin.getChannelNameList();
            this.selectedChannel = this.q.os.channel.getSelected();

      },100);




      this.channelFolderListSub = this.q.os.bee.config.channelFolderListSub.subscribe( (chFL: []) => {
          this.channelNameList = this.q.os.ocean.dolphin.getChannelNameList();
        });


      this.selectedChannelSub = this.q.os.channel.onSelect().subscribe( (value) => {
        this.selectedChannel = value;
        console.log('Channel-Tab: Selected Channel: >>'+this.selectedChannel+'<<');
        console.log('Channel-Tab: noChannelSelected: >>'+this.noChannelSelected+"<<");
        this.cd.detectChanges();
      });


    }
    selectedChannel = "NoChannelSelected";
    noChannelSelected = "NoChannelSelected";



    sideBarFixed = { right: true, left: true };
    sideBarVisible = { right: false, left: true };


     lockSideBar(side,value){
       this.sideBarFixed[side] = value;
       this.q.os.bee.config.setSideBarFixed(this.sideBarFixed);
       this.q.os.bee.config.commitNow();
     }

      toggleSideBar(side) {
        this.sideBarVisible = this.q.os.bee.config.getSideBarVisible();
        if( this.sideBarVisible[side] == true ){
          this.sideBarVisible[side]  = false;
        }
        else{
          this.sideBarVisible[side]  = true;
        }
        this.q.os.bee.config.setSideBarVisible(this.sideBarVisible);
        this.q.os.bee.config.commitNow();
      }



}
