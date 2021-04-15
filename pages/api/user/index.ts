import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import jwt from "jsonwebtoken";

const User: NextApiHandler = async (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "") as string;
  const data = jwt.verify(token, process.env.JWT_SECRET!) as any;
  const id = data.payload.id as number;

  switch (req.method) {
    case "GET":
      return getUser(res, id);
    case "POST":
      return postUser(req, res, id);
    default:
      return res.status(404).send({});
  }
};

const getUser = async (res: NextApiResponse, id: number) => {
  const user = await prisma.user.findFirst({
    where: { id: id },
    include: { profile: true },
  });
  if (user) {
    return res.status(200).send({ user: user });
  } else {
    return res.status(400).send({ error: "Error" });
  }
};

const postUser = async (
  req: NextApiRequest,
  res: NextApiResponse,
  id: number,
) => {
  const { username, about } = JSON.parse(req.body);
  const profile = await prisma.user.update({
    where: { id },
    data: {
      profile: {
        update: { username, about },
      },
    },
    include: { profile: true },
  });
  res.status(200).send(profile);
};

export default User;
