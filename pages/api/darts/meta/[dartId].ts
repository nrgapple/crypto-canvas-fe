import { NextApiRequest, NextApiResponse } from "next";
import { getDartMetaData } from "../../../../services";
import NextCors from "nextjs-cors";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await NextCors(req, res, {
    // Options
    methods: ["GET"],
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });
  const { dartId } = req.query;
  try {
    const dartIdNumber = parseInt(dartId as string);
    const metaData = await getDartMetaData(dartIdNumber);
    res.status(200).send(JSON.stringify(metaData));
    return;
  } catch (e) {
    res.status(400).send(e);
    return;
  }
}
