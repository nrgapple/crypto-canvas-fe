import { Image } from "@chakra-ui/image";
import { Code, HStack, Text, VStack } from "@chakra-ui/layout";
import { Dart } from "../interfaces";
import DisplayUser from "./DisplayUser";
import Viewer from "./Viewer";

interface Props {
    dart: Dart
}

const DartDetails = ({dart}: Props) => {
    return (
        <VStack justifyContent="center" alignItems="center">
            <HStack>
                <DisplayUser id={dart.owner} />
                <div>{dart.name}</div>
            </HStack>
            <HStack p="8px"w="100%" height="200px">
                <Viewer image={`api/darts/image/${dart.dartId}`} disableLightBox={false} />
            </HStack>
            <VStack w="sm" alignItems="flex-start">
                <Text>Image data from Blockchain</Text>
                <Code children={JSON.stringify([1,2,3,1,2,3,1,2,3,1,2,3,1,2,3,1,2,3,1,2,3,1,2,3,1,2,3,1,2,3,1,2,3], null, 1)}></Code>
            </VStack>
        </VStack>
    )
}

export default DartDetails;