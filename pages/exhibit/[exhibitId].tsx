import {
  AspectRatio,
  Box,
  HStack,
  Square,
  Stack,
  VStack,
  Wrap,
} from "@chakra-ui/layout";
import { GetServerSideProps } from "next";
import React, { useMemo } from "react";
import { useRecoilValue } from "recoil";
import Layout from "../../components/Layout";
import Viewer from "../../components/Viewer";
import { usePixels } from "../../hooks/usePixels";
import { useWeb3 } from "../../hooks/useWeb3";
import { pixelsState } from "../../state";
import {
  Text,
  Heading,
  Skeleton,
  Accordion,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Flex,
} from "@chakra-ui/react";
import { useBids } from "../../hooks/useBids";

interface DataProps {
  exhibitId?: number;
}

const Exhibit = ({ exhibitId }: DataProps) => {
  const { loading, web3Contract } = useWeb3();
  usePixels(web3Contract);
  const pixels = useRecoilValue(pixelsState);
  const { highestBid, loading: loadingBids } = useBids(web3Contract, exhibitId);

  const exhibitPixels = useMemo(() => {
    return pixels.filter((p) => p.exhibitId === exhibitId);
  }, [pixels]);

  const done = useMemo(() => !loading && exhibitPixels.length > 0, [
    loading,
    exhibitPixels,
  ]);

  return (
    <Layout title={`${exhibitId}`}>
      <Stack
        flexDirection={{ base: "column", md: "row" }}
        alignItems={{ base: "stretch", md: "start" }}
        justifyContent="center"
        justifyItems="stretch"
        padding="8px"
      >
        <VStack p="8px" flexBasis="600px">
          <Square
            w="100%"
            h="500px"
            borderRadius="5px"
            border="1px solid var(--border)"
            p="8px"
          >
            <Viewer pixels={exhibitPixels} />
          </Square>
        </VStack>
        <VStack
          p="8px"
          flexBasis="600px"
          alignItems="stretch"
          justifyContent="start"
        >
          {done ? (
            <Heading textAlign="left" as="h2">
              Exhibit {exhibitId}
            </Heading>
          ) : (
            <Skeleton />
          )}
          {done ? (
            <Text fontSize="sm">Owned By {exhibitPixels[0].owner}</Text>
          ) : (
            <Skeleton />
          )}
          <Box borderRadius="5px" border="1px solid var(--border)" p="8px">
            {!loadingBids ? (
              <Stat>
                <StatLabel>Current Price</StatLabel>
                <StatNumber>
                  Eth {highestBid ? highestBid.amount : 0}
                </StatNumber>
                {highestBid && <StatHelpText>{highestBid.from}</StatHelpText>}
              </Stat>
            ) : (
              <Skeleton>
                <Stat>
                  <StatLabel>Current Price</StatLabel>
                  <StatNumber>0000000</StatNumber>
                  <StatHelpText>0000000</StatHelpText>
                </Stat>
              </Skeleton>
            )}
          </Box>
        </VStack>
      </Stack>
    </Layout>
  );
};

export default Exhibit;

export const getServerSideProps: GetServerSideProps<DataProps> = async ({
  params,
}) => {
  if (params && params.exhibitId) {
    return {
      props: {
        exhibitId: parseInt(params.exhibitId as string),
      } as DataProps,
    };
  }
  return {
    props: {},
  };
};
