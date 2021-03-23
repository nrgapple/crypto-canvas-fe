import Web3 from "web3";
import { Contract } from "web3-eth-contract";

export enum WorldStateType {
  edit,
  create,
  view,
}

export interface Pixel {
  x: number;
  y: number;
  hexColor: string;
  owner?: string;
  exhibitId?: number;
}

export interface Bid {
  from: string | undefined;
  amount: number;
  exhibitId?: number;
}

export interface Bounds {
  topLeft: Coord;
  bottomRight: Coord;
}

export interface Coord {
  x: number;
  y: number;
}

export interface ContractPixelData {
  rgbArray: number[];
  bounds: Bounds;
}

export interface ContractExhibitResp {
  rgbArray: string[];
  bounds: {
    topLeft: { x: string; y: string };
    bottomRight: { x: string; y: string };
  };
  owner: string;
  exhibitId: string;
}

export interface AllBidsResponse {
  fromAddress: string;
  amount: string;
  exhibitId: string;
}

export interface DartRawResp {
  name: string;
  dartId: string;
  owner: string;
  rgbaArray: string[];
  dimensions: DimensionsResp;
}

export interface DimensionsResp {
  width: string;
  height: string;
}

export interface DartRaw {
  name: string;
  dartId: number;
  owner: number;
  rgbaArray: number[];
  dimensions: Dimensions;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface Dart {
  name: string;
  dartId: number;
  owner: string;
}

export interface ImageParts {
  rgbaArray: number[];
  dimensions: Dimensions;
}
