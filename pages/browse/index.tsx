import { Image, VStack } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import React, { useState } from "react";
import DartDetails from "../../components/DartDetails";
import DartSection from "../../components/DartSection";
import Layout from "../../components/Layout";
import { useDarts } from "../../hooks/useDarts";
import { useImageDataSVG } from "../../hooks/useImageBuffer";
import { Dart } from "../../interfaces";
import { getAllDarts } from "../../services";

interface DataProps {
  darts?: Dart[];
}

const BrowsePage = ({ darts: initDarts }: DataProps) => {
  const { darts } = useDarts(initDarts);
  const [selectedDart, setSelectedDart] = useState<Dart | undefined>();
  return (
    <Layout title="Browse">
      <VStack h="100%" w="100%" alignItems="stretch" justifyContent="stretch">
        {selectedDart && <DartDetails dart={selectedDart} />}
        <DartSection
          darts={darts}
          setDart={setSelectedDart}
          collection={!selectedDart}
        />
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
