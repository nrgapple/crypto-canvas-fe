import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import multer from "multer";
import { promises as fs } from "fs";
import { imageMeta, resizeImage } from "../../../utils/node-helpers";

type NowRequestWithFile = NextApiRequest & {
  file: Express.Multer.File;
};

// initialize api-route handler
const handler = nextConnect();

// configure multer for file upload
// store uploaded image on temporary directory of serverless function
const upload = multer({ dest: "/tmp" });

// use multer middleware
handler.use(upload.single("file"));

handler.post(async (req: NowRequestWithFile, res: NextApiResponse) => {
  if (req.method === "POST" && req.file) {
    try {
      const data = await fs.readFile(req.file.path);
      const meta = await imageMeta(data);

      res.send(JSON.stringify(meta));
    } catch (e) {
      console.log(e);
    }
    res.end();
    return;
  }
  res.end();
  return;
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
