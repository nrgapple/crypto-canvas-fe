import { NextApiRequest, NextApiResponse } from "next";
import Web3 from "web3";
import { config } from "../../../app.config";
import { AbiItem } from "web3-utils";
import PixelToken from "../../../contracts/PixelToken.json";
import { contractExhibitsRespToPixels } from "../../../utils/helpers";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const provider = new Web3.providers.HttpProvider(config.infuraProviderUri);
  const web3 = new Web3(provider);
  const contract = new web3.eth.Contract(
    PixelToken.abi as AbiItem[] | AbiItem,
    config.contractAddress
  );
  const exResp = await contract.methods.getPixels().call();
  const newPixels = contractExhibitsRespToPixels(exResp);
  console.log(newPixels);
  res.end();
}
