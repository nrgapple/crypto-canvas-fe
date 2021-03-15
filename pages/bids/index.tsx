import { Divider, Heading, VStack } from "@chakra-ui/layout";
import Link from "next/link";
import React from "react";
import { useRecoilState } from "recoil";
import BidsList from "../../components/BidsList";
import Layout from "../../components/Layout";
import { useBids } from "../../hooks/useBids";
import { usePixels } from "../../hooks/usePixels";
import { useWeb3 } from "../../hooks/useWeb3";
import { allBidsState } from "../../state";

const BidsPage = () => {
  const { loading, web3Contract } = useWeb3();
  useBids(web3Contract);
  usePixels(web3Contract);
  const [allBids] = useRecoilState(allBidsState);

  console.log("allbids", allBids);

  return (
    <Layout title="Bids">
      {loading ? (
        <h1>Loading Bids</h1>
      ) : (
        <VStack w="100%" h="100%" overflowY="scroll">
          <Heading as="h1">Bids</Heading>
          <Divider />
          <BidsList allBids={allBids} />
        </VStack>
      )}
    </Layout>
  );
};

export default BidsPage;
