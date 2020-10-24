import { Component, OnInit } from '@angular/core';
import { UiService} from '../../../qD/src/app/services/ui.service';

@Component({
  selector: 'app-mat-menu',
  templateUrl: './mat-menu.component.html',
  styleUrls: ['./mat-menu.component.scss']
})
export class MatMenuComponent implements OnInit {

  constructor(private ui: UiService) { }

  ngOnInit(): void {

    this.ui.isElectronSub.subscribe( (value) =>{
      this.isElectron = value;
    });

    this.ui.noJobLoadedFlagSub.subscribe( (value) =>{
      this.noJobLoadedFlag = value;
    });


    this.ui.publicKeyFlagSub.subscribe( (value) =>{
      this.publicKeyFlag = value;
    });

  }

  public downloadKey(source = "downloadKey"){
    // this.quest.downloadDraftOrKey(source);
  }

  public noJobLoadedFlag = true;
  public isElectron;
  public publicKeyFlag;



    public newJob(){
      location.reload();
    }

    public newJobWindow(){
      window.open('index.html','newJob');
    }


    //
    // public triggerOpenFileDialog(){
    //
    //   let elem = document.getElementById('openFileButton');
    //    if(elem && document.createEvent) {
    //       var evt = document.createEvent("MouseEvents");
    //       evt.initEvent("click", true, false);
    //       elem.dispatchEvent(evt);
    //    }
    //
    // }


}
