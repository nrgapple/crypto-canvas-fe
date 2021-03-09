import { atom } from "recoil";
import { Bid, Pixel, WorldStateType } from "../interfaces";
import { localStorageEffect } from "./utils";

export const pixelsState = atom({
  key: "pixels",
  default: [] as Pixel[],
});

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

export const selectedExhibitState = atom({
  key: "selected-exhibit",
  default: undefined as number | undefined,
});

export const editedExhibitState = atom({
  key: "edited-exhibit",
  default: [] as Pixel[],
});

export const allBidsState = atom({
  key: "all-bids",
  default: [] as Bid[],
});
