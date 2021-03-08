import { app, getMaxMinPoints, SIZE, viewport } from "./index";
import * as PIXI from "pixi.js";
import hexRgb from "hex-rgb";
import { Pixel } from "../interfaces";
//@ts-ignore
import avgColor from "@bencevans/color-array-average";

export const displayScreen = (el: Element) => {
  el.appendChild(app.view);
  // add the viewport to the stage
  app.stage.addChild(viewport);
  app.renderer.backgroundColor = 0xeeeeee;
  // activate plugins
  viewport.drag().pinch().wheel().decelerate().fitWorld();
  return app.view;
};

let spriteCache: PIXI.Sprite | undefined = undefined;

export const updateWorld = (pixels: Pixel[]) => {
  let buffer = new Uint8Array(SIZE * SIZE * 4);
  for (var yPlace = 0; yPlace < SIZE; yPlace++) {
    for (var xPlace = 0; xPlace < SIZE; xPlace++) {
      var pos = (yPlace * SIZE + xPlace) * 4; // position in buffer based on x and y
      const pixel = pixels.find((p) => p.x === xPlace && p.y === yPlace);
      let rgbColor = pixel
        ? hexRgb(pixel.hexColor, { format: "array" })
        : [255, 255, 255, 255];
      rgbColor = rgbColor.map((x) => x);
      rgbColor[3] = 255;
      buffer[pos] = rgbColor[0]; // some R value
      buffer[pos + 1] = rgbColor[1]; // some G value
      buffer[pos + 2] = rgbColor[2]; // some B value
      buffer[pos + 3] = rgbColor[3]; // set alpha channel
    }
  }
  const mainTexture = PIXI.Texture.fromBuffer(buffer, SIZE, SIZE);
  if (spriteCache) {
    viewport.removeChild(spriteCache);
  }

  spriteCache = viewport.addChildAt(new PIXI.Sprite(mainTexture), 0);
  spriteCache.width = SIZE;
  spriteCache.height = SIZE;
  spriteCache.position.set(0, 0);
};

export const updateSelectedExhibitLine = (pixels: Pixel[]) => {
  updateLine(pixels, "selected-exhibit-line");
};

export const updateExhibitLine = (pixels: Pixel[]) => {
  updateLine(pixels, "exhibit-line");
};

export const updateBorderLine = (pixels: Pixel[]) => {
  updateLine(pixels, "border-line");
};

export const updateLine = (pixels: Pixel[], name: string) => {
  viewport.removeChild(viewport.getChildByName(name));
  if (pixels.length < 1) {
    return;
  }
  const { max, min } = getMaxMinPoints(pixels);

  const color = invertColor(avgColor(pixels.map((x) => x.hexColor)), false);

  const line = new PIXI.Graphics();
  line.name = name;
  line.lineStyle(0.1, parseInt(color.substring(1), 16), 1);
  line.moveTo(min[0], min[1]);
  line.lineTo(max[0] + 1, min[1]);
  line.lineTo(max[0] + 1, max[1] + 1);
  line.lineTo(min[0], max[1] + 1);
  line.lineTo(min[0], min[1]);

  viewport.addChild(line);
};

const padZero = (str: string, len: number = 2) => {
  var zeros = new Array(len).join("0");
  return (zeros + str).slice(-len);
};

export const invertColor = (hex: string, bw: boolean) => {
  if (hex.indexOf("#") === 0) {
    hex = hex.slice(1);
  }
  // convert 3-digit hex to 6-digits.
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) {
    throw new Error("Invalid HEX color.");
  }
  var r: string | number = parseInt(hex.slice(0, 2), 16),
    g: string | number = parseInt(hex.slice(2, 4), 16),
    b: string | number = parseInt(hex.slice(4, 6), 16);
  if (bw) {
    // http://stackoverflow.com/a/3943023/112731
    return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? "#000000" : "#FFFFFF";
  }
  // invert color components
  r = (255 - r).toString(16);
  g = (255 - g).toString(16);
  b = (255 - b).toString(16);
  // pad each with zeros and return
  return "#" + padZero(r) + padZero(g) + padZero(b);
};
