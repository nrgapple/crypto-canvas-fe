import {
  Wrap,
  Heading,
  VStack,
  Image,
  Center,
  Text,
  Skeleton,
  Link,
  Button,
  Divider,
} from "@chakra-ui/react";
import React from "react";
import { config } from "../app.config";
import Layout from "../components/Layout";

const Home = () => {
  return (
    <Layout title="Home">
      <VStack p="8px" overflowY="scroll" w="100%" h="100%">
        <VStack p={{ base: "8px", md: "32px" }}>
          <Heading as="h1" size="3xl">
            First Truly Decentralized NFT
          </Heading>
          <Heading as="h3" size="lg">
            Everything is stored directly in the Ethereum Blockchain
          </Heading>
          <Center>
            <Wrap justify="center" p="16px">
              <Link _hover={undefined} href="/upload">
                <Button>Create</Button>
              </Link>
              <Link
                _hover={undefined}
                href={`${config.openSeaBaseUri}collection/${config.tokenName}`}
              >
                <Button>Buy</Button>
              </Link>
            </Wrap>
          </Center>
        </VStack>
        <Divider />
        <Wrap justify="center" p={{ base: "0px", md: "16px" }}>
          <VStack maxW="500px">
            <Heading as="h4" size="lg">
              Every Other NFT
            </Heading>
            <Image
              fallback={<Skeleton w="100%" h="100%" />}
              src="/images/theirs-pic.png"
              w="100%"
            />
          </VStack>
          <VStack maxW="500px">
            <Heading as="h4" size="lg">
              De-Art
            </Heading>
            <Image
              fallback={<Skeleton w="100%" h="100%" />}
              src="/images/ours-pic.png"
              w="100%"
            />
          </VStack>
        </Wrap>
        <Divider />
        <Wrap justify="center" p={{ base: "0px", md: "16px" }}>
          <Center maxW="500px">
            <VStack>
              <Heading as="h4" size="lg" p="16px">
                What Will you do when your NFT Provider Shuts Down?
              </Heading>
              <Text>
                If the site you own your NFT on goes down you loose everything.
                Yes you can prove that you own some entity.{" "}
                <strong>But there is no proof of that entity's data.</strong>
              </Text>
            </VStack>
          </Center>
          <VStack maxW="500px">
            <Image
              fallback={<Skeleton w="100%" h="100%" />}
              src="/images/theirs-server-down.png"
              w="100%"
            />
          </VStack>
        </Wrap>
        <Divider />
        <Wrap justify="center" p={{ base: "0px", md: "16px" }}>
          <Center maxW="500px">
            <VStack>
              <Heading as="h4" size="lg" p="16px">
                Your Art Exists Everywhere
              </Heading>
              <Text>
                With De-Art your image will exist forever on the blockchain
                along with the proof of ownership.
              </Text>
            </VStack>
          </Center>
          <VStack maxW="500px">
            <Image
              src="/images/ours-everywhere.png"
              fallback={<Skeleton w="100%" h="100%" />}
              w="100%"
            />
          </VStack>
        </Wrap>
        <Divider />
        <VStack p={{ base: "0px", md: "16px" }}>
          <Heading as="h3" size="lg">
            Create your <strong>Indestructible</strong> Digital Assets
          </Heading>
          <Center p="16px">
            <Wrap justify="center" p="16px">
              <Link _hover={undefined} href="/about">
                <Button>Learn More</Button>
              </Link>
              <Link _hover={undefined} href="/upload">
                <Button>Create</Button>
              </Link>
              <Link
                _hover={undefined}
                href={`${config.openSeaBaseUri}collection/${config.tokenName}`}
              >
                <Button>Buy</Button>
              </Link>
            </Wrap>
          </Center>
        </VStack>
      </VStack>
    </Layout>
  );
};

export default Home;
