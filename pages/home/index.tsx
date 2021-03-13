import { Button } from "@chakra-ui/button";
import { Box, Square } from "@chakra-ui/layout";
import {
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
} from "@chakra-ui/popover";
import { Portal } from "@chakra-ui/portal";
import { Skeleton } from "@chakra-ui/skeleton";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Viewport } from "pixi-viewport";
import { Point } from "pixi.js";
import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import Layout from "../../components/Layout";
import { usePixels } from "../../hooks/usePixels";
import { useWeb3 } from "../../hooks/useWeb3";
import { pixelsState, selectedExhibitState } from "../../state";
import { getMaxMinPoints } from "../../utils/helpers";

const World = dynamic(() => import("../../components/World"), {
  ssr: false,
});

interface PopoverPosition {
  top: number;
  left: number;
  width: number;
  height: number;
}

const Home = () => {
  const { loading, web3Contract } = useWeb3();
  usePixels(web3Contract);
  const pixels = useRecoilValue(pixelsState);
  const [selectedExhibit, setSelectedExhibit] = useRecoilState(
    selectedExhibitState
  );
  const [pp, setPP] = useState<PopoverPosition>({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });
  const worldRef = useRef<HTMLDivElement>(null);
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
            ref={worldRef}
            flexBasis="800px"
            h="100%"
            p="8px"
            borderRadius="4px"
            border="1px solid var(--border)"
          >
            {/* <Box background="#000" h="100%" w="100%" /> */}
            <World you={web3Contract?.accounts[0] ?? ""} />
          </Box>
        )}
      </Square>
    </Layout>
  );
};

export default Home;
