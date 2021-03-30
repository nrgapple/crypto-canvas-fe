import { HStack, Wrap, Collapse } from "@chakra-ui/react";
import React, { useCallback, useMemo } from "react";
import { Dart } from "../interfaces";
import DartBox from "./DartBox";

interface Props {
  darts: Dart[];
  isLoaded?: boolean;
  collection?: boolean;
  isCollapsed?: boolean;
}

const DartSection = ({
  darts,
  isLoaded = true,
  collection = false,
  isCollapsed = false,
}: Props) => {
  const renderDarts = useCallback(
    (scale: boolean) =>
      isLoaded
        ? darts.map((dart) => (
            <DartBox scale={scale} key={dart.dartId} dart={dart} />
          ))
        : Array.from(Array(5)).map((_, i) => (
            <DartBox scale={scale} key={i} dart={undefined} />
          )),
    [darts],
  );

  return (
    <>
      {collection ? (
        <Wrap
          justify="center"
          p="8px"
          overflowY="auto"
          sx={{ WebkitOverflowScrolling: "touch" }}
          h="100%"
        >
          {renderDarts(false)}
        </Wrap>
      ) : (
        <Collapse in={isCollapsed}>
          <HStack p="8px" overflowX="auto" overflowY="hidden">
            {renderDarts(true)}
          </HStack>
        </Collapse>
      )}
    </>
  );
};

export default DartSection;
