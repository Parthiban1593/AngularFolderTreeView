import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FolderDropdown, FolderNode } from 'src/app/model/folder.model';
import { DataService } from 'src/app/services/data.service';
import { AddFolderPopupComponent } from '../add-folder-popup/add-folder-popup.component';

@Component({
  selector: 'app-salvo-view-popup',
  templateUrl: './salvo-view-popup.component.html',
  styleUrls: ['./salvo-view-popup.component.scss']
})
export class SalvoViewPopupComponent implements OnInit {

  public viewName : FormControl = new FormControl("");
  existingFolder : FormControl = new FormControl("");
  folders : FolderDropdown[] = [];
  constructor(
    public dialogRef: MatDialogRef<AddFolderPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private dataService : DataService
  ) {}

  ngOnInit(): void {
    this.folders = this.dataService.getFolders();
  }

  onSaveView(){
    let node : FolderNode = {
      label: this.viewName.value,
      type: 'view',
      iconName: 'view_module',
      iconColor: '#00aec8',
      key : this.dataService.generateCustomId()
    }
    let obj : any = {};
    obj.node = node;
    obj.key = this.existingFolder.value;
    obj.folderName = this.dataService.getFolderByKey(this.existingFolder.value)?.label;
    this.dialogRef.close(obj)
  }

}
