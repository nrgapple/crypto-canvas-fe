import { Coord, Pixel } from "../interfaces";

export const checkEmptyAddress = (address: string) => /^0x0+$/.test(address);

export const contractAddress = "0x00EbDb4b33c21f4b1F6c43852840Df8207bdBBF7";
export const ETH_SYMBOL = "Ξ";
export const SIZE = 50;

export const getMaxMinPoints = (pixels: Pixel[]) => {
  const xMax = Math.max(...pixels.map((p) => p.x));
  const yMax = Math.max(...pixels.map((p) => p.y));
  const xMin = Math.min(...pixels.map((p) => p.x));
  const yMin = Math.min(...pixels.map((p) => p.y));
  return {
    max: [xMax, yMax],
    min: [xMin, yMin],
  };
};

export const checkIsRect = (pixels: Pixel[]) => {
  const { max, min } = getMaxMinPoints(pixels);
  for (let x = min[0]; x <= max[0]; x++)
    for (let y = min[1]; y <= max[1]; y++) {
      if (!pixels.some((p) => p.x === x && p.y === y)) return false;
    }
  return true;
};

export const createImageFromPixels = (pixels: Pixel[], scale: number = 100) =>
  new Promise((res, rej) => {
    const { max, min } = getMaxMinPoints(pixels);

    const width = max[0] - min[0] + 1;
    const height = max[1] - min[1] + 1;
    const pixelsSorted = pixels.sort((a, b) =>
      a.y === b.y ? a.x - b.x : a.y - b.y
    );

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = width * scale;
    canvas.height = height * scale;

    if (ctx) {
      for (let y = 0; y < height; y++)
        for (let x = 0; x < width; x++) {
          const pixel = pixelsSorted[y * width + x];
          ctx.fillStyle = pixel.hexColor;
          ctx.fillRect(x * scale, y * scale, scale, scale);
        }
      const dataUri = canvas.toDataURL();
      canvas.remove();
      res(dataUri);
    } else {
      console.error(`ctx not defined.`);
      rej(null);
    }
  });

export const moveToPoint = (pixels: Pixel[], point: Coord) => {
  const { min, max } = getMaxMinPoints(pixels);
  const height = max[1] - min[1];
  const width = max[0] - min[0];
  if (width + point.x >= SIZE || height + point.y >= SIZE) {
    throw new Error("Out of bounds");
  }
  return pixels.map(
    (p) =>
      ({
        ...p,
        x: p.x + (point.x - min[0]),
        y: p.y + (point.y - min[1]),
      } as Pixel)
  );
};
