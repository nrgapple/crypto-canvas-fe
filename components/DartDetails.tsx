import { Box, Code, Flex, HStack, Text, VStack } from "@chakra-ui/react";
import { useImageString } from "../hooks/useImageBuffer";
import { Dart } from "../interfaces";
import DisplayUser from "./DisplayUser";
import Viewer from "./Viewer";
//@ts-ignore
import { Textfit } from "react-textfit";

interface Props {
  dart: Dart;
}

const DartDetails = ({ dart }: Props) => {
  const imageString = useImageString(dart.dartId);
  console.log(dart.name)
  return (
    <Box position="relative" minH="0" flex="1">
      <VStack justifyContent="start" alignItems="center" h="100%" minH="0">
        <HStack justifyContent="space-between" w="100%" p="16px">
          <Box className="shadow-border" background="var(--background)" p="4px">
            <DisplayUser id={dart.owner} />
          </Box>
          <Box className="shadow-border" background="var(--background)" p="4px">
            <Text>
              <strong>{dart.name}</strong>
            </Text>
          </Box>
        </HStack>
        <HStack
          cursor="pointer"
          p="16px"
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