import { Wrap, Heading, VStack, Image, Center } from "@chakra-ui/react";
import React from "react";
import Layout from "../components/Layout";

const Home = () => {
  return (
    <Layout title="Home">
      <VStack p="8px" overflowY="scroll" w="100%" h="100%">
        <VStack p="32px">
          <Heading as="h1" size="3xl">
            The First Fully Decentralized NFT
          </Heading>
          <Heading as="h3" size="lg">
            Everything is stored in the Euthieum Blockchain
          </Heading>
        </VStack>
        <Wrap justify="center" p="16px">
          <VStack w="500px">
            <Heading as="h4" size="lg">
              Other NFTs
            </Heading>
            <Image src="/images/theirs.png" w="100%" />
          </VStack>
          <VStack w="500px">
            <Heading as="h4" size="lg">
              De-Art
            </Heading>
            <Image src="/images/ours.png" w="100%" />
          </VStack>
        </Wrap>
        <Wrap justify="center" p="16px">
          <Center w="500px">
            <Heading as="h4" size="md" p="16px">
              What will you do when your NFT Provider shuts down?
            </Heading>
          </Center>
          <VStack w="500px">
            <Image src="/images/server-down.png" w="100%" />
          </VStack>
        </Wrap>
      </VStack>
    </Layout>
  );
};

export default Home;
