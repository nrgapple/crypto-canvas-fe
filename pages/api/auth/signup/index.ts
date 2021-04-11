import { NextApiHandler } from "next";
import prisma from "../../../../lib/prisma";

const Signup: NextApiHandler = async (req, res) => {
  if (req.method !== "POST") res.status(404).send({});
  const { publicAddress } = JSON.parse(req.body);

  const user = await prisma.user.create({
    data: {
      wallet: publicAddress,
      nonce: 0,
    },
  });
  if (user) {
    res.status(200).send({ nonce: 0 });
  } else {
    res.status(400).send({ error: "Error" });
  }
};

export default Signup;
