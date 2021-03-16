import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { Coord, Pixel, WorldStateType } from "../interfaces";
import {
  centerState,
  currentColorState,
  editedExhibitState,
  moveExhibitState,
  pixelsState,
  selectedExhibitState,
  selectedPixelsState,
  worldError,
  worldState,
} from "../state";

import { app, viewport } from "../utils/index";
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
import { Box } from "@chakra-ui/layout";
import {
  checkIsRect,
  getMaxMinPoints,
  midpoint,
  moveToPoint,
  SIZE,
} from "../utils/helpers";
import {
  Divider,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  VStack,
} from "@chakra-ui/react";
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
  const [center, setCenter] = useRecoilState(centerState);
  const [move, setMove] = useRecoilState(moveExhibitState);

  const recenter = (pixels: Pixel[]) => {
    const { max, min } = getMaxMinPoints(pixels);
    const midp = midpoint(max, min);
    const width = max[0] - min[0];
    const height = max[1] - min[1];
    viewport.fit(true, width + width / 2, height + height / 2);
    viewport.moveCenter(new Point(midp[0], midp[1]));
  };

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

  const handleClickedMove = useCallback(
    (el) => {
      try {
        const newPixels = moveToPoint(selectedPixels, {
          x: Math.floor(el.world.x),
          y: Math.floor(el.world.y),
        } as Coord);
        console.log("selected", selectedPixels);
        console.log("new", newPixels);

        setSelectedPixels(newPixels);
      } catch (e) {
        console.error(e);
      } finally {
        setMove(false);
      }
    },
    [selectedPixels]
  );

  useEffect(() => {
    if (selectedExhibit !== undefined && world === WorldStateType.edit) {
      console.log("here");
      const exhibitPoints = pixels.filter(
        (p) => selectedExhibit === p.exhibitId
      );
      updateSelectedExhibitLine(exhibitPoints);
      recenter(exhibitPoints);
    } else {
      console.log("there");
      updateSelectedExhibitLine([]);
    }
  }, [selectedExhibit, pixels, world]);

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
      overExhibit != undefined
        ? pixels.filter((p) => p.exhibitId === overExhibit)
        : []
    );
  }, [overExhibit]);

  const worldAndMove = useCallback(
    (type: WorldStateType) => world === type && !move,
    [world, move]
  );

  useViewportEventListener(
    "clicked",
    handleClickedCreate,
    worldAndMove(WorldStateType.create),
    [world, move]
  );

  useViewportEventListener(
    "clicked",
    handleClickedEdit,
    worldAndMove(WorldStateType.edit),
    [world, move]
  );

  useViewportEventListener(
    "clicked",
    handleClickedDetail,
    worldAndMove(WorldStateType.view),
    [world, move]
  );

  useViewportEventListener("clicked", handleClickedMove, move, [world, move]);

  const resize = () => {
    app.renderer.resize(width, height);
    viewport.resize(
      worldRef.current!.offsetWidth,
      worldRef.current!.offsetHeight
    );
  };

  useEffect(() => {
    const canvas = displayScreen(worldRef.current!);
    resize();
    viewport.fit();
    viewport.moveCenter(SIZE / 2, SIZE / 2);

    canvasRef.current = canvas;
    viewport.clampZoom({
      maxHeight: SIZE + SIZE * 2,
      maxWidth: SIZE + SIZE * 2,
      minHeight: 5,
      minWidth: 5,
    });
  }, []);

  useEffect(() => {
    if (world === WorldStateType.view) {
      viewport.clamp({ direction: "all" });
    } else {
      viewport.clamp({
        left: -(SIZE / 2),
        right: SIZE + SIZE / 2,
        top: -(SIZE / 2),
        bottom: SIZE + SIZE / 2,
      });
    }
  }, [world]);

  useEffect(() => {
    if (center) {
      if (world === WorldStateType.edit) {
        recenter(pixels.filter((p) => selectedExhibit === p.exhibitId));
      } else if (world === WorldStateType.create && selectedPixels.length > 0) {
        recenter(selectedPixels);
      } else {
        viewport.fit();
        viewport.moveCenter(SIZE / 2, SIZE / 2);
      }
      setCenter(false);
    }
  }, [center]);

  useEffect(() => {
    resize();
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

  console.log("world pixels", pixels);

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
    if (world === WorldStateType.create) {
      setCurrPixels([...pixels, ...selectedPixels]);
    } else {
      setCurrPixels(pixels);
    }
  }, [pixels]);

  return (
    <>
      <Box maxHeight="100%" ref={worldRef} className="world"></Box>
      <MouseTooltip
        visible={overPixel != undefined}
        offsetX={15}
        offsetY={10}
        style={{
          zIndex: "1000",
        }}
      >
        <Box
          className="overlay"
          borderColor={overPixel?.hexColor}
          borderWidth="1px"
        >
          <VStack>
            <Heading size="lg" as="h5">
              Exhibit #{overPixel?.exhibitId}
            </Heading>
            <Divider />
            <Stat>
              <StatLabel>Pixel</StatLabel>
              <StatNumber>
                {`{x: ${overPixel?.x}, y: ${overPixel?.y}}`}
              </StatNumber>
            </Stat>
          </VStack>
        </Box>
      </MouseTooltip>
    </>
  );
};

export default World;
