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
    this.q.os.saveLockStatus().subscribe( (status) => {
      this.saveLockActive = status;
    });
    // console.log(this.driveLockStatusField);

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

  enableSaveLock(){
    this.q.os.enableSaveLock();
  }
  disableSaveLock(){
    this.q.os.disableSaveLock();
  }
  saveLockActive = false;
  getSaveLock(){
    return this.q.os.getSaveLock();
  }

  saveLockActiveToggled(){
    if(this.getSaveLock()){
      this.disableSaveLock();
    }
    else{
      this.q.os.enableSaveLock();
    }
  }



}
