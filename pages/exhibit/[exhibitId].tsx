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
  ButtonGroup,
  Portal,
} from "@chakra-ui/react";
import { useBids } from "../../hooks/useBids";
import BidHistoryList from "../../components/BidHistoryList";
import OfferModal from "../../components/OfferModal";
import Link from "next/link";
import {
  getContractAllBids,
  getContractBidForExhibit,
  getContractPixels,
} from "../services";
import { Bid, Pixel } from "../../interfaces";

interface DataProps {
  exhibitId?: number;
  pixels?: Pixel[];
  bid?: Bid | null;
}

const Exhibit = ({ exhibitId, pixels: initPixels, bid }: DataProps) => {
  const [isOfferModalOpen, setOfferModalOpen] = useState<boolean>(false);
  const { loading, web3Contract } = useWeb3();
  usePixels(web3Contract, initPixels);
  const pixels = useRecoilValue(pixelsState);
  const { highestBid, loading: loadingBids, placeBid } = useBids(
    web3Contract,
    exhibitId,
    undefined,
    bid ?? undefined
  );

  const you = useMemo(() => web3Contract?.accounts[0], [web3Contract]);

  const exhibitPixels = useMemo(() => {
    return pixels.filter((p) => p.exhibitId === exhibitId);
  }, [pixels]);

  const isOwner = useMemo(() => you === exhibitPixels[0]?.owner, [
    you,
    exhibitPixels,
  ]);

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
        alignItems={{ base: "start", md: "start" }}
        justifyContent="center"
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
                <ButtonGroup>
                  {isOwner ? (
                    <>
                      {highestBid && (
                        <Button onClick={() => setOfferModalOpen(true)}>
                          Accept Bid
                        </Button>
                      )}
                      <Link href={`/editor/${exhibitId}`}>
                        <Button>Edit</Button>
                      </Link>
                    </>
                  ) : (
                    <Button onClick={() => setOfferModalOpen(true)}>
                      Make Offer
                    </Button>
                  )}
                </ButtonGroup>
              </Box>
            </Heading>
          ) : (
            <Skeleton />
          )}
          {done ? (
            <Text fontSize="sm">
              Owned By {exhibitPixels[0].owner}{" "}
              {isOwner && <strong>(you)</strong>}
            </Text>
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
        <Portal>
          <OfferModal
            isOpen={isOfferModalOpen}
            onClose={() => setOfferModalOpen(false)}
            onSubmit={handleSubmitOffer}
          />
        </Portal>
      </Stack>
    </Layout>
  );
};

export default Exhibit;

export const getServerSideProps: GetServerSideProps<DataProps> = async ({
  params,
}) => {
  if (params && params.exhibitId) {
    const exhibitId = parseInt(params.exhibitId as string);
    const pixels = await getContractPixels();
    const bid = await getContractBidForExhibit(exhibitId);
    return {
      props: {
        bid: bid ?? null,
        pixels,
        exhibitId: parseInt(params.exhibitId as string),
      } as DataProps,
    };
  }
  return {
    props: {},
  };
};
