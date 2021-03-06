import * as PIXI from "pixi.js";
import { Viewport } from "pixi-viewport";
import { SIZE } from "./helpers";
PIXI.settings.ROUND_PIXELS = true;
export const app = new PIXI.Application();

export const viewport = new Viewport({
  worldWidth: SIZE,
  worldHeight: SIZE,
  interaction: app.renderer.plugins.interaction, // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
});
