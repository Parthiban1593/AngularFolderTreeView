export class FolderNode {
    label: string | undefined;
    isShared?: boolean;
    type: string | undefined;
    iconName: string | undefined;
    iconColor: string | undefined;
    children?: FolderNode[];
    key?:string;
    iconImg? : string;
    data?: {
        type: string;
    } | undefined
}

export interface FolderDropdown{
    label : string,
    key: string,
    iconName: string;
    iconImg? : string;
    iconColor: string;
    children?: FolderDropdown[];
    groupName? : string;
    data?: {
        type: string;
    } | undefined
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

export class FolderFlatNode{
    label!: string;
    isShared?: boolean;
    type!: string;
    iconName!: string;
    iconImg? : string;
    iconColor!: string;
    level!: number;
    expandable!: boolean;
    key?:string;
    data?: {
        type: string;
    } | undefined
}