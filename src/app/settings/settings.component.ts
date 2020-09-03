import { Component, ViewChild, OnInit, ChangeDetectionStrategy} from '@angular/core';
import { UiService} from '../services/ui.service';
import { ConfigService } from '../services/config.service';
import { QuestPubSubService } from '../services/quest-pubsub.service';

import { NbSidebarService } from '@nebular/theme';
import { NbMenuItem } from '@nebular/theme';


declare var $: any;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(private config: ConfigService, private ui: UiService, private pubsub: QuestPubSubService, private sidebarService: NbSidebarService) {}

sideBarFixed = { left:false}

  items: NbMenuItem[] = [
    {
      title: 'Profile',
      expanded: true,
      children: [
        {
          title: 'Change Password',
        },
        {
          title: 'Privacy Policy',
        },
        {
          title: 'Logout',
        },
      ],
    },
    {
      title: 'Shopping Bag',
      children: [
        {
          title: 'First Product',
        },
        {
          title: 'Second Product',
        },
        {
          title: 'Third Product',
        },
      ],
    },
    {
      title: 'Orders',
      children: [
        {
          title: 'First Order',
        },
        {
          title: 'Second Order',
        },
        {
          title: 'Third Order',
        },
      ],
    },
  ];

  DEVMODE = true;
  ngOnInit(){}


}
