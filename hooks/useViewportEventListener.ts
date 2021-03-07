import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { WorldStateType } from "../interfaces";
import { worldState } from "../state";
import { viewport } from "../utils";

export const useViewportEventListener = (
  event: string | symbol,
  callback: Function,
  worldStateType: WorldStateType
) => {
  const world = useRecoilValue(worldState);
  useEffect(() => {
    if (world === worldStateType) {
      viewport.addListener(event, callback);
      return () => {
        if (viewport) viewport.removeListener(event, callback);
      };
    }
  }, [worldStateType, callback, world]);
};
