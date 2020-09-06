import { Component, OnInit, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
import { NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { ConfigService } from '../services/config.service';
import { QuestPubSubService } from '../services/quest-pubsub.service';
import { NbMenuService,NbDialogService } from '@nebular/theme';
import { UiService} from '../services/ui.service';

import { filter, map } from 'rxjs/operators';

import { v4 as uuidv4 } from 'uuid';


interface FSEntry {
  name: string;
  kind: string;
  items?: number;
}


@Component({
  selector: 'app-channel-list',
  templateUrl: './channel-list.component.html',
  styleUrls: ['./channel-list.component.scss']
})
export class ChannelListComponent implements OnInit {

  channelNameList = [];
  constructor(private ui: UiService,private dialog:NbDialogService,private nbMenuService: NbMenuService,private config: ConfigService, private pubsub: QuestPubSubService, private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>) {

      let data = this.config.getChannelFolderList();
      this.dataSource = this.dataSourceBuilder.create(data);
    }


    selectChannel(channelName){
        console.log("ChannelList: Trying to select: >>"+channelName.trim());
        this.DEVMODE && console.log("ChannelList: ChannelNameList: ",this.pubsub.getChannelNameList());
        this.DEVMODE && console.log("isInArray: "+this.pubsub.isInArray(channelName.trim(),this.pubsub.getChannelNameList()));
        if(this.pubsub.isInArray(channelName.trim(),this.pubsub.getChannelNameList())){
          console.log('ChannelList: Selecting: ',channelName.trim());
          this.pubsub.selectChannel(channelName.trim());
        }
    }

    DEVMODE = true;
  customColumn = 'name';
    defaultColumns = [  'items' ];
    allColumns = [ this.customColumn, ...this.defaultColumns ];

    dataSource: NbTreeGridDataSource<FSEntry>;

    sortColumn: string;
    sortDirection: NbSortDirection = NbSortDirection.NONE;

    updateSort(sortRequest: NbSortRequest): void {
      this.sortColumn = sortRequest.column;
      this.sortDirection = sortRequest.direction;
    }

    getSortDirection(column: string): NbSortDirection {
      if (this.sortColumn === column) {
        return this.sortDirection;
      }
      return NbSortDirection.NONE;
    }



    getShowOn(index: number) {
      const minWithForMultipleColumns = 400;
      const nextColumnStep = 100;
      return minWithForMultipleColumns + (nextColumnStep * index);
    }


    items = [
        { title: 'Create Channel' },
        { title: 'Import Channel' },
        { title: 'New Folder' },
      ];


  ngOnInit(): void {
    this.channelNameList = this.pubsub.getChannelNameList();
      this.config.channelFolderListSub.subscribe( (chFL: []) => {
         this.dataSource = this.dataSourceBuilder.create(chFL);
      });

      this.nbMenuService.onItemClick().subscribe( (menuItem) => {
         if(String(menuItem.item.title) == 'Create Channel'){
            this.getChannelFolderList();
            this.open(this.createPop);
          }
          else if(String(menuItem.item.title) == 'Import Channel'){
              this.getChannelFolderList();
              this.open(this.importPop);
          }
          else if(String(menuItem.item.title) == 'New Folder'){
              this.getChannelFolderList();
              this.open(this.folderPop);
          }
    });
  }

  ngOnDestroy(){
  //  this.nbMenuService.unsubscribe();
  }




  @ViewChild('create') createPop;
  newChannelName;
  channelFolderList;
  channelFolderListArray = [];
  newChannelFolder;
  getChannelFolderList(){
    this.channelFolderList = this.config.getChannelFolderList();
    this.channelFolderListArray = [];
    this.parseStructure(this.channelFolderList);
    if(this.channelFolderListArray.length > 0){
      this.newChannelFolder = this.channelFolderListArray[0];
    }
    return this.channelFolderList;
  }
  parseStructure(folderStructure){
    for(let i=0;i<folderStructure.length;i++){
      if(folderStructure[i]['data']['name'].indexOf('-----') === -1){
        folderStructure[i]['id'] = uuidv4();
        this.channelFolderListArray.push(folderStructure[i]);
        if(typeof(folderStructure[i]['children']) != 'undefined'){
          this.parseStructure(folderStructure[i]['children']);
        }
      }
    }
    return folderStructure;
  }
  newChannelFolderChanged(){}
  async createNewChannel(event){
    console.log(event);
    let channelNameDirty = event
    //TODO put together folder structure...
    let folders;

    this.ui.showSnack('Creating Channel...','Please Wait',{duration:1000});
    let parentFolderId =  this.newChannelFolder;
    if(typeof parentFolderId === 'object'){
      parentFolderId = "";
    }

    await this.config.createChannel(channelNameDirty, parentFolderId);
    this.createCompleteAndClose();
  }
  popupRef;
  open(dialog: TemplateRef<any>) {
        this.popupRef = this.dialog.open(dialog, { context: 'this is some additional data passed to dialog' });
    }
  closePopup(){
    this.popupRef.close();
  }

  createCompleteAndClose(){
    this.ui.delay(1000);
    this.config.commit();
    this.ui.showSnack('Create Complete!','Please Wait',{duration:1000});
    this.popupRef.close();
  }


  @ViewChild('folder') folderPop;
  newFolderName;
  createNewFolder(folderNameDirty){
    this.ui.showSnack('Creating Folder...','Please Wait',{duration:1000});
    let parentFolderId =  this.newChannelFolder;
    if(typeof parentFolderId === 'object'){
      parentFolderId = "";
    }
    this.config.createFolder(folderNameDirty, parentFolderId);
    this.createCompleteAndClose();
  }

  @ViewChild('import') importPop;
  importFolderStructure = 1;
  inviteCodeHex;
  importChannelFolderChanged(){}
  async importNewChannel(){

    //TODO put together folder structure...
    this.ui.showSnack('Importing Channel...','Please Wait',{duration:1000});


    let link = Buffer.from(this.inviteCodeHex,'hex').toString('utf8');
    let channelName;
    let inviteToken;

    let folders = link.split("/");
    if(folders.length > 0){
      channelName = folders[folders.length-1].split(':')[0];
      inviteToken =  folders[folders.length-1].split(':')[1];
      folders.pop();
    }
    else{
       channelName = link.split(':')[0];
       inviteToken = link.split(':')[1];
    }

    let parentFolderId =  this.newChannelFolder;
    if(typeof parentFolderId === 'object'){
      parentFolderId = "";
    }

    // if(this.config.isInArray(channelName,this.pubsub.getChannelNameList())){
    //   this.ui.showSnack('Channel Exists!','Oops',{duration:1000});
    // }
    // else{
      await this.config.importChannel(channelName,folders,parentFolderId,inviteToken,this.importFolderStructure);
      this.createCompleteAndClose();
    // }

  }




}
