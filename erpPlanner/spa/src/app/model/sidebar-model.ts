
export interface SideBarChildrenModel {
  name: string;
  path: string;
}

export interface SideBarModel {
  name: string;
  path: string;
  children?: Array<SideBarChildrenModel>;
}
