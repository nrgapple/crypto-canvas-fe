import {
  LinkBox,
  HStack,
  LinkOverlay,
  Heading,
  VStack,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { Dart } from "../interfaces";
import Viewer from "./Viewer";

interface Props {
  dart?: Dart;
  onClick?: (dart: Dart) => void;
}

const DartBox = ({ dart, onClick }: Props) => {
  return (
    <LinkBox
      as="article"
      minWidth="120px"
      maxWidth="120px"
      height="120px"
      maxHeight="200px"
      className="shadow-border-pressable"
      p="8px"
      cursor="pointer"
      background="var(--background)"
      onClick={() => {
        onClick && onClick(dart!);
      }}
    >
      <VStack>
        <Viewer
          image={`/api/darts/image/${dart?.dartId}?size=200`}
          direction="width"
          disableLightBox={true}
        />{" "}
      </VStack>
    </LinkBox>
  );
};

export default DartBox;
