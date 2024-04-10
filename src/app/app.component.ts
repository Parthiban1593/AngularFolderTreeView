import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ArrayDataSource } from '@angular/cdk/collections';
import { NestedTreeControl } from '@angular/cdk/tree';
import { AddFolderPopupComponent } from './popup/add-folder-popup/add-folder-popup.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog'
import { ChangeDetectionStrategy } from '@angular/compiler';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
/**
 * Food data with nested structure.
 * Each node has a name and an optiona list of children.
 */
interface FolderNode {
  name: string;
  isShared?: boolean;
  type: string;
  iconName: string;
  iconColor : string;
  children?: FolderNode[];
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('menuTrigger') menuTrigger!: MatMenuTrigger;
  showTree : boolean = true;
  myFoldersHierachy : FolderNode[] = [];
  folderHierarchy : FolderNode[] = [
    {
      name: 'Folder 1',
      type: "folder",
      iconName: "folder_shared",
      iconColor : "#f0685f",
      children: [
        { name: 'Lab Rtsp viewer', type: "device", iconName: "router",iconColor : "green" }, 
        { name: 'Camera 235', type: "device", iconName: "videocam",iconColor : "green" },
        { name: 'Front view 4x4', type: "view", iconName: "view_module",iconColor : "#00aec8" },
        { name: 'Parking view 4x4', type: "view", iconName: "view_module",iconColor : "#00aec8" }
      ]
    },
    {
      name: 'Folder 2',
      type: "folder",
      iconName: "folder_shared",
      iconColor : "#f0685f",
      children: [
        {
          name: 'Folder 2.1',
          type: "folder",
          iconName: "folder_shared",
          iconColor : "#f0685f",
          children: [{ name: 'Lab Rtsp viewer', type: "device", iconName: "router",iconColor : "green" }, { name: 'Camera 236', type: "device", iconName: "videocam",iconColor : "green" }]
        },
        {
          name: 'Folder 2.2',
          type: "folder",
          iconName: "folder_shared",
          iconColor : "#f0685f",
          children: [{ name: 'Lab Rtsp viewer', type: "device", iconName: "router",iconColor : "green" }, { name: 'Camera 237', type: "device", iconName: "videocam",iconColor : "green" }]
        },
      ],
    },
  ];
  treeControl = new NestedTreeControl<FolderNode>(node => node.children);
  dataSource = new ArrayDataSource(this.folderHierarchy);
  myFoldersTreeControl = new NestedTreeControl<FolderNode>(node => node.children);
  myFoldersDataSource = new ArrayDataSource(this.myFoldersHierachy);
  contextMenuPosition = { x: '0px', y: '0px' };

  hasChild = (_: number, node: FolderNode) => !!node.children && node.children.length > 0;
  title = 'FolderStructureDemo';

  constructor(public dialog: MatDialog,private cdr : ChangeDetectorRef) {}

  addNewFolder(): void {
    const dialogRef = this.dialog.open(AddFolderPopupComponent, {
      width: '450px',
    });

    dialogRef.afterClosed().subscribe((result : any) => {
      console.log('The dialog was closed'+result);
      if(result){
        let folderNode : FolderNode = {} as FolderNode;
        folderNode.name = result;
        folderNode.iconName ="folder";
        folderNode.iconColor = "#ccc",
        folderNode.type = "folder"
        folderNode.children= [{ name: 'Lab Rtsp viewer 2 ', type: "device", iconName: "router",iconColor : "green" }, { name: 'Camera 237', type: "device", iconName: "videocam",iconColor : "green" }]
        this.myFoldersHierachy.push(folderNode);
        this.myFoldersDataSource = new ArrayDataSource(this.myFoldersHierachy);
      }
    });
  }

  onContextMenu(event: MouseEvent, item: any,contextMenu: MatMenuTrigger ) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    contextMenu.menuData = { 'item': item };
    contextMenu.menu.focusFirstItem('mouse');
    contextMenu.openMenu();
  }
  

}
