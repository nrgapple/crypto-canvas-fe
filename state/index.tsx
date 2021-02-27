import { atom } from "recoil";
import { Pixel } from "../interfaces";
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

export const isEditState = atom({
  key: "is-edit",
  default: false,
});
