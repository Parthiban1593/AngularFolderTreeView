import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FolderDetails, FolderDropdown, FolderNode } from 'src/app/model/folder.model';

@Component({
  selector: 'app-folder-info-popup',
  templateUrl: './folder-info-popup.component.html',
  styleUrls: ['./folder-info-popup.component.scss']
})
export class FolderInfoPopupComponent implements OnInit {

  folderData : FolderNode | undefined;
  folderDetails : FolderDetails = {} as FolderDetails
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.folderData = this.data.folder;
    this.folderDetails = {
      name: this.folderData?.label || "",
      createdBy: 'Isabel Smith',
      createdOn: '12 Oct 2023',
      lastUpdatedBy: 'Johnson',
      lastUpdatedOn: '24 Oct 2023',
      sharedBy: 'Isabel Smith',
      sharedOn: '10 Nov 2024',
      sharedAs: ['Operators']
    }
  }

}
