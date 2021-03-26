import { Image, VStack } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/dist/client/router";
import React, { useEffect, useState } from "react";
import DartDetails from "../../../components/DartDetails";
import DartSection from "../../../components/DartSection";
import Layout from "../../../components/Layout";
import { useDarts } from "../../../hooks/useDarts";
import { Dart } from "../../../interfaces";
import { getAllDarts } from "../../../services";

interface DataProps {
  darts?: Dart[];
  dartId?: number;
}

const BrowsePage = ({ darts: initDarts, dartId }: DataProps) => {
  const { darts } = useDarts(initDarts);
  const [selectedDart, setSelectedDart] = useState<Dart | undefined>();
  const router = useRouter();

  useEffect(() => {
    if (dartId !== undefined && darts.length > 0) {
      setSelectedDart(darts.find((d) => d.dartId === dartId));
    }
  }, [dartId, darts]);

  return (
    <Layout title="Browse">
      <VStack h="100%" w="100%" alignItems="stretch" justifyContent="stretch">
        {selectedDart && <DartDetails dart={selectedDart} />}
        <DartSection
          darts={darts}
          setDart={(d) => router.push(`/browse/${d.dartId}`)}
          collection={!selectedDart}
        />
      </VStack>
    </Layout>
  );
};

export default BrowsePage;

export const getServerSideProps: GetServerSideProps<DataProps> = async ({
  params,
}) => {
  const darts = await getAllDarts();
  if (darts && darts.length > 0) {
    const dartId = params?.dartId as string;
    return {
      props: {
        darts,
        dartId: dartId ? parseInt(dartId) : null,
      } as DataProps,
    };
  }
  return {
    props: {},
  };
};
