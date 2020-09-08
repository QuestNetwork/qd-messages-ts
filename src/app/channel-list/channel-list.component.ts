import { Component, Injectable,OnInit, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
import { QuestOSService } from '../services/quest-os.service';
import { NbMenuService,NbDialogService } from '@nebular/theme';
import { UiService} from '../services/ui.service';

import { filter, map } from 'rxjs/operators';

import { v4 as uuidv4 } from 'uuid';
import swarmJson from '../swarm.json';



import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {BehaviorSubject, Observable, of as observableOf} from 'rxjs';
import {CdkDragDrop} from '@angular/cdk/drag-drop';



interface FSEntry {
  name: string;
  kind: string;
  items?: number;
}




  /**
   * File node data with nested structure.
   * Each node has a filename, and a type or a list of children.
   */
  export class FileNode {
    id: string;
    children: FileNode[];
    filename: string;
    type: any;
  }

  /** Flat node with expandable and level information */
  export class FileFlatNode {
    constructor(
      public expandable: boolean,
      public filename: string,
      public level: number,
      public type: any,
      public id: string
    ) {}
  }



    /**
     * The file structure tree data in string. The data could be parsed into a Json object
     */
var dataObject =  JSON.parse(JSON.stringify({
  AlaApplications: {
    Calendar: 'app',
    Chrome: 'app',
    Webstorm: 'app'
  },
  Documents: {
    angular: {
      src: {
        compiler: 'ts',
        core: 'ts'
      }
    },
    material2: {
      src: {
        button: 'ts',
        checkbox: 'ts',
        input: 'ts'
      }
    }
  },
  Downloads: {
    October: 'pdf',
    November: 'pdf',
    Tutorial: 'html'
  },
  Pictures: {
    'Photo Booth Library': {
      Contents: 'dir',
      Pictures: 'dir'
    },
    Sun: 'png',
    Woods: 'jpg'
  }
}));

var data;
  @Injectable()
  export class FileDatabase {
    dataChange = new BehaviorSubject<FileNode[]>([]);

    get data(): FileNode[] { return this.dataChange.value; }

    constructor() {
      this.initialize();
    }


    initialize() {
      // Parse the string to json object.

      // Build the tree nodes from Json object. The result is a list of `FileNode` with nested
      //     file node as children.
      data = this.buildFileTree(dataObject, 0);

      // Notify the change.
      this.dataChange.next(data);
    }



    /**
     * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
     * The return value is the list of `FileNode`.
     */
    buildFileTree(obj: {[key: string]: any}, level: number, parentId: string = '0'): FileNode[] {
      return Object.keys(obj).reduce<FileNode[]>((accumulator, key, idx) => {
        const value = obj[key];
        const node = new FileNode();
        node.filename = key;
        /**
         * Make sure your node has an id so we can properly rearrange the tree during drag'n'drop.
         * By passing parentId to buildFileTree, it constructs a path of indexes which make
         * it possible find the exact sub-array that the node was grabbed from when dropped.
         */
        node.id = `${parentId}/${idx}`;

        if (value != null) {
          if (typeof value === 'object') {
            node.children = this.buildFileTree(value, level + 1, node.id);
          } else {
            node.type = value;
          }
        }

        return accumulator.concat(node);
      }, []);
    }
  }

@Component({
  selector: 'app-channel-list',
  templateUrl: './channel-list.component.html',
  styleUrls: ['./channel-list.component.scss'],
  providers: [FileDatabase]

})
export class ChannelListComponent implements OnInit {

  channelNameList = [];
  constructor(private database: FileDatabase,private ui: UiService,private dialog:NbDialogService,private nbMenuService: NbMenuService, private q: QuestOSService) {

      dataObject = JSON.parse(JSON.stringify({
        BlaApplications: {
          Calendar: 'app',
          Chrome: 'app',
          Webstorm: 'app'
        },
        Documents: {
          angular: {
            src: {
              compiler: 'ts',
              core: 'ts'
            }
          },
          material2: {
            src: {
              button: 'ts',
              checkbox: 'ts',
              input: 'ts'
            }
          }
        },
        Downloads: {
          October: 'pdf',
          November: 'pdf',
          Tutorial: 'html'
        },
        Pictures: {
          'Photo Booth Library': {
            Contents: 'dir',
            Pictures: 'dir'
          },
          Sun: 'png',
          Woods: 'jpg'
        }
      }));

      this.database.dataChange.next(dataObject);

      this.treeFlattener = new MatTreeFlattener(this.transformer, this._getLevel,
      this._isExpandable, this._getChildren);
      this.treeControl = new FlatTreeControl<FileFlatNode>(this._getLevel, this._isExpandable);
      this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
      this.database.dataChange.subscribe(data => this.rebuildTreeForData(data));



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
        console.log('ChannelList: Received Folder List...');
        let newData =  this.q.os.bee.config.getChannelFolderList();
        dataObject = this.ui.parseFolderStructureAndFlattenForMatTree(newData);
        //make ui friendly
        this.treeFlattener = new MatTreeFlattener(this.transformer, this._getLevel,
        this._isExpandable, this._getChildren);
        this.treeControl = new FlatTreeControl<FileFlatNode>(this._getLevel, this._isExpandable);
        this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
        this.database.dataChange.subscribe(data => this.rebuildTreeForData(data));
        data = this.database.buildFileTree(dataObject, 0);
        this.database.dataChange.next(data);

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

    treeControl: FlatTreeControl<FileFlatNode>;
    treeFlattener: MatTreeFlattener<FileNode, FileFlatNode>;
    dataSource: MatTreeFlatDataSource<FileNode, FileFlatNode>;
    expandedNodeSet = new Set<string>();
    dragging = false;
    expandTimeout: any;
    expandDelay = 1000;


    transformer = (node: FileNode, level: number) => {
      return new FileFlatNode(!!node.children, node.filename, level, node.type, node.id);
    }
    private _getLevel = (node: FileFlatNode) => node.level;
    private _isExpandable = (node: FileFlatNode) => node.expandable;
    private _getChildren = (node: FileNode): Observable<FileNode[]> => observableOf(node.children);
    hasChild = (_: number, _nodeData: FileFlatNode) => _nodeData.expandable;

    /**
     * This constructs an array of nodes that matches the DOM,
     * and calls rememberExpandedTreeNodes to persist expand state
     */
    visibleNodes(): FileNode[] {
      this.rememberExpandedTreeNodes(this.treeControl, this.expandedNodeSet);
      const result = [];

      function addExpandedChildren(node: FileNode, expanded: Set<string>) {
        result.push(node);
        if (expanded.has(node.id)) {
          node.children.map(child => addExpandedChildren(child, expanded));
        }
      }
      this.dataSource.data.forEach(node => {
        addExpandedChildren(node, this.expandedNodeSet);
      });
      return result;
    }

    /**
     * Handle the drop - here we rearrange the data based on the drop event,
     * then rebuild the tree.
     * */
    drop(event: CdkDragDrop<string[]>) {
      // console.log('origin/destination', event.previousIndex, event.currentIndex);

      // ignore drops outside of the tree
      if (!event.isPointerOverContainer) return;

      // construct a list of visible nodes, this will match the DOM.
      // the cdkDragDrop event.currentIndex jives with visible nodes.
      // it calls rememberExpandedTreeNodes to persist expand state
      const visibleNodes = this.visibleNodes();

      // deep clone the data source so we can mutate it
      const changedData = JSON.parse(JSON.stringify(this.dataSource.data));

      // recursive find function to find siblings of node
      function findNodeSiblings(arr: Array<any>, id: string): Array<any> {
        let result, subResult;
        arr.forEach(item => {
          if (item.id === id) {
            result = arr;
          } else if (item.children) {
            subResult = findNodeSiblings(item.children, id);
            if (subResult) result = subResult;
          }
        });
        return result;
      }

      // remove the node from its old place
      const node = event.item.data;
      const siblings = findNodeSiblings(changedData, node.id);
      const siblingIndex = siblings.findIndex(n => n.id === node.id);
      const nodeToInsert: FileNode = siblings.splice(siblingIndex, 1)[0];

      // determine where to insert the node
      const nodeAtDest = visibleNodes[event.currentIndex];
      if (nodeAtDest.id === nodeToInsert.id) return;

      // determine drop index relative to destination array
      let relativeIndex = event.currentIndex; // default if no parent
      const nodeAtDestFlatNode = this.treeControl.dataNodes.find(n => nodeAtDest.id === n.id);
      const parent = this.getParentNode(nodeAtDestFlatNode);
      if (parent) {
        const parentIndex = visibleNodes.findIndex(n => n.id === parent.id) + 1;
        relativeIndex = event.currentIndex - parentIndex;
      }
      // insert node
      const newSiblings = findNodeSiblings(changedData, nodeAtDest.id);
      if (!newSiblings) return;
      newSiblings.splice(relativeIndex, 0, nodeToInsert);

      // rebuild tree with mutated data
      this.rebuildTreeForData(changedData);
    }

    /**
     * Experimental - opening tree nodes as you drag over them
     */
    dragStart() {
      this.dragging = true;
    }
    dragEnd() {
      this.dragging = false;
    }
    dragHover(node: FileFlatNode) {
      if (this.dragging) {
        clearTimeout(this.expandTimeout);
        this.expandTimeout = setTimeout(() => {
          this.treeControl.expand(node);
        }, this.expandDelay);
      }
    }
    dragHoverEnd() {
      if (this.dragging) {
        clearTimeout(this.expandTimeout);
      }
    }

    /**
     * The following methods are for persisting the tree expand state
     * after being rebuilt
     */

    rebuildTreeForData(data: any) {
      this.rememberExpandedTreeNodes(this.treeControl, this.expandedNodeSet);
      this.dataSource.data = data;
      this.forgetMissingExpandedNodes(this.treeControl, this.expandedNodeSet);
      this.expandNodesById(this.treeControl.dataNodes, Array.from(this.expandedNodeSet));
    }

    private rememberExpandedTreeNodes(
      treeControl: FlatTreeControl<FileFlatNode>,
      expandedNodeSet: Set<string>
    ) {
      if (treeControl.dataNodes) {
        treeControl.dataNodes.forEach((node) => {
          if (treeControl.isExpandable(node) && treeControl.isExpanded(node)) {
            // capture latest expanded state
            expandedNodeSet.add(node.id);
          }
        });
      }
    }

    private forgetMissingExpandedNodes(
      treeControl: FlatTreeControl<FileFlatNode>,
      expandedNodeSet: Set<string>
    ) {
      if (treeControl.dataNodes) {
        expandedNodeSet.forEach((nodeId) => {
          // maintain expanded node state
          if (!treeControl.dataNodes.find((n) => n.id === nodeId)) {
            // if the tree doesn't have the previous node, remove it from the expanded list
            expandedNodeSet.delete(nodeId);
          }
        });
      }
    }

    private expandNodesById(flatNodes: FileFlatNode[], ids: string[]) {
      if (!flatNodes || flatNodes.length === 0) return;
      const idSet = new Set(ids);
      return flatNodes.forEach((node) => {
        if (idSet.has(node.id)) {
          this.treeControl.expand(node);
          let parent = this.getParentNode(node);
          while (parent) {
            this.treeControl.expand(parent);
            parent = this.getParentNode(parent);
          }
        }
      });
    }

    private getParentNode(node: FileFlatNode): FileFlatNode | null {
      const currentLevel = node.level;
      if (currentLevel < 1) {
        return null;
      }
      const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;
      for (let i = startIndex; i >= 0; i--) {
        const currentNode = this.treeControl.dataNodes[i];
        if (currentNode.level < currentLevel) {
          return currentNode;
        }
      }
      return null;
    }





}
