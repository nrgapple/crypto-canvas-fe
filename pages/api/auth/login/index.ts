import { bufferToHex } from "ethereumjs-util";
import { recoverPersonalSignature } from "eth-sig-util";
import { NextApiHandler } from "next";
import prisma from "../../../../lib/prisma";
import jwt from "jsonwebtoken";
import { config } from "../../../../app.config";

const Login: NextApiHandler = async (req, res) => {
  if (req.method !== "POST") res.status(404).send({});
  const { signature, publicAddress } = JSON.parse(req.body);
  if (!signature || !publicAddress)
    return res
      .status(400)
      .send({ error: "Request does not include signature and public address" });

  const user = await prisma.user.findUnique({
    where: { wallet: publicAddress },
  });

  if (!user) return res.status(401).send({ error: "User not found" });

  const msg = `${config.signMsg} ${user.id}`;
  const msgBufferHex = bufferToHex(Buffer.from(msg, "utf8"));

  const address = recoverPersonalSignature({
    data: msgBufferHex,
    sig: signature,
  });
  if (address.toLowerCase() !== publicAddress.toLowerCase()) {
    return res.status(401).send({ error: "Signature not verified" });
  }
  const token = jwt.sign(
    {
      payload: {
        id: user.id,
        publicAddress,
      },
    },
    process.env.JWT_SECRET!,
    { algorithm: "HS256" },
  );
  return res.status(200).send({ token });
};

export default Login;
