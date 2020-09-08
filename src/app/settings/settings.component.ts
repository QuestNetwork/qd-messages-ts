import { Component, ViewChild, OnInit, ChangeDetectionStrategy} from '@angular/core';
import { UiService} from '../services/ui.service';
import { QuestOSService } from '../services/quest-os.service';

import { NbSidebarService } from '@nebular/theme';
import { NbMenuItem } from '@nebular/theme';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(private ui: UiService, private q: QuestOSService, private sidebarService: NbSidebarService) {}

sideBarFixed = { left:false}

  items: NbMenuItem[] = [
    {
      title: 'General',
      icon: 'browser-outline',

    },
    {
      title: 'AutoSave',
      icon: "save-outline"

    },
    {
      title: 'IPFS',
      icon: "cube-outline"
    },
    {
      title: 'Export',
      icon:'code-download-outline'
    },



  ];

  DEVMODE = true;
  ngOnInit(){}


}
