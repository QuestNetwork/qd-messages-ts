import { Component, ViewChild, ElementRef, Inject, AfterContentInit } from '@angular/core';

 import { MatSnackBar } from  '@angular/material/snack-bar';
// import {ipcService} from './ipcService';

import { UiService} from './services/ui.service';
import { IpfsService} from './services/ipfs.service';
import { QuestPubSubService} from './services/quest-pubsub.service';

// import { TicketService} from './services/ticket.service';

//
declare var $: any;

// declare var TransparencyMouseFix: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {


downloadKeyScreen;
processingEncryptionScreen;

// { name: "Quest Network Support", fqn: support-----key-----key-----rep}
  public channels = [];

  uiMode = 'setup';

 //
  private DEVMODE = true;
 //
  @ViewChild('menuTabGroup') menuTabGroup;

  ticketGenerator = false;


  isElectron = false;
noChannelSelected = "NoChannelSelected";
  current_step = "upload";


  public changeToS(flag){
    console.log(flag);
    this.ui.tosAcceptedChanged(flag);
    this.ui.hidePopups();
  }

  selectedChannel = "NoChannelSelected";

  public popupVisible = "0";
  public hidePopups(){
   this.popupVisible = "0";
  }
  //
  public showPopup(name){
    // if(this.isElectron){
    //   let modal = window.open(document.getElementById('clusterPopup').outerHTML);
    //   let clusterPopupHTML = ;
    //   modal.document.write(clusterPopupHTML);
    // }
    // else{
      this.popupVisible = name;
    // }
  }

  public screenLocked = false;


  public jqueryInit(){
    $(function() {
      $( ".downloadEncryptionKeyScreen2" ).animate({
        opacity: 0
  //      left: "+=50",
    //    height: "toggle"
  }, 1);



  $('.initialUploadScreen').css('cursor','default');
  $('.downloadEncryptionContainer').css('pointer-events','none');
    $('.uploadProgressEncryptionContainer').css('pointer-events','none');

      $(document).on('touchstart click mouseenter ', '.downloadEncryptionKeyScreenHover', function(){
        this.DEVMODE && console.log('hover import {  } from "module";!');
        $( ".downloadEncryptionKeyScreen2" ).animate({
         opacity: 1
       }, 333);
      });
      $(document).on('   mouseout', '.downloadEncryptionKeyScreenHover', function(){
        this.DEVMODE && console.log('hover out!');
        $( ".downloadEncryptionKeyScreen2" ).animate({
          opacity: 0
    //      left: "+=50",
      //    height: "toggle"
    }, 555);

      });


      $(document).on('touchstart click mouseenter ', '.uploadProgressEncryptionKeyScreenHover', function(){
        this.DEVMODE && console.log('hover import {  } from "module";!');
        $( ".uploadProgressEncryptionKeyScreen2" ).animate({
         opacity: 1
       }, 333);
      });
      $(document).on('   mouseout', '.uploadProgressEncryptionKeyScreenHover', function(){
        this.DEVMODE && console.log('hover out!');
        $( ".uploadProgressEncryptionKeyScreen2" ).animate({
          opacity: 0
    //      left: "+=50",
      //    height: "toggle"
    }, 555);

      });


      $('.mat-tab-label-active').css('opacity',1);


    //mat menu



      $('.mat-tab-label').on('click', function(){
        $('.mat-tab-label').css('opacity',0.6);
        $('.mat-tab-label-active').css('opacity',1);

      });

    });
  }



//private _sanitizer: DomSanitizer,private ticketService: TicketService, , private ipc: ipcService


   constructor( private pubsub: QuestPubSubService, private ui: UiService, private ipfs: IpfsService,private snackBar: MatSnackBar ){

   }



// RECAPTCHA START


loadScript(url){
  let node = document.createElement('script');
  node.src = url;
  node.type = 'text/javascript';
  node.async = true;
  node.charset = 'utf-8';
  document.getElementsByTagName('head')[0].appendChild(node);
}

public async ngAfterContentInit() {
          // this.loadScript('https://www.google.com/recaptcha/api.js');


}





// RECAPTCHA END


  public async ngOnInit(){

    //gather up all the channels we got put em in this.channels

    var userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.indexOf(' electron/') > -1) {
      this.ui.setElectron(true);
    }
    else{
      $(function(){
          $('body').css('background-color','#91d370');
          $('body').css('background-image','linear-gradient(319deg, #91d370 0%, #bca0ff 37%, #f2cd54 100%)');
        });

    }

    if(this.ui.isElectron()){
      this.ui.changeElectronSize(0);
      this.isElectron = true;
      $(function(){
          $('.container').css('top','0px');
          $('body').addClass('isElectron');
      });
    }


    this.jqueryInit();

    // this.ipc.send('resize', "200px", "400px");

    this.ipfs.start();

    this.ui.snackBar.subscribe( (object) => {
        this.showSnack(object.left, object.right, object.object);
    });

    this.ui.snackBarDismissedSub.subscribe( (value) => {
      this.snackBar.dismiss();
    });

    this.ui.screenLockedSub.subscribe( (value) => {
      this.screenLocked = value;
    });




    this.ui.ticketGeneratorSub.subscribe( (value) => {
      this.ticketGenerator = value;
    });

    this.ui.hidePopupsSub.subscribe( (value) => {
      this.hidePopups();
    });

    this.ui.toTabIndexSub.subscribe( (value) => {
      this.toTabIndex(value);
    });

    this.ui.tabAccessibilitySub.subscribe( (tabAccessibility) => {
      this.tabAccessibility = tabAccessibility;
    });

    this.ui.showPopupSub.subscribe( (v) => {
      this.showPopup(v);
    });



    this.ui.componentAccessibilitySub.subscribe( (componentAccessibility) => {
      this.componentAccessibility = componentAccessibility;
    });

    this.ui.uiModeSub.subscribe( (value) => {
      this.uiMode = value;
    });

    this.pubsub.channelNameListSub.subscribe( (value) => {
      this.ui.showSnack('Channel Update ','Dismiss', {duration:2000});
      this.channelNameList = value;
    });

    this.pubsub.selectedChannelSub.subscribe( (value) => {
      this.selectedChannel = value;
      console.log('App: Selected Channel: >>'+this.selectedChannel+'<<');
      console.log('App: noChannelSelected: >>'+this.noChannelSelected+"<<")
    });

    this.ui.signedInSub.subscribe( (value) => {
      this.signedIn = value;
    });

    this.ipfs.swarmPeersSub.subscribe( (value:number) => {
      this.swarmPeers = value;
    });
    let psPS = this.pubsub.getPubSubPeersSub();
    psPS.subscribe( (value:number) => {
      this.pubSubPeers = value;
    });






  }

  public swarmPeers = 0;
  public pubSubPeers = 0;

  public signedIn;
  public channelNameList;

  public componentAccessibility = {
    processingEncryptionScreen: false, downloadKeyScreen: false
  }

  public tabAccessibility = {
    signInTab: true, settingsTab: true, channelTab:false
  }

  public pushStart(){
    this.ui.pushStart();
  }

  public enableTab(channel){
    this.ui.enableTab(channel+'Tab');
  }


  public disableTab(channel){
    this.ui.disableTab(channel+'Tab');
  }


  snackBarRef;
  showSnack(left, right, options = {}){

    if(Object.keys(options).length > 0){
      console.log('App: Opening snackbar with options');
      this.snackBarRef = this.snackBar.open(left,right,options);
    }else{
      console.log('App: Oopening snackbar');
     this.snackBarRef = this.snackBar.open(left,right);
   }

   return this.snackBarRef;
  }


  closeWindow(){
    window.close();
  }

  public selectedTabChanged(event){
    $(function() {
      $('.mat-tab-label').css('opacity',0.6);
      setTimeout( () => {
        $('.mat-tab-label-active').css('opacity',1);
      }, 500);
    });
      this.ui.changeElectronSize(event.index);
      this.ui.selectedTabChanged(event.index);
  }

  public nextTabIndex(){
    this.menuTabGroup.selectedIndex = this.menuTabGroup.selectedIndex + 1;
     this.ui.changeElectronSize(this.menuTabGroup.selectedIndex+1);
    $(function() {
      $('.mat-tab-label').css('opacity',0.6);
      setTimeout( () => {
        $('.mat-tab-label-active').css('opacity',1);
      }, 500);
    });
  }

  public toTabIndex(index){
    this.menuTabGroup.selectedIndex = index;
    $(function() {
      $('.mat-tab-label').css('opacity',0.6);
      setTimeout( () => {
        $('.mat-tab-label-active').css('opacity',1);
      }, 500);
    });
  }



}
