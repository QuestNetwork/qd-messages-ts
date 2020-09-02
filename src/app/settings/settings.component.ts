import { Component, ViewChild, OnInit } from '@angular/core';
import { UiService} from '../services/ui.service';
// import { TicketService} from '../services/ticket.service';
// import { QuestService} from '../services/quest.service';
// import { TicketObject } from '../services/ticket.interface';

// import { QuestSettingsService} from '../services/quest-settings.service';
declare var $: any;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(){}

  // private quest:QuestService, private ui: UiService, private qSettings: QuestSettingsService, private ticket: TicketService, private reCaptcha: CaptchaService) { }

  //
  // public showPopup(name){
  //   this.ui.showPopup(name);
  // }
  //
  // public DEVMODE = true;
  //
  ngOnInit(): void {}
  //
  //     this.ui.enteringCodeSub.subscribe( (value) => {
  //       this.enteringCode = value;
  //     });
  //
  //
  //     this.ui.toSectionSub.subscribe( (value) => {
  //       if(value == 'bake' || value == 'render' || value == 'performance'){
  //         this.initPerformanceScreen();
  //       }
  //     });
  //
  //     this.ui.initPerformanceScreenSub.subscribe( (value) => {
  //         this.initPerformanceScreen();
  //     });
  //
  //     this.initPerformanceScreen();
  //
  //     this.ui.scrapeQuestSettingsSub.subscribe( (value) => {
  //       this.qSettings.set(this.questSettings);
  //     });
  //
  //
  //     this.ui.ticketButtonWrapperShowingSub.subscribe( (value) => {
  //       this.ticketButtonWrapperShowing = value;
  //     });
  //
  //     this.ui.tosAcceptedChangedSub.subscribe( (value) => {
  //       this.tosAcceptedChanged(value);
  //     });
  //
  //     this.ui.pushStartSub.subscribe( (value) => {
  //       this.pushStart();
  //     });
  //
  //
  //
  // }
  //
  //   public isProcessing;
  //
  //   public tosAccepted = false;
  //   public tosAcceptedChanged(flag){
  //     // console.log(flag);
  //     this.tosAccepted = flag
  //   }
  //
  //
  //
  // public initPerformanceScreen(){
  //   this.DEVMODE && console.log('initializing performance screen...');
  //   this.questSettings = this.qSettings.get();
  //   this.qHash = this.quest.getQHash();
  //   this.ticketObject = this.ticket.get();
  // }
  //



}
