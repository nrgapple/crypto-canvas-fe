import { NextApiRequest, NextApiResponse } from "next";
import { contractExhibitsRespToPixels } from "../../../utils/helpers";
import { getServerContract } from "../../../services";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { contract } = getServerContract();
  const exResp = await contract.methods.getPixels().call();
  const newPixels = contractExhibitsRespToPixels(exResp);
  console.log(newPixels);
  res.end();
}
