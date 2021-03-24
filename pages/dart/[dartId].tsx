import {
  Square,
  Stack,
  VStack,
  Image,
  Heading,
  Box,
  HStack,
  Button,
  Link,
} from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import Layout from "../../components/Layout";
import Viewer from "../../components/Viewer";
import { Text } from "@chakra-ui/react";
import { getDart } from "../../services";
import { Dart } from "../../interfaces";
import { config } from "../../app.config";
import DisplayUser from "../../components/DisplayUser";

interface DataProps {
  dart?: Dart;
}

const DartPage = ({ dart }: DataProps) => {
  return (
    <Layout
      title={`${dart?.name}`}
      image={dart ? `${config.baseUri}api/darts/image/${dart.dartId}` : ""}
    >
      <Stack
        flexDirection={{ base: "column", md: "row" }}
        alignItems={{ base: "start", md: "start" }}
        justifyContent={{ base: "start", md: "center" }}
        justifyItems={{ base: "start", md: "start" }}
        overflowY="scroll"
        w="100%"
        h="100%"
      >
        <VStack p="8px" flexBasis={{ base: "300", md: "600px" }}>
          <Square
            w="100%"
            h={{ base: "300px", md: "500px" }}
            borderRadius="5px"
            border="1px solid var(--border)"
            p="8px"
          >
            <Viewer image={dart ? `/api/darts/image/${dart.dartId}` : ""} />
          </Square>
        </VStack>
        <VStack
          p="8px"
          flexBasis="600px"
          alignItems="stretch"
          justifyContent="start"
        >
          <Link
            href={`${config.openSeaBaseUri}assets/${config.contractAddress}/${dart?.dartId}`}
          >
            View on OpenSea
          </Link>
          <Heading as="h2">
            <Box>{dart?.name ?? "No Name"}</Box>
          </Heading>
          <HStack alignItems="center">
            <Text fontSize="sm">Owned By</Text>
            <DisplayUser id={dart!.owner} />{" "}
          </HStack>
        </VStack>
      </Stack>
    </Layout>
  );
};

export default DartPage;

export const getServerSideProps: GetServerSideProps<DataProps> = async ({
  params,
}) => {
  if (params && params.dartId) {
    const dartId = parseInt(params.dartId as string);
    const dart = await getDart(dartId);
    return {
      props: {
        dart,
      } as DataProps,
    };
  }
  return {
    props: {},
  };
};
