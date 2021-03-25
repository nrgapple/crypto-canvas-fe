import sharp from "sharp";

export const imageToWebp = async (buffer: Buffer) => {
  const image = sharp(Buffer.from(buffer));
  console.log("image", image);
  const webpBuffer = await image.webp().toBuffer();
  return webpBuffer;
};
