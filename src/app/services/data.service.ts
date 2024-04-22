import { Injectable } from '@angular/core';
import { FolderDropdown } from '../model/folder.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }
  foldesrMap : Map<string,FolderDropdown> = new Map<string,FolderDropdown>();

  generateCustomId() {
    const timestamp = new Date().getTime();
    const randomNumber = Math.floor(Math.random() * 10000); // You can adjust the range as needed
    const customId = `${timestamp}-${randomNumber}`;
    return customId;
  }

  setFolders(folderNode : any,existingFolderName? : string){
    if(existingFolderName){
      folderNode.groupName = existingFolderName
    }
    this.foldesrMap.set(folderNode.key,folderNode)
  }
  
  getFolders(){
    return Array.from(this.foldesrMap.values());
  }

  getFolderByKey(key : string){
    return this.foldesrMap.get(key);
  }

  
  
}
