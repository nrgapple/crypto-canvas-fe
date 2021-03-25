import sharp from "sharp";

export const imageToWebp = async (buffer: Buffer) => {
  const image = sharp(buffer);
  const webpBuffer = await image.webp().toBuffer();
  return webpBuffer;
};

export const resizeImage = async (buffer: Buffer, size: number = 500) => {
  const image = sharp(buffer);
  const { height, width } = await image.metadata();
  if (height && width) {
    const min = Math.min(height, width);
    const diff = 500 - min > 0 ? 500 - min : 0;
    if (diff !== 0) {
      const resized = image.resize(width + diff, height + diff, {
        kernel: sharp.kernel.nearest,
        fit: "contain",
        position: "right top",
      });
      return await resized.toBuffer();
    }
  }
  return buffer;
};

export const imageMeta = async (buffer: Buffer) => {
  const image = sharp(buffer);
  return await image.metadata();
};
