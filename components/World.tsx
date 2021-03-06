import React, { useEffect, useState, useRef, useCallback } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { Pixel, WorldStateType } from "../interfaces";
import {
  currentColorState,
  editedBlockState,
  pixelsState,
  selectedBlockState,
  selectedPixelsState,
  worldError,
  worldState,
} from "../state";

import { app, checkIsRect, SIZE, viewport } from "../utils/index";
import {
  displayScreen,
  updateBlockLine,
  updateBorderLine,
  updateSelectedBlockLine,
  updateWorld,
} from "../utils/viewport";
//@ts-ignore
import MouseTooltip from "react-sticky-mouse-tooltip";
import useMouse from "@react-hook/mouse-position";
import { Point } from "pixi.js";

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
  const [overBlock, setOverBlock] = useState<number | undefined>(undefined);
  const [selectedBlock, setSelectedBlock] = useRecoilState(selectedBlockState);
  const [editedBlock, setEditedBlock] = useRecoilState(editedBlockState);

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
      console.log(el);
      // clicked an already selected pixel?
      if (selectedPixels.some(match)) {
        selected = selectedPixels.filter(notMatch);
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
        blockId: selectedBlock,
        owner: you,
      } as Pixel;
      let edited;
      const match = (s: Pixel) =>
        newPoint.x === s.x &&
        newPoint.y === s.y &&
        newPoint.blockId === s.blockId &&
        newPoint.owner === s.owner;
      const notMatch = (s: Pixel) => !match(s);

      if (editedBlock.some(match)) {
        edited = editedBlock.filter(notMatch);
        setEditedBlock(edited);
      } else if (pixels.some(match)) {
        const otherPixel = pixels.find(match);
        newPoint.pixelId = otherPixel?.pixelId;
        edited = [...editedBlock, newPoint];
        setEditedBlock(edited);
      }
    },
    [currentColor, editedBlock, pixels, selectedBlock]
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
        setSelectedBlock(pixel.blockId);
      } else {
        setSelectedBlock(undefined);
      }
    },
    [pixels]
  );

  useEffect(() => {
    if (selectedBlock) {
      updateSelectedBlockLine(
        pixels.filter((p) => selectedBlock === p.blockId)
      );
    } else {
      updateSelectedBlockLine([]);
    }
  }, [selectedBlock]);

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
    if (!overPixel) {
      setOverBlock(undefined);
    } else if (overPixel.blockId !== overBlock) {
      setOverBlock(overPixel.blockId!);
    }
  }, [overPixel]);

  useEffect(() => {
    updateBlockLine(
      overBlock ? pixels.filter((p) => p.blockId === overBlock) : []
    );
  }, [overBlock]);

  useEffect(() => {
    if (world === WorldStateType.create) {
      viewport.addListener("clicked", handleClickedCreate);
      return () => {
        if (viewport) viewport.removeListener("clicked", handleClickedCreate);
      };
    }
  }, [handleClickedCreate, world]);

  useEffect(() => {
    if (world === WorldStateType.edit) {
      viewport.addListener("clicked", handleClickedEdit);
      return () => {
        if (viewport) viewport.removeListener("clicked", handleClickedEdit);
      };
    }
  }, [handleClickedEdit, world]);

  useEffect(() => {
    if (world === WorldStateType.view) {
      viewport.addListener("clicked", handleClickedDetail);
      return () => {
        if (viewport) viewport.removeListener("clicked", handleClickedDetail);
      };
    }
  }, [handleClickedDetail, world]);

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
    if (world === WorldStateType.view) {
      setCurrPixels(pixels);
      updateBorderLine([]);
    } else if (world === WorldStateType.create) {
      setCurrPixels([...pixels, ...selectedPixels]);
      updateBorderLine(selectedPixels);
      checkForErrors();
    } else if (world === WorldStateType.edit) {
      if (editedBlock.length > 0 && editedBlock[0].blockId === selectedBlock) {
        const pixelsWithoutEdited = pixels.filter((p) =>
          editedBlock.every((ep) => ep.x !== p.x || ep.y !== p.y)
        );
        setCurrPixels([...pixelsWithoutEdited, ...editedBlock]);
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
        editedBlock.every((ep) => ep.x !== p.x || ep.y !== p.y)
      );
      setCurrPixels([...pixelsWithoutEdited, ...editedBlock]);
    }
  }, [editedBlock]);

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
            <div>
              {overPixel?.owner === you
                ? "You own this Block"
                : overPixel?.owner}
            </div>
            <div>Block: </div>
            <div>{overPixel?.blockId}</div>
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
