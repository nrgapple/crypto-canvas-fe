import { VStack, Heading, Divider, HStack, Wrap } from "@chakra-ui/react";
import React, { useMemo } from "react";
import { Dart } from "../interfaces";
import DartBox from "./DartBox";

interface Props {
  darts: Dart[];
  isLoaded?: boolean;
  setDart: (dart: Dart) => void;
  collection?: boolean;
}

const DartSection = ({
  darts,
  isLoaded = true,
  setDart,
  collection = false,
}: Props) => {
  const renderDarts = useMemo(
    () =>
      isLoaded
        ? darts.map((dart) => (
            <DartBox key={dart.dartId} dart={dart} onClick={setDart} />
          ))
        : Array.from(Array(5)).map((_, i) => (
            <DartBox key={i} isLoaded={true} dart={undefined} />
          )),
    [darts]
  );

  return (
    <>
      {collection ? (
        <Wrap justify="center" p="8px" overflowY="auto">
          {renderDarts}
        </Wrap>
      ) : (
        <HStack p="8px" overflowX="auto">
          {renderDarts}
        </HStack>
      )}
    </>
  );
};

export default DartSection;
