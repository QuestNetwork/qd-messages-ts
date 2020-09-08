import { Component, ViewChild, OnInit, ChangeDetectionStrategy} from '@angular/core';
import { UiService} from '../services/ui.service';
import { ConfigService } from '../services/config.service';
import { QuestOSService } from '../services/quest-os.service';

import { NbSidebarService } from '@nebular/theme';
import { NbMenuItem } from '@nebular/theme';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(private config: ConfigService, private ui: UiService, private q: QuestOSService, private sidebarService: NbSidebarService) {}

sideBarFixed = { left:false}

  items: NbMenuItem[] = [
    {
      title: 'Profile',
      expanded: true,
      children: [
        {
          title: 'Profile Settings',
        },
        {
          title: 'Export Settings',
        },
      ],
    },
    {
      title: 'IPFS',
      children: [
        {
          title: 'Bootstrap',
        },
        {
          title: 'Settings',
        }
      ],
    },
    {
      title: 'Sign Out'
    }

  ];

  DEVMODE = true;
  ngOnInit(){}


}
