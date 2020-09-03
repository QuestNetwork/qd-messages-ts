import { Component, OnInit } from '@angular/core';
import { NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { ConfigService } from '../services/config.service';
import { QuestPubSubService } from '../services/quest-pubsub.service';
import { NbMenuService } from '@nebular/theme';
import { filter, map } from 'rxjs/operators';


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
  constructor(private nbMenuService: NbMenuService,private config: ConfigService, private pubsub: QuestPubSubService, private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>) {

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
    // setTimeout( () => {
      this.config.channelFolderListSub.subscribe( (chFL: []) => {
         this.dataSource = this.dataSourceBuilder.create(chFL);
      });


      this.nbMenuService.onItemClick()
     .pipe(
       filter(({ tag }) => tag === 'my-context-menu'),
       map(({ item: { title } }) => title),
     )
     .subscribe(title => console.log(`${title} was clicked!`));
    // },2500);
  }


  open(dialog){

  }
  clode(){
    
  }
}
