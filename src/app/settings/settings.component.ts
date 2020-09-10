import { Component, ViewChild, OnInit, ChangeDetectionStrategy} from '@angular/core';
import { UiService} from '../services/ui.service';
import { QuestOSService } from '../services/quest-os.service';

import { NbSidebarService } from '@nebular/theme';
import { NbMenuItem } from '@nebular/theme';
import { NbMenuService } from '@nebular/theme';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(private menu: NbMenuService, private ui: UiService, private q: QuestOSService, private sidebarService: NbSidebarService) {}
  // @ViewChild('driveLockStatusField') driveLockStatusField;
sideBarFixed = { left:false}
autoSaveInterval = 30*10000;
  items: NbMenuItem[] = [
    {
      title: 'General',
      icon: 'browser-outline',

    },
    {
      title: 'IPFS',
      icon: "cube-outline"
    }

  ];

  DEVMODE = true;
  ngOnInit(){
    this.menu.onItemClick().subscribe((e) => {
      if(e['item']['title'] == 'Export'){
          this.q.os.exportConfig();
      }
      else if(e['item']['title'] == 'Sign Out'){
        this.q.os.signOut();
      }
      else if(typeof e['item']['title'] != 'undefined'){
        this.selectedSetting = e['item']['title'];
      }
    });

    if(this.q.os.isSignedIn()){
      this.signIn();
    }
    this.q.os.onSignIn().subscribe( () => {
      this.signIn();
    });
    this.ipfsOnline = this.q.os.isReady();
    this.q.os.onReady().subscribe( () => {
      console.log('OS Ready');
      this.ipfsOnline = true;
    });

    this.q.os.onSignIn().subscribe( () => {
      this.autoSaveActive = this.q.os.getAutoSave();
      this.autoSaveInterval = this.q.os.getAutoSaveInterval();

    });


  }
  ipfsOnline = false;
  autoSaveIntervalChanged(v){
     this.q.os.setAutoSaveInterval(v);
  }
  selectedSetting = "General";
  signIn(){
    this.items.push({
      title: 'Export',
      icon:'code-download-outline'
    });
    this.items.push({
      title: 'Sign Out',
      icon:'person-remove-outline'
    });
  }

  saveLockActive = true;
  saveLockActiveToggled(){
    let oldSaveLockStatus = this.q.os.getSaveLock();
    if(oldSaveLockStatus){
      this.q.os.disableSaveLock();
    }
    else{
      this.q.os.enableSaveLock();
    }
  }


  autoSaveActive = true;

  getAutoSave(){
    return this.q.os.getAutoSave();
  }
  autoSaveActiveToggled(){
    if(!this.q.os.getAutoSave()){
      this.q.os.enableAutoSave();
    }
    else{
      this.q.os.disableAutoSave();
    }
  }


}
