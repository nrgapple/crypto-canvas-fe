import {
  Text,
  VStack,
  Heading,
  HStack,
  Button,
  InputGroup,
  InputLeftAddon,
  Input,
  useToast,
  Center,
  Image,
  Spinner,
  Stat,
  StatLabel,
  StatNumber,
  Wrap,
  StatGroup,
  Divider,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";
import { useDropArea, useAsync } from "react-use";
import { useDarts } from "../hooks/useDarts";
import { ImageParts } from "../interfaces";
import { useContractAndAccount } from "../hooks/useContractAndAccount";
import DisplayUser from "./DisplayUser";
import bufferToDataUrl from "buffer-to-data-url";
import useFilePicker from "../hooks/useFilePicker";
import { useUpload } from "../hooks/useUpload";
import { useInputItem } from "../hooks/useInputItem";

const MAX_FILE_SIZE = 3000;

const FileUpload = () => {
  const { connect, status, account } = useContractAndAccount();
  const [name, setName, titleError, setTitleError] = useInputItem<string>("");
  const { createRaw } = useDarts();
  const {
    parts,
    loading,
    bondDropArea,
    expandedImage,
    convertedImage,
    remove,
    openFileSelector,
  } = useUpload(MAX_FILE_SIZE);

  const onUpload = () => {
    if (parts?.buffer) {
      const array = new Uint8Array(parts.buffer);
      console.log({ array });
      createRaw(array, { height: 0, width: 0 }, name);
    }
  };

  return (
    <VStack>
      <FormControl isRequired>
        <FormLabel>Title</FormLabel>
        <Input
          type="text"
          value={name}
          onChange={(e) => {
            const newValue = e.target.value;
            console.log(newValue);

            setName(newValue);
            setTitleError(newValue !== "" ? "" : "Title is required");
          }}
          isRequired
        />
        <FormErrorMessage>{titleError}</FormErrorMessage>
      </FormControl>
      {loading ? (
        <Center>
          <Spinner />
        </Center>
      ) : (
        <Center
          {...bondDropArea}
          w="100%"
          border="1px solid var(--chakra-colors-gray-200)"
          borderRadius="var(--chakra-radii-md)"
          p="8px"
        >
          {parts ? (
            <VStack>
              <VStack>
                <VStack p="8px">
                  <Heading as="h3" size="md">
                    Actual image converted to webp
                  </Heading>
                  <Image src={convertedImage ?? ""} p="16px" />
                  <StatGroup
                    w="100%"
                    justifyContent="center"
                    textAlign="center"
                  >
                    <Stat>
                      <StatLabel>Width</StatLabel>
                      <StatNumber>{parts.dimensions.width}</StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel>Height</StatLabel>
                      <StatNumber>{parts.dimensions.height}</StatNumber>
                    </Stat>
                  </StatGroup>
                </VStack>
                <Divider />
                <VStack w="100%">
                  <Heading as="h3" size="md">
                    Preview
                  </Heading>
                  <VStack
                    p="8px"
                    w="100%"
                    height={{ base: "200px", md: "200px" }}
                    justifyContent="center"
                  >
                    <Image src={expandedImage ?? ""} h="100%" />
                  </VStack>
                </VStack>
              </VStack>
              <Divider />
              <VStack>
                <Stat>
                  <StatLabel>Size</StatLabel>
                  <StatNumber>{parts.buffer.length / 1000} KB</StatNumber>
                </Stat>
              </VStack>
              <VStack>
                {status === "connected" && account ? (
                  <HStack>
                    <Text>Connected to</Text>
                    <DisplayUser id={account} />
                  </HStack>
                ) : status === "connecting" ? (
                  <Spinner />
                ) : (
                  <Button onClick={() => connect("injected")}>
                    Connect to Your Wallet
                  </Button>
                )}
                <HStack p="16px">
                  <Text>{parts?.name ?? ""}</Text>
                  <Button onClick={remove}>Remove</Button>
                  {status === "connected" && (
                    <Button onClick={onUpload}>Upload</Button>
                  )}
                </HStack>
              </VStack>
            </VStack>
          ) : (
            <Center w="100%" h="100%" p="20vh">
              <VStack>
                <Heading>Drop png file here...</Heading>
                <Button onClick={openFileSelector}>Browse Files</Button>
              </VStack>
            </Center>
          )}
        </Center>
      )}
    </VStack>
  );
};

export default FileUpload;
