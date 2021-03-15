import { NextApiRequest, NextApiResponse } from "next";
import Web3 from "web3";
import { config } from "../../../app.config";

import { contractExhibitsRespToPixels } from "../../../utils/helpers";
import { getServerContract } from "../../services";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const contract = getServerContract();
  const exResp = await contract.methods.getPixels().call();
  const newPixels = contractExhibitsRespToPixels(exResp);
  console.log(newPixels);
  res.end();
}
