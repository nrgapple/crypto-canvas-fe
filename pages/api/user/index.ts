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
    default:
      return res.status(404).send({});
  }
};

const getUser = async (res: NextApiResponse, id: number) => {
  const user = await prisma.user.findFirst({
    where: { id: id },
  });
  if (user) {
    return res.status(200).send({ user: user });
  } else {
    return res.status(400).send({ error: "Error" });
  }
};

const postUser = async (res: NextApiResponse, body: any, id: number) => {
  
}

export default User;
