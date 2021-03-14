import { Pixel } from "../interfaces";

export const checkEmptyAddress = (address: string) => /^0x0+$/.test(address);

export const contractAddress = "0xD4FF17C5994Ce3921eCFfE0eD4eE4e47eA459453";
export const ETH_SYMBOL = "Ξ";

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
