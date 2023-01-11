export interface IPath {
    segments: String[];
    color?: string;
  }
  
  export  interface ICircle {
    x: number;
    y: number;
  }
  export  interface IStamp {
    x: number;
    y: number;
    color: string;
  }
  
  export enum Tools {
    Pencil,
    Stamp,
  }
  