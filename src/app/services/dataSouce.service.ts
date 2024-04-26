import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { FolderNode } from "../model/folder.model";

/**
 * Checklist database, it can build a tree structured Json object.
 * Each node in Json object represents a to-do item or a category.
 * If a node is a category, it has children items and new items can be added under the category.
 */
@Injectable({
    providedIn: 'root'
  })
export class DataSource {
  dataChange = new BehaviorSubject<FolderNode[]>([]);

  get data(): FolderNode[] { return this.dataChange.value; }

  constructor() {
    this.initialize();
  }

  initialize() {
    // Build the tree nodes from Json object. The result is a list of `FolderNode` with nested
    //     file node as children.
    //const data = this.buildFileTree(TREE_DATA, 0);
    //console.log(data)
    // Notify the change.
    //this.dataChange.next(data);
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `FolderNode`.
   */
//   buildFileTree(obj: any, level: number): FolderNode[] {
//     return Object.keys(obj).reduce<FolderNode[]>((accumulator, key) => {
//       const value  = obj[key];
//       const node = new FolderNode();
//       node.key = key;

//       if (value != null) {
//         if (typeof value === 'object') {
//           node.children = this.buildFileTree(value, level + 1);
//         } else {
//           node.key = value;
//         }
//       }

//       return accumulator.concat(node);
//     }, []);
//   }

  /** Add an item to to-do list */
  insertItem(parent: any, childNode: any): FolderNode {
    if(!parent){
        this.data.push(childNode)
    }else{
        if (!parent.children) {
            parent.children = [];
          }
          //const newItem = { item: name } as unknown as FolderNode;
          if(!parent.children.find((obj: any) => obj.key === childNode.key)){
            parent.children.push(childNode);
          }
    }
    this.dataChange.next(this.data);
    return childNode;
  }

  insertItemAbove(node: FolderNode, childNode: FolderNode): FolderNode {
    const parentNode = this.getParentFromNodes(node);
    //const newItem = { item: name } as unknown as FolderNode;
    if (parentNode != null) {
      parentNode.children?.splice(parentNode.children.indexOf(node), 0, childNode);
    } else {
      this.data.splice(this.data.indexOf(node), 0, childNode);
    }
    this.dataChange.next(this.data);
    return childNode;
  }

  insertItemBelow(node: FolderNode, childNode: FolderNode): FolderNode {
    const parentNode = this.getParentFromNodes(node);
    //const newItem = { item: name } as unknown as FolderNode;
    if (parentNode != null) {
      parentNode.children?.splice(parentNode.children.indexOf(node) + 1, 0, childNode);
    } else {
      this.data.splice(this.data.indexOf(node) + 1, 0, childNode);
    }
    this.dataChange.next(this.data);
    return childNode;
  }

  getParentFromNodes(node: FolderNode): any {
    for (let i = 0; i < this.data.length; ++i) {
      const currentRoot = this.data[i];
      const parent = this.getParent(currentRoot, node);
      if (parent != null) {
        return parent;
      }
    }
    return null;
  }

  getParent(currentRoot: FolderNode, node: FolderNode): any {
    if (currentRoot.children && currentRoot.children.length > 0) {
      for (let i = 0; i < currentRoot.children.length; ++i) {
        const child = currentRoot.children[i];
        if (child === node) {
          return currentRoot;
        } else if (child.children && child.children.length > 0) {
          const parent = this.getParent(child, node);
          if (parent != null) {
            return parent;
          }
        }
      }
    }
    return null;
  }

  updateItem(node: FolderNode, name: string) {
    node.key = name;
    this.dataChange.next(this.data);
  }

  deleteItem(node: FolderNode) {
    this.deleteNode(this.data, node);
    this.dataChange.next(this.data);
  }

  copyPasteItem(from: FolderNode, to: FolderNode): FolderNode {
    const newItem = this.insertItem(to, from);
    if (from.children) {
      from.children.forEach(child => {
        this.copyPasteItem(child, newItem);
      });
    }
    return newItem;
  }

  copyPasteItemAbove(from: FolderNode, to: FolderNode): FolderNode {
    const newItem = this.insertItemAbove(to, from);
    if (from.children) {
      from.children.forEach(child => {
        this.copyPasteItem(child, newItem);
      });
    }
    return newItem;
  }

  copyPasteItemBelow(from: FolderNode, to: FolderNode): FolderNode {
    const newItem = this.insertItemBelow(to, from);
    if (from.children) {
      from.children.forEach(child => {
        this.copyPasteItem(child, newItem);
      });
    }
    return newItem;
  }

  deleteNode(nodes: FolderNode[], nodeToDelete: FolderNode) {
     // const index = nodes.indexOf(nodeToDelete, 0);
    const index = nodes.findIndex(obj => obj.key === nodeToDelete.key);
    if (index > -1) {
      nodes.splice(index, 1);
    } else {
      nodes.forEach(node => {
        if (node.children && node.children.length > 0) {
          this.deleteNode(node.children, nodeToDelete);
        }
      });
    }
  }
}