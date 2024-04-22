export interface FolderNode {
    label: string;
    isShared?: boolean;
    type: string;
    iconName: string;
    iconColor: string;
    children?: FolderNode[];
    key?:string
}

export interface FolderDropdown{
    label : string,
    key: string,
    iconName: string;
    iconColor: string;
    children?: FolderDropdown[];
    groupName? : string
}

export interface FolderDetails{
    name : string,
    createdBy : string,
    createdOn : string,
    lastUpdatedBy : string,
    lastUpdatedOn : string,
    sharedBy : string,
    sharedOn : string,
    sharedAs : string[]
}