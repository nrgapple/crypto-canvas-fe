import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { WorldStateType } from "../interfaces";
import { worldState } from "../state";
import { viewport } from "../utils";

export const useViewportEventListener = (
  event: string | symbol,
  callback: Function,
  active: boolean,
  listen: any[]
) => {
  useEffect(() => {
    if (active) {
      viewport.addListener(event, callback);
      return () => {
        if (viewport) viewport.removeListener(event, callback);
      };
    }
  }, [active, callback, ...listen]);
};
