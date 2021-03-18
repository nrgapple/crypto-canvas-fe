import { Box, Square } from "@chakra-ui/layout";
import { GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import Layout from "../components/Layout";
import { usePixels } from "../hooks/usePixels";
import { Pixel } from "../interfaces";
import { selectedExhibitState } from "../state";
import { getContractPixels } from "../services";
import { useContractAndAccount } from "../hooks/useContractAndAccount";

interface DataProps {
  pixels?: Pixel[];
}

const World = dynamic(() => import("../components/World"), {
  ssr: false,
});

const Home = ({ pixels }: DataProps) => {
  const { account } = useContractAndAccount(true);
  usePixels(pixels);
  const [selectedExhibit, setSelectedExhibit] = useRecoilState(
    selectedExhibitState
  );
  const router = useRouter();

  useEffect(() => {
    if (selectedExhibit != undefined) {
      setSelectedExhibit(undefined);
      router.push(`/exhibit/${selectedExhibit}`);
    }
  }, [selectedExhibit]);

  return (
    <Layout title="Home">
      <Square w="100%" h="100%" padding="8px">
        <Box w="100%" h="100%" p="8px">
          <World you={account ?? ""} />
        </Box>
      </Square>
    </Layout>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps<DataProps> = async () => {
  const pixels = await getContractPixels();
  if (pixels && pixels.length > 0) {
    return {
      props: {
        pixels,
      } as DataProps,
    };
  }
  return {
    props: {},
  };
};
