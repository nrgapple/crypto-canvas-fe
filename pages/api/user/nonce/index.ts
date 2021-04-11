import { NextApiHandler } from "next";
import prisma from "../../../../lib/prisma";

const UserNonce: NextApiHandler = async (req, res) => {
  if (req.method !== "GET") res.status(404).send({});
  const publicAddress = req.query.publicAddress as string;
  const user = await prisma.user.findFirst({
    where: { wallet: publicAddress },
  });
  if (user) {
    const nonce = user.nonce;
    prisma.user.update({
      where: { wallet: publicAddress },
      data: { nonce: nonce + 1 },
    });
    return res.status(200).send({ nonce });
  } else {
    return res.status(400).send({ error: "Error" });
  }
};

export default UserNonce;
