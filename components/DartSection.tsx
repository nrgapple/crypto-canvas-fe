import { VStack, Heading, Divider, HStack } from "@chakra-ui/react";
import React, { useMemo } from "react";
import { Dart } from "../interfaces";
import DartBox from "./DartBox";

interface Props {
  darts: Dart[];
  isLoaded?: boolean;
  setDart: (dart: Dart) => void
}

const DartSection = ({ darts, isLoaded = true, setDart }: Props) => {
  const renderDarts = useMemo(
    () =>
      isLoaded
        ? darts.map((dart) => (
            <DartBox
              key={dart.dartId}
              dart={dart}
              onClick={setDart}
            />
          ))
        : Array.from(Array(5)).map((_, i) => (
            <DartBox key={i} isLoaded={true} dart={undefined} />
          )),
    [darts]
  );

  return (
      <HStack alignItems="flex-end" flexBasis="700px" w="100%" overflowY="hidden" overflowX="auto">
        {renderDarts}
      </HStack>
  );
};

export default DartSection;
