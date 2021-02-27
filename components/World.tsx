import React, { useEffect, useState, useRef, useCallback } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { Pixel } from "../interfaces";
import { currentColorState, isEditState, selectedPixelsState } from "../state";

import { SIZE, viewport } from "../utils/index";
import { displayScreen, updateWorld } from "../utils/viewport";

interface Props {
  pixels: Pixel[];
}

const World = ({ pixels }: Props) => {
  const [currPixels, setCurrPixels] = useState<Pixel[]>(pixels);
  const [selectedPixels, setSelectedPixels] = useRecoilState(
    selectedPixelsState
  );
  const currentColor = useRecoilValue(currentColorState);
  const worldRef = useRef<HTMLDivElement>(null);
  const isEdit = useRecoilValue(isEditState);

  console.log(pixels);

  const handleClicked = useCallback(
    (el) => {
      if (isEdit) {
        const newPoint = {
          x: Math.floor(el.world.x),
          y: Math.floor(el.world.y),
          hexColor: currentColor,
        } as Pixel;
        let selected;
        const match = (s: Pixel) => newPoint.x === s.x && newPoint.y === s.y;
        const notMatch = (s: Pixel) => !match(s);
        // clicked an already selected pixel?
        if (selectedPixels.some(match)) {
          selected = selectedPixels.filter(notMatch);
          setSelectedPixels(selected);
        } else {
          selected = [...selectedPixels, newPoint];
          setSelectedPixels(selected);
        }
      }
    },
    [currentColor, isEdit, selectedPixels]
  );

  useEffect(() => {
    viewport.addListener("clicked", handleClicked);
    return () => {
      if (viewport) viewport.removeListener("clicked", handleClicked);
    };
  }, [handleClicked]);

  useEffect(() => {
    displayScreen(worldRef.current!);
    viewport.screenWidth = worldRef.current!.offsetWidth;
    viewport.screenHeight = worldRef.current!.offsetHeight;
    viewport.clamp({ direction: "all" });
    viewport.clampZoom({
      maxHeight: SIZE + SIZE * 0.5,
      maxWidth: SIZE + SIZE * 0.5,
      minHeight: 5,
      minWidth: 5,
    });
    viewport.fit();
  }, []);

  useEffect(() => {
    console.log(currPixels);

    updateWorld(currPixels);
  }, [currPixels]);

  useEffect(() => {
    if (!isEdit) {
      setCurrPixels(pixels);
    } else {
      setCurrPixels([...pixels, ...selectedPixels]);
    }
  }, [isEdit]);

  useEffect(() => {
    if (isEdit) {
      setCurrPixels([...pixels, ...selectedPixels]);
    }
  }, [selectedPixels]);

  useEffect(() => {
    setCurrPixels(pixels);
  }, [pixels]);

  return (
    <div
      style={{
        padding: "16px",
        border: "1px solid black",
      }}
      ref={worldRef}
      className="world"
    ></div>
  );
};

export default World;
