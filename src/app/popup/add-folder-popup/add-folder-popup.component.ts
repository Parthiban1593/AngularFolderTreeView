import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import devices from '../../../assets/data/devices.json'
import { FolderDropdown, FolderNode } from 'src/app/model/folder.model';
import { DataService } from 'src/app/services/data.service';
import { NgSelectComponent } from '@ng-select/ng-select';


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
  @ViewChild(NgSelectComponent) ngSelect: NgSelectComponent | undefined;
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
      obj.data = node.data;
      obj.label = node.label;
      obj.type = "device";
      obj.iconImg = node.iconImg;
      obj.key = node.key;
      obj.children = [];
      //obj.key = this.dataService.generateCustomId()
      return obj
    })
    obj.folderName = this.folderName.value || this.dataService.getFolderByKey(this.existingFolder.value)?.label;
    obj.key = this.existingFolder.value;
    this.dialogRef.close(obj)
  }

  public onSelectAll() {
    const searchText = this.ngSelect?.searchInput.nativeElement.value;
    // Filter the list of items based on the search text;
    let items = this.nodes;
    if(searchText)
    items = items.filter(item => item.label.toLowerCase().includes(searchText.toLowerCase()));
    // Extract keys of filtered items
    const selected = items.map(item => item.key);
    this.selectedNodes.patchValue(selected);
  }
  
  public onClearAll() {
    this.selectedNodes.patchValue([]);
  }

  getNodeLabel(item : any){
    return item.label;
  }
}


