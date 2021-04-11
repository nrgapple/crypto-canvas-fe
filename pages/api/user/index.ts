import { NextApiHandler } from "next";
import prisma from "../../../lib/prisma";
import jwt from "jsonwebtoken";

const User: NextApiHandler = async (req, res) => {
  if (req.method !== "GET") res.status(404).send({});
  const token = req.headers.authorization?.replace("Bearer ", "") as string;
  console.log(token);

  const data = jwt.verify(token, process.env.JWT_SECRET!) as any;
  const id = data.payload.id;
  console.log(data.payload.id);

  const user = await prisma.user.findFirst({
    where: { id: id },
  });
  if (user) {
    res.status(200).send({ user: user });
  } else {
    return res.status(400).send({ error: "Error" });
  }
};

export default User;
