import { Wrap, Heading, VStack, Image, Center, Text } from "@chakra-ui/react";
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
            <Image src="/images/theirs-pic.png" w="100%" />
          </VStack>
          <VStack w="500px">
            <Heading as="h4" size="lg">
              De-Art
            </Heading>
            <Image src="/images/ours-pic.png" w="100%" />
          </VStack>
        </Wrap>
        <Wrap justify="center" p="16px">
          <Center w="500px">
            <VStack>
              <Heading as="h4" size="lg" p="16px">
                What will you do when your NFT Provider shuts down?
              </Heading>
              <Text>
                If the site you own your NFT on goes down you loose everything.
                Yes you can prove that you own some entity.{" "}
                <strong>But there is no proof of that entity's data.</strong>
              </Text>
            </VStack>
          </Center>
          <VStack w="500px">
            <Image src="/images/server-down.png" w="100%" />
          </VStack>
        </Wrap>

        <Wrap justify="center" p="16px">
          <Center w="500px">
            <VStack>
              <Heading as="h4" size="lg" p="16px">
                Your Art Exists everywhere
              </Heading>
              <Text>
                With De-Art your image will exist forever on the blockchain
                along with the proof of ownership.
              </Text>
            </VStack>
          </Center>
          <VStack w="500px">
            <Image src="/images/ours-everywhere.png" w="100%" />
          </VStack>
        </Wrap>
      </VStack>
    </Layout>
  );
};

export default Home;
