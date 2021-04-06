import { NextApiHandler } from "next";
import prisma from "../../../../lib/prisma";

const Signup: NextApiHandler = async (req, res) => {
  if (req.method !== "POST") res.status(404).send({});
  const { publicAddress } = req.body;
  const user = await prisma.user.create({
    data: {
      wallet: publicAddress,
    },
  });
  if (user) {
    res.status(201).send({});
  } else {
    res.status(400).send({ error: "Error" });
  }
};

export default Signup;
