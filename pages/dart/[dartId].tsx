import { Square, Stack, VStack, Image } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import React, { useMemo, useState } from "react";
import Layout from "../../components/Layout";
import Viewer from "../../components/Viewer";
import { Text } from "@chakra-ui/react";
import { getDart } from "../../services";
import { Dart } from "../../interfaces";
import { useContractAndAccount } from "../../hooks/useContractAndAccount";

interface DataProps {
  dart?: Dart;
}

const DartPage = ({ dart }: DataProps) => {
  const [isOfferModalOpen, setOfferModalOpen] = useState<boolean>(false);
  const [isAcceptBidModalOpen, setAcceptBidModalOpen] = useState<boolean>(
    false
  );
  const { account, status } = useContractAndAccount(true);
  const you = useMemo(() => account, [account]);

  const isOwner = useMemo(() => you === dart?.owner, [you, dart]);

  return (
    <Layout
      title={`${dart?.name}`}
      image={dart ? `${window.location.origin}/api/darts/image/${dart.dartId}` : ""}
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
            <Viewer image={dart?.image ?? ""} />
          </Square>
        </VStack>
        <VStack
          p="8px"
          flexBasis="600px"
          alignItems="stretch"
          justifyContent="start"
        >
          {/* {done ? (
            <Heading as="h2">
              <Box>Exhibit #{exhibitId}</Box>
              <Box>
                <ButtonGroup>
                  {isOwner ? (
                    <>
                      {highestBid && (
                        <Button onClick={() => setAcceptBidModalOpen(true)}>
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
          )} */}
          <Text fontSize="sm">
            Owned By {dart?.owner} {isOwner && <strong>(you)</strong>}
          </Text>
          {/* <Box borderRadius="5px" border="1px solid var(--border)" p="8px">
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
          </Box> */}
          {/* <Accordion position="relative" allowToggle={true}>
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    Price History
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel position="absolute" width="100%" overflowX="auto">
                {exhibitId !== undefined && (
                  <BidHistoryList exhibitId={exhibitId} />
                )}
              </AccordionPanel>
            </AccordionItem>
          </Accordion> */}
        </VStack>
        {/* <Portal>
          <OfferModal
            isOpen={isOfferModalOpen}
            onClose={() => setOfferModalOpen(false)}
            onSubmit={handleSubmitOffer}
          />
          <AcceptBidModal
            isOpen={isAcceptBidModalOpen}
            highestBid={highestBid}
            exhibitId={exhibitId!}
            onAcceptBid={acceptBid}
            onClose={() => setAcceptBidModalOpen(false)}
          />
        </Portal> */}
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
