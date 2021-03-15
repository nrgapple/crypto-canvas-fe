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

export interface Web3Contract {
  contract: Contract;
  accounts: string[];
  web3: Web3;
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
