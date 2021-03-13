import { Box, Square } from "@chakra-ui/layout";
import { Skeleton } from "@chakra-ui/skeleton";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import Layout from "../components/Layout";
import { usePixels } from "../hooks/usePixels";
import { useWeb3 } from "../hooks/useWeb3";
import { selectedExhibitState } from "../state";

const World = dynamic(() => import("../components/World"), {
  ssr: false,
});

const Home = () => {
  const { loading, web3Contract } = useWeb3();
  usePixels(web3Contract);
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
    <Layout>
      <Square w="100%" h="100%" padding="8px">
        {loading && !web3Contract !== undefined ? (
          <Skeleton />
        ) : (
          <Box
            flexBasis="800px"
            h="100%"
            p="8px"
            borderRadius="4px"
            border="1px solid var(--border)"
          >
            <World you={web3Contract?.accounts[0] ?? ""} />
          </Box>
        )}
      </Square>
    </Layout>
  );
};

export default Home;
