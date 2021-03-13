import { Box, Center, Square } from "@chakra-ui/layout";
import { Skeleton } from "@chakra-ui/skeleton";
import dynamic from "next/dynamic";
import Layout from "../../components/Layout";
import { usePixels } from "../../hooks/usePixels";
import { useWeb3 } from "../../hooks/useWeb3";

const World = dynamic(() => import("../../components/World"), {
  ssr: false,
});

const Home = () => {
  const { loading, web3Contract } = useWeb3();
  usePixels(web3Contract);

  return (
    <Layout>
      <Square w="100%" h="100%">
        {loading && !web3Contract != undefined ? (
          <Skeleton />
        ) : (
          <Box h="100%" w="100%" p="8px">
            {/* <Box background="#000" h="100%" w="100%" /> */}
            <World you={web3Contract?.accounts[0] ?? ""} />
          </Box>
        )}
      </Square>
    </Layout>
  );
};

export default Home;
