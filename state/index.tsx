import { atom } from "recoil";
import { Bid, Dart, Pixel, WorldStateType } from "../interfaces";
import { localStorageEffect } from "./utils";
import { Contract } from "web3-eth-contract/types";
import Web3 from "web3";

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

export const centerState = atom({
  key: "center",
  default: false,
});

export const moveExhibitState = atom({
  key: "move-exhibit",
  default: false,
});

export const showConnectPageState = atom({
  key: "show-connect-page",
  default: false,
});

export const wasSignedInState = atom({
  key: "was-signed-in",
  default: false,
  effects_UNSTABLE: [localStorageEffect("was_signed_in")],
});

export const dartsState = atom({
  key: "darts",
  default: [] as Dart[],
});
