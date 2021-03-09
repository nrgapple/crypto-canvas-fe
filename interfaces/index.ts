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
  pixelId?: string;
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
