import hexRgb from "hex-rgb";
import { DartRaw, Dimensions, Pixel } from "../interfaces";

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

export const pointsToDartRaw = (pixels: Pixel[]) => {
  const { max, min } = getMaxMinPoints(pixels);
  const pixelsSorted = [...pixels].sort((a, b) =>
    a.y === b.y ? a.x - b.x : a.y - b.y,
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

export const displayUserId = (longId: string) =>
  longId.replace(/0x/, "").slice(0, 6);

export const bufferToHex = (buffer: Buffer) => {
  return [...new Uint8Array(buffer)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};
