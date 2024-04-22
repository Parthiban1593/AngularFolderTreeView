import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import devices from '../../../assets/data/devices.json'
import { FolderDropdown, FolderNode } from 'src/app/model/folder.model';
import { DataService } from 'src/app/services/data.service';


@Component({
  selector: 'app-add-folder-popup',
  templateUrl: './add-folder-popup.component.html',
  styleUrls: ['./add-folder-popup.component.scss']
})
export class AddFolderPopupComponent implements OnInit {

  public folderName : FormControl = new FormControl("");
  selectedNodes: FormControl = new FormControl([]);
  existingFolder : FormControl = new FormControl("");
  public nodes : any[]= devices.nodes;
  dialogData : any;
  folders : FolderDropdown[] = [];
  constructor(
    public dialogRef: MatDialogRef<AddFolderPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private dataService : DataService
  ) {}

  ngOnInit(): void {
    this.dialogData = this.data;
    this.folders = this.dataService.getFolders();
    if(this.dialogData.type == 'editFolder'){
      this.folderName.setValue(this.dialogData.item.label);
      console.log(this.dialogData.item.children.map((obj : any)=> obj.key))
      this.selectedNodes.setValue(this.dialogData.item.children.map((obj : any)=> obj.key))
    }
  }

  onSaveFolder(){
    let obj : any = {};
    obj.selectedNodes = this.nodes.filter((node)=>{
      return this.selectedNodes.value.includes(node.key)
    }).map((node)=>{
      let obj : FolderNode= {} as FolderNode;
      obj.iconColor = node.iconColor;
      obj.iconName = node.iconName;
      obj.label = node.label;
      obj.type = "device";
      obj.children = [];
      obj.key = this.dataService.generateCustomId()
      return obj
    })
    obj.folderName = this.folderName.value || this.dataService.getFolderByKey(this.existingFolder.value)?.label;
    obj.key = this.existingFolder.value;
    this.dialogRef.close(obj)
  }
}
