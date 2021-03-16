import { Box, Square } from "@chakra-ui/layout";
import { Skeleton } from "@chakra-ui/skeleton";
import { GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import React, { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import Layout from "../components/Layout";
import { usePixels } from "../hooks/usePixels";
import { useWeb3 } from "../hooks/useWeb3";
import { Pixel } from "../interfaces";
import { pixelsState, selectedExhibitState } from "../state";
import { getContractPixels } from "../services";

interface DataProps {
  pixels?: Pixel[];
}

const World = dynamic(() => import("../components/World"), {
  ssr: false,
});

const Home = ({ pixels }: DataProps) => {
  const { loading, web3Contract } = useWeb3();
  usePixels(web3Contract, pixels);
  const [selectedExhibit, setSelectedExhibit] = useRecoilState(
    selectedExhibitState
  );
  const router = useRouter();
  const currpixels = useRecoilValue(pixelsState);

  console.log("currkpixels", currpixels);

  useEffect(() => {
    if (selectedExhibit != undefined) {
      setSelectedExhibit(undefined);
      router.push(`/exhibit/${selectedExhibit}`);
    }
  }, [selectedExhibit]);

  return (
    <Layout title="Home">
      <Square w="100%" h="100%" padding="8px">
        {loading && !web3Contract !== undefined ? (
          <Skeleton />
        ) : (
          <Box w="100%" h="100%" p="8px">
            <World you={web3Contract?.accounts[0] ?? ""} />
          </Box>
        )}
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
