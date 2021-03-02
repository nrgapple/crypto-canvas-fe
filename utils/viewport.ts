import { app, getMaxMinPoints, SIZE, viewport } from "./index";
import * as PIXI from "pixi.js";
import hexRgb from "hex-rgb";
import { Pixel } from "../interfaces";

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
let borderLine: PIXI.Graphics | undefined = undefined;

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

export const updateBorderLine = (pixels: Pixel[]) => {
  viewport.removeChild(borderLine!);
  if (pixels.length < 1) {
    return;
  }
  const { max, min } = getMaxMinPoints(pixels);

  borderLine = new PIXI.Graphics();
  borderLine.lineStyle(0.1, 0xd5402b, 1);
  borderLine.moveTo(min[0], min[1]);
  borderLine.lineTo(max[0] + 1, min[1]);
  borderLine.lineTo(max[0] + 1, max[1] + 1);
  borderLine.lineTo(min[0], max[1] + 1);
  borderLine.lineTo(min[0], min[1]);
  viewport.addChildAt(borderLine, 0);
};
