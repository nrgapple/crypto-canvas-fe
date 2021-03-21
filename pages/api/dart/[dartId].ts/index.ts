import { NextApiRequest, NextApiResponse } from "next";
import { getDart, getDartImage } from "../../../../services";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { dartId } = req.query;
  try {
    const dartIdNumber = parseInt(dartId as string);
    const metaData = await getDart(dartIdNumber);
    res.status(200).send(JSON.stringify(metaData));
    return;
  } catch (e) {
    res.status(400).send(e);
    return;
  }
}
