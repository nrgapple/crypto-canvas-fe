import { Box, List, Square, Stack, VStack } from "@chakra-ui/layout";
import { GetServerSideProps } from "next";
import React, { useMemo, useState } from "react";
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
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Button,
} from "@chakra-ui/react";
import { useBids } from "../../hooks/useBids";
import BidHistoryList from "../../components/BidHistoryList";
import OfferModal from "../../components/OfferModal";

interface DataProps {
  exhibitId?: number;
}

const Exhibit = ({ exhibitId }: DataProps) => {
  const [isOfferModalOpen, setOfferModalOpen] = useState<boolean>(false);
  const { loading, web3Contract } = useWeb3();
  usePixels(web3Contract);
  const pixels = useRecoilValue(pixelsState);
  const { highestBid, loading: loadingBids, placeBid } = useBids(
    web3Contract,
    exhibitId
  );

  const exhibitPixels = useMemo(() => {
    return pixels.filter((p) => p.exhibitId === exhibitId);
  }, [pixels]);

  const done = useMemo(() => !loading && exhibitPixels.length > 0, [
    loading,
    exhibitPixels,
  ]);

  const handleSubmitOffer = (value: number) => {
    placeBid(value);
  };

  return (
    <Layout title={`Exhibit #${exhibitId}`}>
      <Stack
        flexDirection={{ base: "column", md: "row" }}
        alignItems={{ base: "stretch", md: "start" }}
        justifyContent="center"
        justifyItems="stretch"
        padding="8px"
        overflowY="scroll"
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
            <Heading as="h2">
              <Box>Exhibit #{exhibitId}</Box>
              <Box>
                <Button onClick={() => setOfferModalOpen(true)}>
                  Make Offer
                </Button>
              </Box>
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
                <StatNumber>Ξ{highestBid ? highestBid.amount : 0}</StatNumber>
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
          <Accordion>
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    Price History
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel>
                <List spacing={3}>
                  {exhibitId !== undefined && (
                    <BidHistoryList exhibitId={exhibitId} />
                  )}
                </List>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </VStack>
        <OfferModal
          isOpen={isOfferModalOpen}
          onClose={() => setOfferModalOpen(false)}
          onSubmit={handleSubmitOffer}
        />
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
