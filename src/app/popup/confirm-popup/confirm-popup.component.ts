import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FolderNode } from 'src/app/model/folder.model';

@Component({
  selector: 'app-confirm-popup',
  templateUrl: './confirm-popup.component.html',
  styleUrls: ['./confirm-popup.component.scss']
})
export class ConfirmPopupComponent implements OnInit {

  node : FolderNode | undefined;
  constructor(public dialogRef: MatDialogRef<ConfirmPopupComponent>,@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.node = this.data.node;
  }

  onConfirm(){
    this.dialogRef.close(true)
  }

}
