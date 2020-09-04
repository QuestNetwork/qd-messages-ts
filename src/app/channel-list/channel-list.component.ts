import { Component, OnInit, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
import { NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { ConfigService } from '../services/config.service';
import { QuestPubSubService } from '../services/quest-pubsub.service';
import { NbMenuService,NbDialogService } from '@nebular/theme';
import { UiService} from '../services/ui.service';

import { filter, map } from 'rxjs/operators';

import { v4 as uuidv4 } from 'uuid';

interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}

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

newChannelName;

  ngOnInit(): void {
    this.channelNameList = this.pubsub.getChannelNameList();
      this.config.channelFolderListSub.subscribe( (chFL: []) => {
         this.dataSource = this.dataSourceBuilder.create(chFL);
      });

      this.nbMenuService.onItemClick().subscribe( (menuItem) => {
         if(String(menuItem.item.title) == 'Create Channel' && !this.createOpen){
            this.getChannelFolderList();
            this.open(this.createPop);
          }
          console.log(menuItem);
    });
  }

  ngOnDestroy(){
  //  this.nbMenuService.unsubscribe();
  }





  @ViewChild('create') createPop;
  createOpen = false;
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
  createNewChannel(){
    this.ui.showSnack('Creating Channel...','Please Wait',{duration:1000});
    this.createRef.close();
  }
 createRef;
  open(dialog: TemplateRef<any>) {
        this.createRef = this.dialog.open(dialog, { context: 'this is some additional data passed to dialog' });
    }
  closeCreate(){
    this.createOpen = false;
    this.createRef.close();
  }





}
