import { VStack, Heading, Divider, HStack } from "@chakra-ui/react";
import React, { useMemo } from "react";
import { Dart } from "../interfaces";
import DartBox from "./ExhibitBox";

interface Props {
  darts: Dart[];
  title: string;
  isLoaded?: boolean;
}

const DartSection = ({ darts, title, isLoaded = true }: Props) => {
  const renderDarts = useMemo(
    () =>
      isLoaded
        ? darts.map((dart) => (
            <DartBox
              key={dart.dartId}
              image={dart.image}
              dartId={dart.dartId}
              name={dart.name}
              bid={undefined}
            />
          ))
        : Array.from(Array(5)).map((_, i) => (
            <DartBox key={i} isLoaded={true} image="" dartId={-1} />
          )),
    [darts]
  );

  return (
    <VStack w="100%" p="8px" overflowY="scroll">
      <Heading as="h1">{title}</Heading>
      <Divider />
      <HStack overflowX="auto">{renderDarts}</HStack>
    </VStack>
  );
};

export default DartSection;
