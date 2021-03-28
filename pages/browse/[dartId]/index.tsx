import {
  Collapse,
  Image,
  Slide,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/dist/client/router";
import React, { useEffect, useState } from "react";
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
  const [selectedDart, setSelectedDart] = useState<Dart | undefined>(dart);
  const router = useRouter();
  const { onToggle: onToggleFullscreen, isOpen: isFullscreen } = useDisclosure({
    defaultIsOpen: false,
  });

  const setDart = (d: Dart) => {
    router.push(`/browse/${d.dartId}`);
    setSelectedDart(d);
  };

  return (
    <Layout
      title={dart ? dart.name : "Browse"}
      image={dart ? `${config.baseUri}api/darts/image/${dart.dartId}` : ""}
    >
      <VStack h="100%" w="100%" alignItems="stretch" justifyContent="stretch">
        {selectedDart && (
          <DartDetails
            dart={selectedDart}
            onFullscreen={onToggleFullscreen}
            isFullscreen={isFullscreen}
          />
        )}
        <DartSection
          darts={darts}
          setDart={(d) => setDart(d)}
          collection={!selectedDart}
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
