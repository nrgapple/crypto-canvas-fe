import { NextApiRequest, NextApiResponse } from "next";
import { getDartImage } from "../../../../../services";
import NextCors from "nextjs-cors";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  NextCors(req, res, {
    // Options
    methods: ["GET"],
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });
  const { dartId } = req.query;
  try {
    const dartIdNumber = parseInt(dartId as string);
    const image = await getDartImage(dartIdNumber, 10);
    res.status(200).send(image);
    console.log("here");

    return;
  } catch (e) {
    res.status(400).send(e);
    return;
  }
}
