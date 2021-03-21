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
  pixels?: Pixel[];
  image?: string;
  bid?: Bid;
  isLoaded?: boolean;
  dartId?: number;
}

const ExhibitBox = ({
  pixels,
  bid,
  image,
  dartId,
  isLoaded: isLoadedForced = true,
}: Props) => {
  const isLoaded = useMemo(
    () =>
      !pixels ||
      (pixels.length > 0 &&
        pixels[0]?.exhibitId !== undefined &&
        isLoadedForced),
    [pixels, isLoadedForced]
  );

  return (
    <LinkBox
      as="article"
      h={{ base: "300px", md: "300px" }}
      w={{ base: "100%", md: "234px" }}
      className="shadow-border-pressable"
      p="8px"
    >
      <VStack w="100%" h="100%" justifyContent="space-between">
        <VStack
          p="8px"
          w="100%"
          height={{ base: "200px", md: "200px" }}
          justifyContent="center"
        >
          isLoaded ? <Viewer pixels={pixels} /> :
          <Skeleton
            isLoaded={isLoaded}
            w={isLoaded ? "" : "100%"}
            h={isLoaded ? "" : "100%"}
          >
            <Viewer pixels={[]} />
          </Skeleton>
        </VStack>
        <HStack w="100%" alignItems="center" justifyContent="space-between">
          <LinkOverlay
            href={
              isLoaded
                ? `/exhibit/${pixels ? pixels[0]?.exhibitId : dartId}`
                : ""
            }
            p="8px"
          >
            <Skeleton isLoaded={isLoaded}>
              <Heading as="h5" size="md">
                Exhibit #{pixels ? pixels[0]?.exhibitId : dartId}
              </Heading>
            </Skeleton>
          </LinkOverlay>
          <Stat size="sm" textAlign="end" p="8px">
            <Skeleton isLoaded={isLoaded}>
              <StatLabel fontWeight="bold">Price</StatLabel>
            </Skeleton>
            <Skeleton isLoaded={isLoaded}>
              <StatNumber>Ξ{bid?.amount ?? 0}</StatNumber>
            </Skeleton>
          </Stat>
        </HStack>
      </VStack>
    </LinkBox>
  );
};

export default ExhibitBox;
