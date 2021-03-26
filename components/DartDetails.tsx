import { Image } from "@chakra-ui/image";
import { Code, HStack, Text, VStack } from "@chakra-ui/layout";
import { useImageString } from "../hooks/useImageBuffer";
import { Dart } from "../interfaces";
import DisplayUser from "./DisplayUser";
import Viewer from "./Viewer";

interface Props {
  dart: Dart;
}

const DartDetails = ({ dart }: Props) => {
  const imageString = useImageString(dart.dartId);
  return (
    <VStack height="500px" justifyContent="center" alignItems="center" className="shadow-border">
      <HStack justifyContent="space-between" w="100%" p="8px">
        <DisplayUser id={dart.owner} />
        <strong>{dart.name}</strong>
      </HStack>
      <HStack cursor="pointer" maxW="300px" maxH="300px">
        <Viewer
          image={`api/darts/image/${dart.dartId}`}
          disableLightBox={false}
        />
      </HStack>
      <VStack w="sm" alignItems="flex-start">
        <Text size="sm" color="grey">Image data stored in Blockchain</Text>
        <Code wordBreak="break-all" overflowY="scroll" h="40px" children={imageString}></Code>
      </VStack>
    </VStack>
  );
};

export default DartDetails;
