import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-folder-popup',
  templateUrl: './add-folder-popup.component.html',
  styleUrls: ['./add-folder-popup.component.scss']
})
export class AddFolderPopupComponent implements OnInit {

  public folderName : FormControl = new FormControl("")
  constructor(
    public dialogRef: MatDialogRef<AddFolderPopupComponent>
  ) {}

  ngOnInit(): void {
  }

  onSaveFolder(){
    this.dialogRef.close(this.folderName.value)
  }
}
