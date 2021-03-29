import { useDisclosure, VStack } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import React from "react";
import { config } from "../../../app.config";
import DartDetails from "../../../components/DartDetails";
import DartSection from "../../../components/DartSection";
import Layout from "../../../components/Layout";
import { useDarts } from "../../../hooks/useDarts";
import { Dart } from "../../../interfaces";
import { getAllDarts } from "../../../services";

interface DataProps {
  darts?: Dart[];
  dart?: Dart;
}

const BrowsePage = ({ darts: initDarts, dart }: DataProps) => {
  const { darts } = useDarts(initDarts);
  const { onToggle: onToggleFullscreen, isOpen: isFullscreen } = useDisclosure({
    defaultIsOpen: false,
  });

  return (
    <Layout
      title={dart ? dart.name : "Browse"}
      image={dart ? `${config.baseUri}api/darts/image/${dart.dartId}` : ""}
    >
      <VStack h="100%" w="100%" alignItems="stretch" justifyContent="stretch">
        {dart && (
          <DartDetails
            dart={dart}
            onFullscreen={onToggleFullscreen}
            isFullscreen={isFullscreen}
          />
        )}
        <DartSection
          darts={darts}
          collection={!dart}
          isCollapsed={!isFullscreen}
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
        dart: dartId ? darts.find((d) => d.dartId === parseInt(dartId)) : null,
      } as DataProps,
    };
  }
  return {
    props: {},
  };
};
