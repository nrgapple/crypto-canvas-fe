import { NextApiHandler } from "next";
import prisma from "../../../lib/prisma";

const User: NextApiHandler = async (req, res) => {
  if (req.method !== "GET") res.status(404).send({});
  const publicAddress = req.query.publicAddress as string;
  const user = await prisma.user.findFirst({
    where: { wallet: publicAddress },
  });
  if (user) {
    res.status(200).send({ nonce: user.nonce });
    prisma.user.update({
      where: { wallet: publicAddress },
      data: { nonce: (user.nonce += 1) },
    });
  } else {
    return res.status(400).send({ error: "Error" });
  }
};

export default User;
