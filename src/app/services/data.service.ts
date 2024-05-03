import { Injectable } from '@angular/core';
import { FolderDropdown } from '../model/folder.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }
  foldersMap : Map<string,FolderDropdown> = new Map<string,FolderDropdown>();

  generateCustomId() {
    const timestamp = new Date().getTime();
    const randomNumber = Math.floor(Math.random() * 10000); // You can adjust the range as needed
    const customId = `${timestamp}-${randomNumber}`;
    return customId;
  }

  setFolders(folderNode : any,existingFolderName? : string,isdeleteNode : boolean=false){
    if(isdeleteNode){
      this.foldersMap.delete(folderNode.key);
    }else{
      if(existingFolderName){
        folderNode.groupName = existingFolderName
      }
      this.foldersMap.set(folderNode.key,folderNode);
    }
  }
  
  getFolders(){
    return Array.from(this.foldersMap.values());
  }

  getFolderByKey(key : string){
    return this.foldersMap.get(key);
  }

  
  
}
