import {
  Box,
  Button,
  Code,
  HStack,
  Text,
  useClipboard,
  useToast,
  VStack,
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
import { useMemo } from "react";

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
      <HStack
        alignItems="center"
        justifyContent="space-between"
        w="100%"
        p="16px"
        flex={1}
        minH="0"
        flexWrap={{ base: "wrap", md: "nowrap" }}
      >
        <Box
          p="4px"
          background="transparent"
          sx={{ backdropFilter: "blur(2px)" }}
          alignSelf="start"
        >
          <DisplayUser id={dart.owner} />
        </Box>
        <HStack
          order={{ base: 2, md: 1 }}
          flex="1 1"
          flexBasis={{ base: "100%", md: "auto" }}
          maxH="100%"
          alignSelf="stretch"
          minH="0"
          justifyContent="center"
        >
          <Viewer
            image={`/api/darts/image/${dart.dartId}`}
            disableLightBox={false}
          />
        </HStack>
        <VStack
          order={{ base: 1, md: 2 }}
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
      </HStack>
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
