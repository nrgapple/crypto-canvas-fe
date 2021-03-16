import { Divider, Heading, VStack } from "@chakra-ui/layout";
import { GetServerSideProps } from "next";
import Link from "next/link";
import React from "react";
import { useRecoilState } from "recoil";
import BidsList from "../../components/BidsList";
import Layout from "../../components/Layout";
import { useBids } from "../../hooks/useBids";
import { usePixels } from "../../hooks/usePixels";
import { useWeb3 } from "../../hooks/useWeb3";
import { Bid, Pixel } from "../../interfaces";
import { allBidsState } from "../../state";
import { getContractAllBids, getContractPixels } from "../../services";

interface DataProps {
  allBids?: Bid[];
  pixels?: Pixel[];
}

const BidsPage = ({ allBids: initAllbids, pixels }: DataProps) => {
  const { loading, web3Contract } = useWeb3();
  useBids(web3Contract, undefined, initAllbids);
  usePixels(web3Contract, pixels);
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

export const getServerSideProps: GetServerSideProps<DataProps> = async () => {
  const allBids = await getContractAllBids();
  const pixels = await getContractPixels();
  if (allBids && allBids.length > 0 && pixels && pixels.length > 0) {
    return {
      props: {
        allBids,
        pixels,
      } as DataProps,
    };
  }
  return {
    props: {},
  };
};
