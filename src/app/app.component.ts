import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { ArrayDataSource, SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl, NestedTreeControl } from '@angular/cdk/tree';
import { AddFolderPopupComponent } from './popup/add-folder-popup/add-folder-popup.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { ChangeDetectionStrategy } from '@angular/compiler';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { FormControl } from '@angular/forms';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeNestedDataSource } from '@angular/material/tree';
import { FolderFlatNode, FolderNode } from './model/folder.model';
import { DataService } from './services/data.service';
import { TreeDataSource } from './model/treeDataSource';
import { SalvoViewPopupComponent } from './popup/salvo-view-popup/salvo-view-popup.component';
import { ShareFolderPopupComponent } from './popup/share-folder-popup/share-folder-popup.component';
import { FolderInfoPopupComponent } from './popup/folder-info-popup/folder-info-popup.component';
import { DataSource } from './services/dataSouce.service';
import { ConfirmPopupComponent } from './popup/confirm-popup/confirm-popup.component';
/**
 * Food data with nested structure.
 * Each node has a label and an optiona list of children.
 */



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {


    /** Map from flat node to nested node. This helps us finding the nested node to be modified */
    flatNodeMap : any= new Map<FolderFlatNode, FolderNode>();

    /** Map from nested node to flattened node. This helps us to keep the same object for selection */
    nestedNodeMap : any= new Map<FolderNode, FolderFlatNode>();
  
    /** A selected parent node to be inserted */
    selectedParent: FolderFlatNode | null = null;
  
    /** The new item's name */
    newItemName = '';
  
    treeControl: FlatTreeControl<FolderFlatNode>;
  
    treeFlattener: MatTreeFlattener<FolderNode, FolderFlatNode>;
  
    dataSource: MatTreeFlatDataSource<FolderNode, FolderFlatNode>;
  
    /** The selection for checklist */
    checklistSelection = new SelectionModel<FolderFlatNode>(true /* multiple */);
  
    /* Drag and drop */
    dragNode: any;
    dragNodeExpandOverWaitTimeMs = 300;
    dragNodeExpandOverNode: any;
    dragNodeExpandOverTime: number | undefined;
    dragNodeExpandOverArea: string | undefined;
    @ViewChild('emptyItem') emptyItem: ElementRef | undefined;

  @ViewChild('menuTrigger') menuTrigger!: MatMenuTrigger;
  showTree: boolean = true;
  myFoldersHierachy: FolderNode[] = [];
  shareWithMeTreeControl = new NestedTreeControl<FolderNode>(node => node.children);
  shareWithMeDataSource = new MatTreeNestedDataSource<FolderNode>();

  folderHierarchy: FolderNode[] = [
    {
      label: 'Folder 1',
      type: "folder",
      iconName: "folder_shared",
      iconColor: "#f0685f",
      children: [
        { label: 'Lab Rtsp viewer', type: "device", iconName: "router", iconColor: "green" },
        { label: 'Camera 235', type: "device", iconName: "videocam", iconColor: "green" },
        { label: 'Front view 4x4', type: "view", iconName: "view_module", iconColor: "#00aec8" },
        { label: 'Parking view 4x4', type: "view", iconName: "view_module", iconColor: "#00aec8" }
      ]
    },
    {
      label: 'Folder 2',
      type: "folder",
      iconName: "folder_shared",
      iconColor: "#f0685f",
      children: [
        {
          label: 'Folder 2.1',
          type: "folder",
          iconName: "folder_shared",
          iconColor: "#f0685f",
          children: [{ label: 'Lab Rtsp viewer', type: "device", iconName: "router", iconColor: "green" }, { label: 'Camera 236', type: "device", iconName: "videocam", iconColor: "green" }]
        },
        {
          label: 'Folder 2.2',
          type: "folder",
          iconName: "folder_shared",
          iconColor: "#f0685f",
          children: [{ label: 'Lab Rtsp viewer', type: "device", iconName: "router", iconColor: "green" }, { label: 'Camera 237', type: "device", iconName: "videocam", iconColor: "green" }]
        },
      ],
    },
  ];
  //shareWithMeTreeControl = new NestedTreeControl<FolderNode>(node => node.children);
  //shareWithMeDataSource = new ArrayDataSource(this.folderHierarchy);
  //myFoldersTreeControl = new NestedTreeControl<FolderNode>(node => node.children);
 // myFoldersDataSource = new TreeDataSource(this.treeControl,this.myFoldersHierachy);
  contextMenuPosition = { x: '0px', y: '0px' };
  searchFolderOrNode: FormControl = new FormControl();
  selectedNode : FolderNode = {} as FolderNode;
  //hasChild = (_: number, node: FolderNode) => !!node.children && node.children.length > 0;
  title = 'FolderStructureDemo';

  constructor(public dialog: MatDialog, private cdr: ChangeDetectorRef,private dataService : DataService,private database: DataSource) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
     this.treeControl = new FlatTreeControl<FolderFlatNode>(this.getLevel, this.isExpandable);
     this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
 
     database.dataChange.subscribe((data: FolderNode[]) => {
       this.dataSource.data = [];
       this.dataSource.data = data;
       this.myFoldersHierachy = data;
     });
   }

  ngOnInit(){
    this.shareWithMeDataSource.data = this.folderHierarchy;
  }
  ngAfterViewInit() {
    this.searchFolderOrNode.valueChanges.subscribe((searchString) => {
      let shareWithMeFilteredArr = [];
      let myFolderArr = []
      if (searchString.length > 3) {
        shareWithMeFilteredArr = this.filterFolderHierarchy(this.folderHierarchy, searchString)
        this.shareWithMeDataSource.data = shareWithMeFilteredArr;
        myFolderArr = this.filterFolderHierarchy(this.myFoldersHierachy, searchString)
        this.dataSource.data = myFolderArr;
      }
       else {
        this.shareWithMeDataSource.data = this.folderHierarchy;
        this.dataSource.data = this.myFoldersHierachy;
      }
    })
  }

  filterFolderHierarchy(folderArray: FolderNode[], searchTerm: string): FolderNode[] {
    return folderArray.reduce((filtered: FolderNode[], current: FolderNode) => {
      // Check if the current node matches the search term
      if (current.label && current.label.toLowerCase().includes(searchTerm.toLowerCase())) {
        // If it matches, add it to the filtered array
        filtered.push(current);
      } else if (current.children) {
        // If it doesn't match and has children, recursively filter its children
        const filteredChildren = this.filterFolderHierarchy(current.children, searchTerm);
        // If any child matches, add the current node to the filtered array
        if (filteredChildren.length > 0) {
          filtered.push({ ...current, children: filteredChildren });
        }
      }
      return filtered;
    }, []);
  }

  openShareFolder(node?: FolderNode){
    const dialogRef = this.dialog.open(ShareFolderPopupComponent, {
      width: '450px',
      data : {"folder" : node}
    });
    dialogRef.afterClosed().subscribe((result: any) => {

    })
  }
  openFolderInfo(node?: FolderNode){
    const dialogRef = this.dialog.open(FolderInfoPopupComponent, {
      width: '450px',
      data : {"folder" : node}
    });
    dialogRef.afterClosed().subscribe((result: any) => {

    })
  }


  addNewFolder(node?: any,view? :string): void {
    const dialogRef = this.dialog.open(AddFolderPopupComponent, {
      width: '450px',
      data : {type : view,item : node}
    });
    this.selectedNode = node;
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('The dialog was closed' + result);
      
      if (result && !node && view =="addFolder") {
        let folderNode: FolderNode = {} as FolderNode;
        folderNode.label = result.folderName;
        folderNode.iconName = "folder";
        folderNode.data = {type : "folder"}
        folderNode.iconColor = "#ccc",
        folderNode.type = "folder"
        folderNode.children = result.selectedNodes;
        folderNode.key = this.dataService.generateCustomId();
        this.dataService.setFolders(folderNode)
        // this.dataSource.data.push(folderNode);
        // this.treeControl.dataNodes = [...this.dataSource.data];
        // this.treeControl.expandAll();
        //this.dataSource.add(folderNode);
        this.database.insertItem(this.selectedNode,folderNode)
        
      } else if (result && node && view =="addFolder") {
        let newFolderNode: FolderNode = {
          label: result.folderName,
          iconName: "folder",
          data : {type : "folder"},
          iconColor: "#ccc",
          type: "folder",
          children: result.selectedNodes,
        };
        // console.log("node--"+JSON.stringify(node))
        // this.selectedNode?.children?.push(newFolderNode);
        // this.treeControl.dataNodes = [...this.dataSource.data];
        // this.treeControl.expand(node);

        if (this.selectedNode) {
          if (!this.selectedNode.children) {
            this.selectedNode.children = [];
          }
          
          // this.selectedNode.children.push(newFolderNode);
          // let tempArr = [];
          // this.treeControl.dataNodes = [];
          // tempArr = JSON.parse(JSON.stringify(this.dataSource.data));
          // // Update the tree structure
          // this.dataSource.data = [];
          // this.dataSource.data=tempArr;
          // // Expand the parent node to show the new child
          // this.treeControl.dataNodes = [...this.dataSource.data];
          // setTimeout(()=>{
          //   this.treeControl.expandAll()
          // },500)
          newFolderNode.key = this.dataService.generateCustomId();
          this.dataService.setFolders(newFolderNode,node.label);
          let parentNode = this.findNode(node.key,this.dataSource.data);
          this.database.insertItem(parentNode,newFolderNode);
          this.treeControl.expand(node)
        }
      }else if(result && view =="addNode"){
        let parentNode = this.findNode(result.key,this.dataSource.data);
        let selectedNodes : FolderNode[] = result.selectedNodes;
        if(parentNode){
          selectedNodes.forEach((childNode : FolderNode)=>{
            this.database.insertItem(parentNode,childNode);
          })
        }
      }else if (result && node && view =="editFolder") {
        let parentNode = this.findNode(this.selectedNode?.key || "",this.dataSource.data);
        parentNode!.label = result.folderName || "";
        // node!.children = [];
        // if(node){
        //   result.selectedNodes.forEach((childNode : any)=>{
        //     this.myFoldersDataSource.add(childNode,node);
        //   })
        // }
      }
    });
  }

  findNode(key: string, nodes: FolderNode[]): FolderNode | null {
    for (let node of nodes) {
      if (node.key === key) {
        return node;
      }
      if (node.children) {
        let found = this.findNode(key, node.children);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }

  findAndAddChild(targetLabel: string, newNode: FolderNode, nodes: FolderNode[]): boolean {
    for (const node of nodes) {
      if (node.label === targetLabel) {
        if (!node.children) {
          node.children = [];
        }
        node.children.push(newNode);
        return true;
      } else if (node.children && this.findAndAddChild(targetLabel, newNode, node.children)) {
        return true;
      }
    }
    return false;
  }


  onContextMenu(event: MouseEvent, item: FolderNode, contextMenu: MatMenuTrigger) {
    if(item.data?.type == "folder" || item.iconName =="folder_shared"){
      event.preventDefault();
      this.contextMenuPosition.x = event.clientX + 'px';
      this.contextMenuPosition.y = event.clientY + 'px';
      contextMenu.menuData = { 'item': item };
      contextMenu.menu.focusFirstItem('mouse');
      contextMenu.openMenu();
    }
  }

  openSalvoView(){
    const dialogRef = this.dialog.open(SalvoViewPopupComponent, {
      width: '450px',
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if(result){
        let parentNode = this.findNode(result.key,this.dataSource.data);
        if(parentNode){
          this.database.insertItem(parentNode,result.node);
        }
      }
    });
  }

  deleteFolder(node : FolderNode){

    const dialogRef = this.dialog.open(ConfirmPopupComponent, {
      width: '450px',
      data : {"node" : node}
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if(result){
        this.database.deleteItem(node);
        if(node.data?.type == "folder"){
          this.dataService.setFolders(node,node.label,true);
        }
      }
    })
    
  }

  editFolder(node : FolderNode){
    this.addNewFolder(node,"editFolder")
  }
  
 
   getLevel = (node: FolderFlatNode) => node.level;
 
   isExpandable = (node: FolderFlatNode) => node.expandable;
 
   getChildren = (node: FolderNode): any => node.children;
 
   hasChild = (_: number, _nodeData: FolderFlatNode) => _nodeData.expandable;
 
   hasNoContent = (_: number, _nodeData: FolderFlatNode) => _nodeData.key === '';
 
   /**
    * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
    */
   transformer = (node: FolderNode, level: number) => {
     const existingNode = this.nestedNodeMap.get(node);
     const flatNode = existingNode && existingNode.key === node.key
       ? existingNode
       : new FolderFlatNode();
       flatNode.label = node.label;
       flatNode.data = node.data;
       flatNode.iconImg = node.iconImg;
       flatNode.iconName = node.iconName;
       flatNode.iconColor = node.iconColor
     flatNode.key = node.key;
     flatNode.level = level;
     flatNode.expandable = (node.children && node.children.length > 0);
     this.flatNodeMap.set(flatNode, node);
     this.nestedNodeMap.set(node, flatNode);
     return flatNode;
   }
 
   /** Whether all the descendants of the node are selected */
   descendantsAllSelected(node: FolderFlatNode): boolean {
     const descendants = this.treeControl.getDescendants(node);
     return descendants.every(child => this.checklistSelection.isSelected(child));
   }
 
   /** Whether part of the descendants are selected */
   descendantsPartiallySelected(node: FolderFlatNode): boolean {
     const descendants = this.treeControl.getDescendants(node);
     const result = descendants.some(child => this.checklistSelection.isSelected(child));
     return result && !this.descendantsAllSelected(node);
   }
 
   /** Toggle the to-do item selection. Select/deselect all the descendants node */
   todoItemSelectionToggle(node: FolderFlatNode): void {
     this.checklistSelection.toggle(node);
     const descendants = this.treeControl.getDescendants(node);
     this.checklistSelection.isSelected(node)
       ? this.checklistSelection.select(...descendants)
       : this.checklistSelection.deselect(...descendants);
   }
 
  //  /** Select the category so we can insert the new item. */
  //  addNewItem(node: FolderFlatNode) {
  //    const parentNode : any = this.flatNodeMap.get(node);
  //    this.database.insertItem(parentNode, '');
  //    this.treeControl.expand(node);
  //  }
 
   /** Save the node to database */
   saveNode(node: FolderFlatNode, itemValue: string) {
     const nestedNode : any= this.flatNodeMap.get(node);
     this.database.updateItem(nestedNode, itemValue);
   }
 
   handleDragStart(event: any, node: FolderFlatNode) {
     // Required by Firefox (https://stackoverflow.com/questions/19055264/why-doesnt-html5-drag-and-drop-work-in-firefox)
     event.dataTransfer.setData('foo', 'bar');
     event.dataTransfer.setDragImage(this.emptyItem?.nativeElement, 0, 0);
     this.dragNode = node;
     this.treeControl.collapse(node);
   }
 
   handleDragOver(event: any, node: FolderFlatNode) {
     event.preventDefault();
 
     // Handle node expand
     if (node === this.dragNodeExpandOverNode) {
       if (this.dragNode !== node && !this.treeControl.isExpanded(node)) {
         if (this.dragNodeExpandOverTime && (new Date().getTime() - this.dragNodeExpandOverTime) > this.dragNodeExpandOverWaitTimeMs) {
           this.treeControl.expand(node);
         }
       }
     } else {
       this.dragNodeExpandOverNode = node;
       this.dragNodeExpandOverTime = new Date().getTime();
     }
 
     // Handle drag area
     const percentageX = event.offsetX / event.target.clientWidth;
     const percentageY = event.offsetY / event.target.clientHeight;
     if (percentageY < 0.50) {
       this.dragNodeExpandOverArea = 'above';
     } else if (percentageY > 0.50) {
       this.dragNodeExpandOverArea = 'below';
     } else {
       this.dragNodeExpandOverArea = 'center';
     }
   }
 
   handleDrop(event: any, node: FolderFlatNode) {
     event.preventDefault();
    
     if (node !== this.dragNode) {
      let newItem: FolderNode | undefined;
       let flatMapNode = JSON.parse(JSON.stringify(this.flatNodeMap.get(this.dragNode)));
       if (this.dragNodeExpandOverArea === 'above' && node.data?.type =="folder") {
        this.database.deleteItem(this.flatNodeMap.get(this.dragNode));
         newItem = this.database.copyPasteItemAbove(flatMapNode, this.flatNodeMap.get(node));
       } else if (node.data?.type =="folder") {
         this.database.deleteItem(this.flatNodeMap.get(this.dragNode));
         newItem = this.database.copyPasteItem(flatMapNode, this.flatNodeMap.get(node));
       } 
      //  else if(node.data?.type =="folder"){
      //   this.database.deleteItem(this.flatNodeMap.get(this.dragNode));
      //    newItem = this.database.copyPasteItem(flatMapNode, this.flatNodeMap.get(node));
      //  }
       if(newItem){
        this.treeControl.expandDescendants(this.nestedNodeMap.get(newItem));
       }
     }
     this.dragNode = null;
     this.dragNodeExpandOverNode = null;
     this.dragNodeExpandOverTime = 0;
   }
 
   handleDragEnd(event: any) {
     this.dragNode = null;
     this.dragNodeExpandOverNode = null;
     this.dragNodeExpandOverTime = 0;
   }


}
