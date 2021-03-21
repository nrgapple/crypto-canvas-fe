import { VStack, Heading, Divider } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import React from "react";
import DartSection from "../../components/DartSection";
import Layout from "../../components/Layout";
import { useDarts } from "../../hooks/useDarts";
import { Dart } from "../../interfaces";
import { getAllDarts } from "../../services";

interface DataProps {
  darts?: Dart[];
}

const BrowsePage = ({ darts: initDarts }: DataProps) => {
  const { darts } = useDarts(initDarts);

  return (
    <Layout title="Bids">
      <VStack w="100%" h="100%" p="8px" overflowY="scroll">
        <Heading as="h1">Browse</Heading>
        <DartSection darts={darts} title={"All"} />
      </VStack>
    </Layout>
  );
};

export default BrowsePage;

export const getServerSideProps: GetServerSideProps<DataProps> = async () => {
  const darts = await getAllDarts();
  if (darts && darts.length > 0) {
    return {
      props: {
        darts,
      } as DataProps,
    };
  }
  return {
    props: {},
  };
};
