import { config } from "../app.config";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import PixelToken from "../contracts/PixelToken.json";
import {
  checkEmptyAddress,
  contractExhibitsRespToPixels,
} from "../utils/helpers";
import { AllBidsResponse, Bid } from "../interfaces";

export const getServerContract = () => {
  const provider = new Web3.providers.HttpProvider(config.infuraProviderUri);
  const web3 = new Web3(provider);
  return {
    contract: new web3.eth.Contract(
      PixelToken.abi as AbiItem[] | AbiItem,
      config.contractAddress
    ),
    web3,
  } as const;
};

export const getContractPixels = async () => {
  const { contract } = getServerContract();
  const exResp = await contract.methods.getPixels().call();
  const newPixels = contractExhibitsRespToPixels(exResp);
  console.log(newPixels);
  return newPixels;
};

export const getContractAllBids = async () => {
  const { contract, web3 } = getServerContract();
  const currAllBids = await contract.methods.getAllHighestBids().call();
  return currAllBids
    .map(({ fromAddress: from, amount, exhibitId: exId }: AllBidsResponse) => ({
      from,
      amount: parseFloat(web3.utils.fromWei(amount)),
      exhibitId: parseInt(exId),
    }))
    .filter((b: Bid) => !checkEmptyAddress(b.from as string));
};

export const getContractBidForExhibit = async (exhibitId: number) => {
  const { contract, web3 } = getServerContract();
  const b = await contract.methods.getBid(exhibitId).call();
  return !checkEmptyAddress(b.fromAddress)
    ? ({
        from: b.fromAddress,
        amount: parseFloat(web3.utils.fromWei(b.amount)),
      } as Bid)
    : undefined;
};
