import { Box, Button, Code, HStack, Text, useClipboard, VStack } from "@chakra-ui/react";
import { useImageString } from "../hooks/useImageBuffer";
import { Dart } from "../interfaces";
import DisplayUser from "./DisplayUser";
import Viewer from "./Viewer";
//@ts-ignore
import { Textfit } from "react-textfit";
import { CopyIcon } from "@chakra-ui/icons";
import { useLocation } from "react-use";

interface Props {
  dart: Dart;
}

const DartDetails = ({ dart }: Props) => {
  const location = useLocation();
  const imageString = useImageString(dart.dartId);
  const {hasCopied, onCopy} = useClipboard(location.href!)

  return (
    <Box position="relative" minH="0" flex="1">
      <VStack justifyContent="start" alignItems="center" h="100%" minH="0">
        <HStack w="100%" justifyContent="space-between" p="8px">
          <Box>
            <DisplayUser id={dart.owner} />
          </Box>
          <Box>
            <Text>
              <strong>{dart.name}</strong>
            </Text>
          </Box>
        </HStack>
        <HStack
          flex="1 1"
          minH="0"
          justifyContent="center"
        >
          <Viewer
            className="shadow-border"
            image={`/api/darts/image/${dart.dartId}`}
            disableLightBox={false}
          />
        </HStack>
        <HStack w="100%" justifyContent="flex-end" p="8px">
          <Button onClick={onCopy}><CopyIcon /></Button>
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
