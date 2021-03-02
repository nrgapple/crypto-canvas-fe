import Web3 from "web3";
import { Contract } from "web3-eth-contract";

export interface Pixel {
  x: number;
  y: number;
  hexColor: string;
  id?: string;
  owner?: string;
  creatorId?: number;
}

export interface Bid {
  from: string;
  amount: number;
}

export interface Web3Contract {
  contract: Contract;
  accounts: string[];
  web3: Web3;
}
