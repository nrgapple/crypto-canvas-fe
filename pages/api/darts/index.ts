import { NextApiRequest, NextApiResponse } from "next";
import { getAllDarts, getServerContract } from "../../../services";

export default async function handle(res: NextApiResponse) {
  const darts = await getAllDarts();
  res.send(darts);
}
