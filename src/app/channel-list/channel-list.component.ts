import { Component, OnInit } from '@angular/core';
import { NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { ConfigService } from '../services/config.service';
import { QuestPubSubService } from '../services/quest-pubsub.service';


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

    selectChannel(channelName){
        console.log("trying to select: ",channelName);
        if(this.pubsub.isInArray(channelName,this.pubsub.getChannelNameList())){
          console.log('selecting: ',channelName);
          this.pubsub.selectChannel(channelName);
        }
    }

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


  constructor(private config: ConfigService, private pubsub: QuestPubSubService, private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>) {

    let data = this.config.getChannelFolderList();
    this.dataSource = this.dataSourceBuilder.create(data);
  }

  ngOnInit(): void {
    this.channelNameList = this.pubsub.getChannelNameList();
    // setTimeout( () => {
      this.config.channelFolderListSub.subscribe( (chFL: []) => {
         this.dataSource = this.dataSourceBuilder.create(chFL);
      });
    // },2500);
  }

}
