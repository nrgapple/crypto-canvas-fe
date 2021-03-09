import React, { useEffect, useState, useRef, useCallback } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { Pixel, WorldStateType } from "../interfaces";
import {
  currentColorState,
  editedExhibitState,
  pixelsState,
  selectedExhibitState,
  selectedPixelsState,
  worldError,
  worldState,
} from "../state";

import { app, checkIsRect, SIZE, viewport } from "../utils/index";
import {
  displayScreen,
  updateExhibitLine,
  updateBorderLine,
  updateSelectedExhibitLine,
  updateWorld,
} from "../utils/viewport";
//@ts-ignore
import MouseTooltip from "react-sticky-mouse-tooltip";
import useMouse from "@react-hook/mouse-position";
import useComponentSize from "@rehooks/component-size";
import { useViewportEventListener } from "../hooks/useViewportEventListener";

interface Props {
  you: string;
}

const World = ({ you }: Props) => {
  const pixels = useRecoilValue(pixelsState);
  const [currPixels, setCurrPixels] = useState<Pixel[]>(pixels);
  const [selectedPixels, setSelectedPixels] = useRecoilState(
    selectedPixelsState
  );
  const currentColor = useRecoilValue(currentColorState);
  const worldRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(app.view);
  const world = useRecoilValue(worldState);
  const [overPixel, setOverPixel] = useState<Pixel | undefined>(undefined);
  const [overExhibit, setOverExibit] = useState<number | undefined>(undefined);
  const [selectedExhibit, setSelectedExhibit] = useRecoilState(
    selectedExhibitState
  );
  const [editedExhibit, setEditedExibit] = useRecoilState(editedExhibitState);
  const { width, height } = useComponentSize(worldRef);
  const mouse = useMouse(canvasRef, {
    fps: 10,
  });
  const setWorldError = useSetRecoilState(worldError);

  const checkForErrors = () => {
    setWorldError(
      !checkIsRect(selectedPixels) ? "Must be a closed rectangle of pixels" : ""
    );
  };

  const handleClickedCreate = useCallback(
    (el) => {
      const newPoint = {
        x: Math.floor(el.world.x),
        y: Math.floor(el.world.y),
        hexColor: currentColor,
      } as Pixel;
      let selected;
      const match = (s: Pixel) => newPoint.x === s.x && newPoint.y === s.y;
      const notMatch = (s: Pixel) => !match(s);
      if (pixels.some(match)) {
        return;
      }

      // clicked an already selected pixel?
      const matchedPixel = selectedPixels.find(match);
      if (matchedPixel) {
        if (matchedPixel.hexColor === newPoint.hexColor) {
          selected = selectedPixels.filter(notMatch);
        } else {
          selected = [...selectedPixels.filter(notMatch), newPoint];
        }
      } else {
        selected = [...selectedPixels, newPoint];
      }
      setSelectedPixels(selected);
    },
    [currentColor, selectedPixels]
  );

  const handleClickedEdit = useCallback(
    (el) => {
      const newPoint = {
        x: Math.floor(el.world.x),
        y: Math.floor(el.world.y),
        hexColor: currentColor,
        exhibitId: selectedExhibit,
        owner: you,
      } as Pixel;
      let edited;
      const match = (s: Pixel) =>
        newPoint.x === s.x &&
        newPoint.y === s.y &&
        newPoint.exhibitId === s.exhibitId &&
        newPoint.owner === s.owner;
      const notMatch = (s: Pixel) => !match(s);

      const matchedPixel = editedExhibit.find(match);
      if (matchedPixel) {
        if (matchedPixel.hexColor === newPoint.hexColor) {
          edited = editedExhibit.filter(notMatch);
        } else {
          edited = [...editedExhibit.filter(notMatch), newPoint];
        }
        setEditedExibit(edited);
      } else if (pixels.some(match)) {
        const otherPixel = pixels.find(match);
        newPoint.pixelId = otherPixel?.pixelId;
        edited = [...editedExhibit, newPoint];
        setEditedExibit(edited);
      }
    },
    [currentColor, editedExhibit, pixels, selectedExhibit]
  );

  const handleClickedDetail = useCallback(
    (el) => {
      const newPoint = {
        x: Math.floor(el.world.x),
        y: Math.floor(el.world.y),
        hexColor: currentColor,
      } as Pixel;
      const match = (s: Pixel) => newPoint.x === s.x && newPoint.y === s.y;
      const pixel = pixels.find(match);
      if (pixel) {
        setSelectedExhibit(pixel.exhibitId);
      } else {
        setSelectedExhibit(undefined);
      }
    },
    [pixels]
  );

  useEffect(() => {
    if (selectedExhibit != undefined) {
      updateSelectedExhibitLine(
        pixels.filter((p) => selectedExhibit === p.exhibitId)
      );
    } else {
      updateSelectedExhibitLine([]);
    }
  }, [selectedExhibit]);

  useEffect(() => {
    const pos = app.renderer.plugins.interaction.mouse.global;
    const worldPoint = viewport.toWorld(pos.x, pos.y);

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
    if (!overPixel) {
      setOverExibit(undefined);
    } else if (overPixel.exhibitId !== overExhibit) {
      setOverExibit(overPixel.exhibitId!);
    }
  }, [overPixel]);

  useEffect(() => {
    updateExhibitLine(
      overExhibit ? pixels.filter((p) => p.exhibitId === overExhibit) : []
    );
  }, [overExhibit]);

  useViewportEventListener(
    "clicked",
    handleClickedCreate,
    WorldStateType.create
  );

  useViewportEventListener("clicked", handleClickedEdit, WorldStateType.edit);

  useViewportEventListener("clicked", handleClickedDetail, WorldStateType.view);

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
    viewport.resize(
      worldRef.current!.offsetWidth,
      worldRef.current!.offsetHeight
    );
    viewport.fit();
  }, [width, height]);

  useEffect(() => {
    updateWorld(currPixels);
  }, [currPixels]);

  useEffect(() => {
    if (world === WorldStateType.view) {
      setCurrPixels(pixels);
      updateBorderLine([]);
    } else if (world === WorldStateType.create) {
      setCurrPixels([...pixels, ...selectedPixels]);
      updateBorderLine(selectedPixels);
      checkForErrors();
    } else if (world === WorldStateType.edit) {
      if (
        editedExhibit.length > 0 &&
        editedExhibit[0].exhibitId === selectedExhibit
      ) {
        const pixelsWithoutEdited = pixels.filter((p) =>
          editedExhibit.every((ep) => ep.x !== p.x || ep.y !== p.y)
        );
        setCurrPixels([...pixelsWithoutEdited, ...editedExhibit]);
      } else {
        setCurrPixels(pixels);
      }
    }
  }, [world]);

  useEffect(() => {
    if (world === WorldStateType.create) {
      setCurrPixels([...pixels, ...selectedPixels]);
      updateBorderLine(selectedPixels);
      checkForErrors();
    }
  }, [selectedPixels]);

  useEffect(() => {
    if (world === WorldStateType.edit) {
      const pixelsWithoutEdited = pixels.filter((p) =>
        editedExhibit.every((ep) => ep.x !== p.x || ep.y !== p.y)
      );
      setCurrPixels([...pixelsWithoutEdited, ...editedExhibit]);
    }
  }, [editedExhibit]);

  useEffect(() => {
    setCurrPixels(pixels);
  }, [pixels]);

  return (
    <>
      <div ref={worldRef} className="world"></div>
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
            <div>
              {overPixel?.owner === you
                ? "You own this Exhibit"
                : overPixel?.owner}
            </div>
            <div>Exhibit: </div>
            <div>{overPixel?.exhibitId}</div>
            <div>Point: </div>
            <div>{`{${overPixel?.x}, ${overPixel?.y}}`}</div>
            <div>Pixel Id: </div>
            <div>{overPixel?.pixelId}</div>
          </div>
        </div>
      </MouseTooltip>
    </>
  );
};

export default World;
