import { Component, OnInit, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
import { NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { QuestOSService } from '../services/quest-os.service';
import { NbMenuService,NbDialogService } from '@nebular/theme';
import { UiService} from '../services/ui.service';

import { filter, map } from 'rxjs/operators';

import { v4 as uuidv4 } from 'uuid';
import swarmJson from '../swarm.json';


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
  constructor(private ui: UiService,private dialog:NbDialogService,private nbMenuService: NbMenuService, private q: QuestOSService, private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>) {

      let data = this.q.os.bee.config.getChannelFolderList();
      this.dataSource = this.dataSourceBuilder.create(data);
    }


    selectChannel(channelName){
        console.log("ChannelList: Trying to select: >>"+channelName.trim());
        this.DEVMODE && console.log("ChannelList: ChannelNameList: ",this.q.os.ocean.dolphin.getChannelNameList());
        this.DEVMODE && console.log("isInArray: "+this.q.os.ocean.dolphin.isInArray(channelName.trim(),this.q.os.ocean.dolphin.getChannelNameList()));
        if(this.q.os.ocean.dolphin.isInArray(channelName.trim(),this.q.os.ocean.dolphin.getChannelNameList())){
          console.log('ChannelList: Selecting: ',channelName.trim());
          this.q.os.ocean.dolphin.selectChannel(channelName.trim());
        }
    }

    DEVMODE = swarmJson['dev'];
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


  async ngOnInit() {

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

    while(!this.q.isReady()){
      await this.ui.delay(1000);
    }

    this.channelNameList = this.q.os.ocean.dolphin.getChannelNameList();
      this.q.os.bee.config.channelFolderListSub.subscribe( (chFL: []) => {
         this.dataSource = this.dataSourceBuilder.create(chFL);
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
    this.channelFolderList = this.q.os.bee.config.getChannelFolderList();
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

    this.ui.showSnack('Creating Channel...','Please Wait');
    let parentFolderId =  this.newChannelFolder;
    if(typeof parentFolderId === 'object'){
      parentFolderId = "";
    }

    await this.q.os.createChannel(channelNameDirty, parentFolderId);
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
    this.q.os.bee.config.commit();
    this.ui.showSnack('Create Complete!','Please Wait',{duration:1000});
    this.popupRef.close();
  }


  @ViewChild('folder') folderPop;
  newFolderName;
  createNewFolder(folderNameDirty){
    this.ui.showSnack('Creating Folder...','Please Wait');
    let parentFolderId =  this.newChannelFolder;
    if(typeof parentFolderId === 'object'){
      parentFolderId = "";
    }
    this.q.os.bee.config.createFolder(folderNameDirty, parentFolderId);
    this.createCompleteAndClose();
  }

  @ViewChild('import') importPop;
  importFolderStructure = 1;
  inviteCodeHex;
  importChannelFolderChanged(){}
  async importNewChannel(){

    //TODO put together folder structure...
    this.ui.showSnack('Importing Channel...','Please Wait');


    let link = Buffer.from(this.inviteCodeHex,'hex').toString('utf8');
    let channelName;
    let inviteToken;

    let folders = link.split("/////");
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
    if(typeof parentFolderId === 'object' || typeof parentFolderId == 'undefined' || typeof parentFolderId == null){
      parentFolderId = "";
    }

    if(this.q.os.bee.config.isInArray(channelName,this.q.os.ocean.dolphin.getChannelNameList())){
      this.ui.showSnack('Channel Exists!','Oops',{duration:1000});
    }
    else{
      await this.q.os.importChannel(channelName,folders,parentFolderId,inviteToken,this.importFolderStructure);
      this.createCompleteAndClose();
    }

  }




}
