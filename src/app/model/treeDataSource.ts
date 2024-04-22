import { NestedTreeControl } from "@angular/cdk/tree";
import { Component, ViewChild, AfterViewInit } from "@angular/core";
import { MatTreeNestedDataSource, MatTree,MatTreeFlatDataSource } from "@angular/material/tree";
import { FolderNode } from "./folder.model";

/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */


export class TreeDataSource extends MatTreeNestedDataSource<FolderNode> {
  constructor(
    private treeControl: NestedTreeControl<FolderNode>,
    intialData: FolderNode[]
  ) {
    super();
    //this._data.next(intialData);
    this.treeControl.dataNodes = intialData
  }

  /** Add node as child of parent */
  public add(node: FolderNode, parent?: FolderNode | null) {
    // add dummy root so we only have to deal with `FolderNode`s
    const newTreeData : FolderNode= {
        label: "dummyNode",
        type: "",
        iconName: "",
        iconColor: "",
        children:this.data
    };
    this._add(node, parent ? parent : newTreeData, newTreeData);
    this.data = newTreeData.children || [];
  }

  /** Remove node from tree */
  public remove(node: FolderNode) {
    const newTreeData : FolderNode= {
        label: "dummyNode",
        type: "",
        iconName: "",
        iconColor: "",
        children:this.data
    };
    this._remove(node, newTreeData);
    this.data = newTreeData.children || [];
  }

  /*
   * For immutable update patterns, have a look at:
   * https://redux.js.org/recipes/structuring-reducers/immutable-update-patterns/
   */

  protected _add(newNode: FolderNode, parent: FolderNode, tree: FolderNode) : any {
    if (tree.label === parent.label) {
      console.log(
        `replacing children array of '${parent.label}', adding ${newNode.label}`
      );
      tree.children = [...tree.children!, newNode];
      this.treeControl.expandDescendants(tree);
      return true;
    }
    if (!tree.children) {
      console.log(`reached leaf node '${tree.label}', backing out`);
      return false;
    }
    return this.update(tree, this._add.bind(this, newNode, parent));
  }

  _remove(node: FolderNode, tree: FolderNode): boolean {
    if (!tree.children) {
      return false;
    }
    const i = tree.children.indexOf(node);
    if (i > -1) {
      tree.children = [
        ...tree.children.slice(0, i),
        ...tree.children.slice(i + 1)
      ];
      this.treeControl.collapse(node);
      console.log(`found ${node.label}, removing it from`, tree);
      return true;
    }
    return this.update(tree, this._remove.bind(this, node));
  }

  protected update(tree: FolderNode, predicate: (n: FolderNode) => boolean) {
    let updatedTree: FolderNode, updatedIndex: number;

    tree.children!.find((node, i) => {
      if (predicate(node)) {
        console.log(`creating new node for '${node.label}'`);
        updatedTree = { ...node };
        updatedIndex = i;
        this.moveExpansionState(node, updatedTree);
        return true;
      }
      return false;
    });

    if (updatedTree!) {
      console.log(`replacing node '${tree.children![updatedIndex!].label}'`);
      tree.children![updatedIndex!] = updatedTree!;
      return true;
    }
    return false;
  }

  moveExpansionState(from: FolderNode, to: FolderNode) {
    if (this.treeControl.isExpanded(from)) {
      console.log(`'${from.label}' was expanded, setting expanded on new node`);
      this.treeControl.collapse(from);
      this.treeControl.expandDescendants(to);
    }
  }
}