import * as PIXI from "pixi.js";
import { Viewport } from "pixi-viewport";
import { Pixel } from "../interfaces";
PIXI.settings.ROUND_PIXELS = true;
export const app = new PIXI.Application();
export const SIZE = 10;

export const viewport = new Viewport({
  worldWidth: SIZE,
  worldHeight: SIZE,
  interaction: app.renderer.plugins.interaction, // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
});

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
