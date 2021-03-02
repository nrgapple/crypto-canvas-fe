import React, { useEffect, useState, useRef, useCallback } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { Pixel } from "../interfaces";
import {
  currentColorState,
  isEditState,
  selectedPixelsState,
  worldError,
} from "../state";

import { app, checkIsRect, SIZE, viewport } from "../utils/index";
import {
  displayScreen,
  updateBorderLine,
  updateWorld,
} from "../utils/viewport";
//@ts-ignore
import MouseTooltip from "react-sticky-mouse-tooltip";
import useMouse from "@react-hook/mouse-position";
import { Point } from "pixi.js";

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
  const canvasRef = useRef<HTMLCanvasElement>(app.view);
  const isEdit = useRecoilValue(isEditState);
  const [overPixel, setOverPixel] = useState<Pixel | undefined>(undefined);
  const mouse = useMouse(canvasRef, {
    fps: 10,
  });
  const setWorldError = useSetRecoilState(worldError);

  const checkForErrors = () => {
    setWorldError(
      !checkIsRect(selectedPixels) ? "Must be a closed rectangle of pixels" : ""
    );
  };

  const handleClickedEdit = useCallback(
    (el) => {
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
    },
    [currentColor, isEdit, selectedPixels]
  );

  useEffect(() => {
    const worldPoint = viewport.toWorld(new Point(mouse.x!, mouse.y!));
    const worldPointFloored = {
      x: Math.floor(worldPoint.x),
      y: Math.floor(worldPoint.y),
    };
    const match = (s: Pixel) =>
      worldPointFloored.x === s.x && worldPointFloored.y === s.y;
    const pixel = pixels.find(match);
    if (pixel) {
      setOverPixel(pixel);
    } else {
      setOverPixel(undefined);
    }
  }, [mouse]);

  useEffect(() => {
    if (isEdit) {
      viewport.addListener("clicked", handleClickedEdit);
      return () => {
        if (viewport) viewport.removeListener("clicked", handleClickedEdit);
      };
    }
  }, [handleClickedEdit, isEdit]);

  useEffect(() => {
    const canvas = displayScreen(worldRef.current!);
    viewport.screenWidth = worldRef.current!.offsetWidth;
    viewport.screenHeight = worldRef.current!.offsetHeight;
    viewport.clamp({ direction: "all" });
    viewport.clampZoom({
      maxHeight: SIZE + SIZE * 1,
      maxWidth: SIZE + SIZE * 1,
      minHeight: 5,
      minWidth: 5,
    });
    viewport.fit();
    canvasRef.current = canvas;
  }, []);

  useEffect(() => {
    updateWorld(currPixels);
  }, [currPixels]);

  useEffect(() => {
    if (!isEdit) {
      setCurrPixels(pixels);
      updateBorderLine([]);
    } else {
      setCurrPixels([...pixels, ...selectedPixels]);
      updateBorderLine(selectedPixels);
      checkForErrors();
    }
  }, [isEdit]);

  useEffect(() => {
    if (isEdit) {
      setCurrPixels([...pixels, ...selectedPixels]);
      updateBorderLine(selectedPixels);
      checkForErrors();
    }
  }, [selectedPixels]);

  useEffect(() => {
    setCurrPixels(pixels);
  }, [pixels]);

  return (
    <>
      <div
        style={{
          padding: "16px",
          border: "1px solid black",
        }}
        ref={worldRef}
        className="world"
      ></div>
      <MouseTooltip
        visible={overPixel != undefined}
        offsetX={15}
        offsetY={10}
        style={{
          zIndex: "1000",
        }}
      >
        <div
          style={{
            background: overPixel?.hexColor,
            padding: "2px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "auto auto",
              gap: "2px",
              background: "#fff",
              margin: "2px",
            }}
          >
            <div>Owner: </div>
            <div>{overPixel?.owner}</div>
            <div>Image Id: </div>
            <div>{overPixel?.creatorId}</div>
            <div>Point: </div>
            <div>{`{${overPixel?.x}, ${overPixel?.y}}`}</div>
          </div>
        </div>
      </MouseTooltip>
    </>
  );
};

export default World;
