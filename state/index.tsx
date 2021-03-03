import { atom } from "recoil";
import { Pixel } from "../interfaces";
import { localStorageEffect } from "./utils";
import { EventData } from "web3-eth-contract";

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

export const worldError = atom({
  key: "world-error",
  default: "",
});

export const selectedBlockState = atom({
  key: "selected-block",
  default: undefined as number | undefined,
});

export const transactionsInSessionState = atom({
  key: "transactions-in-session",
  default: [] as EventData[],
});
