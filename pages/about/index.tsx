import Layout from "../../components/Layout";
import React from "react";
import {
  Center,
  Divider,
  Heading,
  Link,
  Text,
  VStack,
  Wrap,
} from "@chakra-ui/layout";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Image } from "@chakra-ui/image";
import NextLink from "next/link";

const About = () => {
  return (
    <Layout title="About">
      <VStack p="16px" overflowY="scroll" w="100%" h="100%">
        <Heading>
          Digital Assets Owned by{" "}
          <span style={{ fontWeight: "normal" }}>You</span>
        </Heading>
        <Text as="i" p="16px">
          <Link
            href="https://docs.openzeppelin.com/contracts/3.x/erc721"
            isExternal
          >
            <strong>ERC721</strong>
            <ExternalLinkIcon mx="2px" />
          </Link>{" "}
          is a specific smart contract which can be deployed to the Ethereum
          Blockchain that allows individuals to mint items (NFTs) containing an
          owner and a small amount of metadata.
        </Text>
        <Divider />
        <Center>
          <Heading fontWeight="normal">Others</Heading>
        </Center>
        <Text p="16px">
          Since the amount of metadata needs to be small, what other NFTs are
          doing at the moment is actually storing the real data{" "}
          <strong>off-chain</strong> and then only having a reference to the
          actual data on the Blockchain. Off-chain is just a fancy word for
          <strong> centralized</strong> and it really defeats the entire purpose
          of a digital asset that you own. If this "off-chain" server was ever
          hacked or taken down, your digital asset is gone.
        </Text>
        <Center>
          <Heading fontWeight="normal">Us</Heading>
        </Center>
        <Text p="16px">
          We understand that there are limitations with the Blockchain at the
          moment. Storage is very difficult and our goal is to create a 100%
          decentralized digital asset where all of the data is stored directly
          in the Blockchain itself rather than some centralized server. This
          means when the NFT is created with an image, it will for ever be
          engraved into the blockchain. deART is for people who want to truly
          own every part of the digital asset they create.
        </Text>
        <Heading fontWeight="normal">Creators</Heading>
        <Wrap justify="center">
          <VStack>
            <Image h="200px" src={`/api/darts/image/12`} borderRadius="3px" />
            <NextLink href="/browse/12">deART#12</NextLink>
          </VStack>
          <VStack>
            <Image h="200px" src={`/api/darts/image/13`} borderRadius="3px" />
            <NextLink href="/browse/13">deART#13</NextLink>
          </VStack>
        </Wrap>
      </VStack>
    </Layout>
  );
};

export default About;
