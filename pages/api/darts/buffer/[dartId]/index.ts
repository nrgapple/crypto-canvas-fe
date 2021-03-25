import { NextApiRequest, NextApiResponse } from "next";
import { getDartImage } from "../../../../../services";
import NextCors from "nextjs-cors";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await NextCors(req, res, {
    // Options
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });
  const { dartId } = req.query;
  try {
    const dartIdNumber = parseInt(dartId as string);
    console.log(dartIdNumber);

    const image = await getDartImage(dartIdNumber, 0);
    res.send(image);
    return;
  } catch (e) {
    res.status(400).send(e);
    return;
  }
}
