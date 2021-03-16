import {
  LinkBox,
  Square,
  HStack,
  LinkOverlay,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  VStack,
  Flex,
  AspectRatio,
  Skeleton,
} from "@chakra-ui/react";
import React, { useMemo } from "react";
import { Bid, Pixel } from "../interfaces";
import Viewer from "./Viewer";

interface Props {
  pixels: Pixel[];
  bid?: Bid;
}

const ExhibitBox = ({ pixels, bid }: Props) => {
  const isLoaded = useMemo(
    () => pixels.length > 0 && pixels[0]?.exhibitId !== undefined,
    [pixels]
  );

  return (
    <LinkBox
      as="article"
      h={{ base: "200px", md: "300px" }}
      w={{ base: "117", md: "234px" }}
      className="shadow-border-pressable"
      p="8px"
    >
      <Skeleton isLoaded={isLoaded}>
        <VStack w="100%" h="100%" justifyContent="space-between">
          <VStack
            p="8px"
            w="100%"
            height={{ base: "100px", md: "200px" }}
            justifyContent="center"
          >
            <Viewer pixels={pixels} />
          </VStack>
          <HStack w="100%" alignItems="center" justifyContent="space-between">
            <LinkOverlay
              href={isLoaded ? `/exhibit/${pixels[0].exhibitId}` : ""}
            >
              <Heading size="md">
                Exhibit #{isLoaded ? pixels[0].exhibitId : ""}
              </Heading>
            </LinkOverlay>
            <Stat size="sm" textAlign="end">
              <StatLabel fontWeight="bold">Price</StatLabel>
              <StatNumber>Ξ{bid?.amount ?? 0}</StatNumber>
            </Stat>
          </HStack>
        </VStack>
      </Skeleton>
    </LinkBox>
  );
};

export default ExhibitBox;
