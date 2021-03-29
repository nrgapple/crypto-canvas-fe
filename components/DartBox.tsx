import { LinkBox, VStack } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { Dart } from "../interfaces";
import Viewer from "./Viewer";

interface Props {
  dart?: Dart;
}

const DartBox = ({ dart }: Props) => {
  return (
    <NextLink href={`/browse/${dart?.dartId}`} passHref>
      <LinkBox
        as="article"
        cursor="pointer"
        minWidth="120px"
        maxWidth="120px"
        height="120px"
        maxHeight="200px"
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
