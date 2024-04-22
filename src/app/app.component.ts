import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ArrayDataSource } from '@angular/cdk/collections';
import { NestedTreeControl } from '@angular/cdk/tree';
import { AddFolderPopupComponent } from './popup/add-folder-popup/add-folder-popup.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { ChangeDetectionStrategy } from '@angular/compiler';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { FormControl } from '@angular/forms';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { FolderNode } from './model/folder.model';
import { DataService } from './services/data.service';
import { TreeDataSource } from './model/treeDataSource';
import { SalvoViewPopupComponent } from './popup/salvo-view-popup/salvo-view-popup.component';
import { ShareFolderPopupComponent } from './popup/share-folder-popup/share-folder-popup.component';
import { FolderInfoPopupComponent } from './popup/folder-info-popup/folder-info-popup.component';
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
  @ViewChild('menuTrigger') menuTrigger!: MatMenuTrigger;
  showTree: boolean = true;
  myFoldersHierachy: FolderNode[] = [];
  treeControl = new NestedTreeControl<FolderNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<FolderNode>();

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
  //treeControl = new NestedTreeControl<FolderNode>(node => node.children);
  //dataSource = new ArrayDataSource(this.folderHierarchy);
  myFoldersTreeControl = new NestedTreeControl<FolderNode>(node => node.children);
  myFoldersDataSource = new TreeDataSource(this.myFoldersTreeControl,this.myFoldersHierachy);
  contextMenuPosition = { x: '0px', y: '0px' };
  searchFolderOrNode: FormControl = new FormControl();
  selectedNode : FolderNode | null = null;
  hasChild = (_: number, node: FolderNode) => !!node.children && node.children.length > 0;
  title = 'FolderStructureDemo';

  constructor(public dialog: MatDialog, private cdr: ChangeDetectorRef,private dataService : DataService) { }

  ngOnInit(){
    this.dataSource.data = this.folderHierarchy;
  }
  ngAfterViewInit() {
    this.searchFolderOrNode.valueChanges.subscribe((searchString) => {
      let shareWithMeFilteredArr = [];
      let myFolderArr = []
      if (searchString.length > 3) {
        shareWithMeFilteredArr = this.filterFolderHierarchy(this.folderHierarchy, searchString)
        this.dataSource.data = shareWithMeFilteredArr;
        myFolderArr = this.filterFolderHierarchy(this.myFoldersHierachy, searchString)
        this.myFoldersDataSource.data = myFolderArr;
      } else {
        this.dataSource.data = this.folderHierarchy;
        this.myFoldersDataSource.data = this.myFoldersHierachy;
      }
    })
  }

  filterFolderHierarchy(folderArray: FolderNode[], searchTerm: string): FolderNode[] {
    return folderArray.reduce((filtered: FolderNode[], current: FolderNode) => {
      // Check if the current node matches the search term
      if (current.label.toLowerCase().includes(searchTerm.toLowerCase())) {
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


  addNewFolder(node?: FolderNode | null,view? :string): void {
    const dialogRef = this.dialog.open(AddFolderPopupComponent, {
      width: '450px',
      data : {type : view,items : node}
    });
    this.selectedNode = node || null;
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('The dialog was closed' + result);
      
      if (result && !node && view =="addFolder") {
        let folderNode: FolderNode = {} as FolderNode;
        folderNode.label = result.folderName;
        folderNode.iconName = "folder";
        folderNode.iconColor = "#ccc",
        folderNode.type = "folder"
        folderNode.children = result.selectedNodes;
        folderNode.key = this.dataService.generateCustomId();
        this.dataService.setFolders(folderNode)
        // this.myFoldersDataSource.data.push(folderNode);
        // this.myFoldersTreeControl.dataNodes = [...this.myFoldersDataSource.data];
        // this.myFoldersTreeControl.expandAll();
        this.myFoldersDataSource.add(folderNode);
        
      } else if (result && node && view =="addFolder") {
        let newFolderNode: FolderNode = {
          label: result.folderName,
          iconName: "folder",
          iconColor: "#ccc",
          type: "folder",
          children: result.selectedNodes,
        };
        // console.log("node--"+JSON.stringify(node))
        // this.selectedNode?.children?.push(newFolderNode);
        // this.myFoldersTreeControl.dataNodes = [...this.myFoldersDataSource.data];
        // this.myFoldersTreeControl.expand(node);

        if (this.selectedNode) {
          if (!this.selectedNode.children) {
            this.selectedNode.children = [];
          }
          
          // this.selectedNode.children.push(newFolderNode);
          // let tempArr = [];
          // this.myFoldersTreeControl.dataNodes = [];
          // tempArr = JSON.parse(JSON.stringify(this.myFoldersDataSource.data));
          // // Update the tree structure
          // this.myFoldersDataSource.data = [];
          // this.myFoldersDataSource.data=tempArr;
          // // Expand the parent node to show the new child
          // this.myFoldersTreeControl.dataNodes = [...this.myFoldersDataSource.data];
          // setTimeout(()=>{
          //   this.myFoldersTreeControl.expandAll()
          // },500)
          newFolderNode.key = this.dataService.generateCustomId();
          this.dataService.setFolders(newFolderNode,node.label);
          this.myFoldersDataSource.add(newFolderNode,this.selectedNode);
        }
      }else if(result && view =="addNode"){
        let node = this.findNode(result.key,this.myFoldersDataSource.data);
        let selectedNodes : FolderNode[] = result.selectedNodes;
        if(node){
          selectedNodes.forEach((childNode : any)=>{
            this.myFoldersDataSource.add(childNode,node);
          })
        }
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
    if(item.iconName == "folder" || item.iconName =="folder_shared"){
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
        let parentNode = this.findNode(result.key,this.myFoldersDataSource.data);
        if(parentNode){
          this.myFoldersDataSource.add(result.node,parentNode);
        }
      }
    });
  }


}
