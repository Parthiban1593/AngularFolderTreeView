import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FolderNode } from 'src/app/model/folder.model';

@Component({
  selector: 'app-share-folder-popup',
  templateUrl: './share-folder-popup.component.html',
  styleUrls: ['./share-folder-popup.component.scss']
})
export class ShareFolderPopupComponent implements OnInit {

  shareFolderForm : FormGroup = new FormGroup(
    {
      roles : new FormControl(""),
      users : new FormControl("")
    }
  );

  roles : any = [
    {
      key : "1",
      label : "Admin"
    },
    {
      key : "2",
      label : "Operators"
    }
  ]
 
  users : any = [
    {
      key : "1",
      label : "user1"
    },
    {
      key : "2",
      label : "user2"
    }
  ]



  folderData : FolderNode | undefined;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.folderData = this.data.folder;
  }

  shareFolder(){

  }

}
