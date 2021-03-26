import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Center, Heading, VStack, Text, Link } from "@chakra-ui/react";
import React from "react";
import Layout from "../../components/Layout";
import FileUpload from "../../components/UploadImage";

const UploadPage = () => {
  return (
    <Layout>
      <VStack p="8px" overflowY="scroll" w="100%" h="100%">
        <VStack maxW="700px" p="16px">
          <Heading as="h1" size="lg">
            Engrave your Art in the BlockChain
          </Heading>
          <Text>
            deART will convert your image file to{" "}
            <Link href="https://developers.google.com/speed/webp" isExternal>
              <strong>webp</strong>
              <ExternalLinkIcon mx="2px" />
            </Link>
            . It can support up to <strong>3 KB</strong> once the file is
            converted. We recommend uploading pixel art, using an awesome editor
            like{" "}
            <Link
              colorScheme="blue"
              href="https://www.pixilart.com/draw"
              isExternal
            >
              <strong>Pixil Art Editor</strong><ExternalLinkIcon mx="2px" />
            </Link>{" "}
            and export the actual pixel size.
          </Text>
        </VStack>
        <FileUpload />
      </VStack>
    </Layout>
  );
};

export default UploadPage;
