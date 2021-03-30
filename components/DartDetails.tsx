import {
  Box,
  Button,
  Center,
  Code,
  Grid,
  GridItem,
  HStack,
  Text,
  useClipboard,
  useToast,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import { useImageString } from "../hooks/useImageBuffer";
import { Dart } from "../interfaces";
import DisplayUser from "./DisplayUser";
import Viewer from "./Viewer";
//@ts-ignore
import { Textfit } from "react-textfit";
import { CopyIcon, ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons";
import { useLocation } from "react-use";
import QRCode from "react-qr-code";
import React, { useMemo } from "react";

interface Props {
  dart: Dart;
  isFullscreen: boolean;
  onFullscreen: () => void;
}

const DartDetails = ({ dart, onFullscreen, isFullscreen }: Props) => {
  const location = useLocation();
  const imageString = useImageString(dart.dartId);
  const { hasCopied, onCopy } = useClipboard(location.href || "");
  const toast = useToast();

  const onCopyItem = () => {
    onCopy();
    toast({
      title: "Copied to Clipboard",
      position: "top-right",
      isClosable: true,
      status: "success",
    });
  };

  const renderView = useMemo(
    () => (
      <Grid
        w="100%"
        flex={1}
        minH="0"
        paddingTop="8px"
        templateColumns={{ base: "auto auto", md: "1fr 2fr 1fr" }}
        alignItems="stretch"
        justifyItems="center"
        gridGap="8px"
      >
        <GridItem>
          <Center>
            <Box
              p="4px"
              background="transparent"
              sx={{ backdropFilter: "blur(2px)" }}
              alignSelf="start"
            >
              <DisplayUser id={dart.owner} />
            </Box>
          </Center>
        </GridItem>
        <GridItem
          alignSelf="stretch"
          justifySelf="center"
          colSpan={{ base: 2, md: 1 }}
          order={{ base: 3, md: 2 }}
          minH="0"
        >
          <HStack minH="0" h="100%" w="100%" justifyContent="center">
            <Viewer
              image={`/api/darts/image/${dart.dartId}`}
              disableLightBox={false}
            />
          </HStack>
        </GridItem>
        <GridItem order={{ base: 0, md: 2 }}>
          <Center>
            <VStack
              p="4px"
              background="transparent"
              sx={{ backdropFilter: "blur(2px)" }}
              alignSelf="start"
            >
              <Text>
                <strong>{dart.name}</strong>
              </Text>
              <QRCode size={50} value={location.href ?? ""} />
            </VStack>
          </Center>
        </GridItem>
      </Grid>
    ),
    [dart, location],
  );

  return (
    <Box position="relative" minH="0" flex="1">
      <VStack
        justifyContent="space-between"
        alignItems="center"
        h="100%"
        minH="0"
      >
        {renderView}
        <HStack w="100%" justifyContent="space-between" p="8px">
          <Button onClick={onFullscreen}>
            {isFullscreen ? <ArrowUpIcon /> : <ArrowDownIcon />}
          </Button>
          <Button onClick={onCopyItem}>
            <CopyIcon />
          </Button>
        </HStack>
      </VStack>
      <Code
        sx={{
          color: `rgba(75, 75, 75, 0.2)`,
          fontSize: `2vw`,
          background: "none",
        }}
        className="background-text"
        wordBreak="break-all"
      >
        <Textfit className="full" mode="multi">
          {imageString}
        </Textfit>
      </Code>
    </Box>
  );
};

export default DartDetails;
