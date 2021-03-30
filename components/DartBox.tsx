import { LinkBox, VStack } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { Dart } from "../interfaces";
import Viewer from "./Viewer";

interface Props {
  dart?: Dart;
  scale?: boolean;
}

const DartBox = ({ dart, scale = false }: Props) => {
  return (
    <NextLink href={`/browse/${dart?.dartId}`} passHref>
      <LinkBox
        as="article"
        cursor="pointer"
        minWidth={scale ? { base: "75px", md: "120" } : "120px"}
        maxWidth={scale ? { base: "75px", md: "120" } : "120px"}
        height={scale ? { base: "75px", md: "120" } : "120px"}
        maxHeight={scale ? { base: "75px", md: "120" } : "120px"}
        className="shadow-border-pressable"
        p="8px"
        background="var(--background)"
      >
        <Viewer
          image={`/api/darts/image/${dart?.dartId}?size=200`}
          direction="width"
          disableLightBox={true}
        />
      </LinkBox>
    </NextLink>
  );
};

export default DartBox;
