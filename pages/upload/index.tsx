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
            De-Art will convert your image file to <strong>webp</strong>. It can
            support up to <strong>3 KB</strong> once the file is converted. We
            recomend uploading pixel art, using a awesome editor like{" "}
            <Link
              colorScheme="blue"
              href="https://www.pixilart.com/draw"
              isExternal
            >
              Pixil Art Editor <ExternalLinkIcon mx="2px" />
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
