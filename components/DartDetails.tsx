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
    <VStack justifyContent="center" alignItems="center">
      <HStack>
        <DisplayUser id={dart.owner} />
        <div>{dart.name}</div>
      </HStack>
      <HStack>
        <Viewer
          image={`api/darts/image/${dart.dartId}`}
          disableLightBox={false}
        />
      </HStack>
      <VStack w="sm" alignItems="flex-start">
        <Text>Image data from Blockchain</Text>
        <Code children={imageString}></Code>
      </VStack>
    </VStack>
  );
};

export default DartDetails;
