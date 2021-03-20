import { NextApiRequest, NextApiResponse } from "next";
import { DartResp } from "../../../interfaces";
import { getServerContract } from "../../../services";
import { contractExhibitsRespToPixels } from "../../../utils/helpers";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { tokenId },
  } = req;
  if (tokenId) {
    const { contract } = getServerContract();
    const dartResp = (await contract.methods
      .getDart(tokenId)
      .call()) as DartResp;
  }
}
