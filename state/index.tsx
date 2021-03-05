import { atom } from "recoil";
import { Pixel, WorldStateType } from "../interfaces";
import { localStorageEffect } from "./utils";

export const selectedPixelsState = atom({
  key: "selected-pixels",
  default: [] as Pixel[],
  effects_UNSTABLE: [localStorageEffect("selected_pixels")],
});

export const currentColorState = atom({
  key: "current-color",
  default: "#eb4034",
  effects_UNSTABLE: [localStorageEffect("current_color")],
});

export const worldState = atom({
  key: "world",
  default: WorldStateType.view,
});

export const worldError = atom({
  key: "world-error",
  default: "",
});

export const selectedBlockState = atom({
  key: "selected-block",
  default: undefined as number | undefined,
});

export const editedBlockState = atom({
  key: "edited-block",
  default: [] as Pixel[],
});
