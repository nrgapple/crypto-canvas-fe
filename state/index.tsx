import { atom } from "recoil";
import { Dart } from "../interfaces";
import { localStorageEffect } from "./utils";

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

export const authTokenState = atom({
  key: "auth-token",
  default: undefined as string | undefined,
  effects_UNSTABLE: [localStorageEffect("auth_token")],
});
