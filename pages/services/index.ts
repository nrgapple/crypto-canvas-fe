import { config } from "../../app.config";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import PixelToken from "../../contracts/PixelToken.json";
import { contractExhibitsRespToPixels } from "../../utils/helpers";

export const getServerContract = () => {
  const provider = new Web3.providers.HttpProvider(config.infuraProviderUri);
  const web3 = new Web3(provider);
  return new web3.eth.Contract(
    PixelToken.abi as AbiItem[] | AbiItem,
    config.contractAddress
  );
};

export const getContractPixels = async () => {
  const contract = getServerContract();
  const exResp = await contract.methods.getPixels().call();
  const newPixels = contractExhibitsRespToPixels(exResp);
  return newPixels;
};
