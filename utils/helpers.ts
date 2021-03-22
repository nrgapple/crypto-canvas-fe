import hexRgb from "hex-rgb";
import rgbHex from "rgb-hex";
import {
  Bounds,
  ContractExhibitResp,
  ContractPixelData,
  Coord,
  DartRaw,
  Dimensions,
  Pixel,
} from "../interfaces";

export const checkEmptyAddress = (address: string) => /^0x0+$/.test(address);

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

export const midpoint = ([x1, y1]: number[], [x2, y2]: number[]) => [
  (x1 + x2) / 2,
  (y1 + y2) / 2,
];

export const pointsToContractData = (pixels: Pixel[]) => {
  const { max, min } = getMaxMinPoints(pixels);
  const pixelsSorted = [...pixels].sort((a, b) =>
    a.y === b.y ? a.x - b.x : a.y - b.y
  );
  const rgbArray: number[] = [];
  pixelsSorted.forEach((p) => {
    const rgb = hexRgb(p.hexColor, { format: "array" });
    rgbArray.push(rgb[0]);
    rgbArray.push(rgb[1]);
    rgbArray.push(rgb[2]);
  });

  const bounds = {
    topLeft: {
      x: min[0],
      y: min[1],
    },
    bottomRight: { x: max[0], y: max[1] },
  } as Bounds;

  return {
    bounds,
    rgbArray,
  } as ContractPixelData;
};

export const pointsToDartRaw = (pixels: Pixel[]) => {
  const { max, min } = getMaxMinPoints(pixels);
  const pixelsSorted = [...pixels].sort((a, b) =>
    a.y === b.y ? a.x - b.x : a.y - b.y
  );
  const rgbaArray: number[] = [];
  pixelsSorted.forEach((p) => {
    const rgba = hexRgb(p.hexColor, { format: "array" });
    rgbaArray.push(rgba[0]);
    rgbaArray.push(rgba[1]);
    rgbaArray.push(rgba[2]);
    rgbaArray.push(rgba[3]);
  });

  const dimensions = {
    height: max[1] - min[1] + 1,
    width: max[0] - min[0] + 1,
  } as Dimensions;

  return {
    rgbaArray,
    dimensions,
  } as DartRaw;
};

export const contractExhibitsRespToPixels = (exRes: ContractExhibitResp[]) => {
  const newPixels: Pixel[] = [];
  exRes.forEach(
    ({
      rgbArray,
      bounds,
      owner,
      exhibitId,
    }: {
      rgbArray: string[];
      bounds: {
        topLeft: { x: string; y: string };
        bottomRight: { x: string; y: string };
      };
      owner: string;
      exhibitId: string;
    }) => {
      let count = 0;

      const newBounds = {
        topLeft: {
          x: parseInt(bounds.topLeft.x),
          y: parseInt(bounds.topLeft.y),
        },
        bottomRight: {
          x: parseInt(bounds.bottomRight.x),
          y: parseInt(bounds.bottomRight.y),
        },
      } as Bounds;
      const width = newBounds.bottomRight.x - newBounds.topLeft.x + 1;
      for (let i = 0; i < rgbArray.length; i += 3) {
        const hex = `#${rgbHex(
          parseInt(rgbArray[i]),
          parseInt(rgbArray[i + 1]),
          parseInt(rgbArray[i + 2])
        )}`;
        newPixels.push({
          x: newBounds.topLeft.x + (count % width),
          y: newBounds.topLeft.y + Math.floor(count / width),
          hexColor: hex,
          owner,
          exhibitId: parseInt(exhibitId),
        } as Pixel);
        count++;
      }
    }
  );
  return newPixels;
};

export const increaseResolution = (
  data: string[],
  resolution: number
): number[] => {
  let expandedData: number[] = [];
  for (let p = 0; p < data.length; p += 4) {
    for (let t = 0; t < resolution; t++) {
      expandedData.push(
        parseInt(data[p]),
        parseInt(data[p + 1]),
        parseInt(data[p + 2]),
        255
      );
    }
  }

  return expandedData;
};
