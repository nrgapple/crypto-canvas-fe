import {
  LinkBox,
  HStack,
  LinkOverlay,
  Heading,
  VStack,
  Skeleton,
} from "@chakra-ui/react";
import React from "react";
import { Dart } from "../interfaces";
import Viewer from "./Viewer";

interface Props {
  dart?: Dart;
  isLoaded?: boolean;
  onClick?: (dart: Dart) => void;
}

const DartBox = ({ dart, isLoaded = true, onClick }: Props) => {
  return (
    <LinkBox
      as="article"
      minWidth="140px"
      maxWidth="140px"
      height="180px"
      maxHeight="230px"
      className="shadow-border-pressable"
      p="8px"
      background="var(--background)"
    >
      <VStack p="8px">
        isLoaded ? <Viewer image={`/api/darts/image/${dart?.dartId}`} /> :
        <Skeleton
          isLoaded={isLoaded}
          w={isLoaded ? "" : "100%"}
          h={isLoaded ? "" : "100%"}
        >
          <Viewer image="" />
        </Skeleton>
      </VStack>
      <HStack w="100%" alignItems="center" justifyContent="space-between">
        <LinkOverlay
          onClick={() => {
            onClick && onClick(dart!);
          }}
          p="8px"
        >
          <Skeleton isLoaded={isLoaded}>
            <Heading as="h5" size="md">
              {dart?.name}
            </Heading>
          </Skeleton>
        </LinkOverlay>
      </HStack>
    </LinkBox>
  );
};

export default DartBox;
