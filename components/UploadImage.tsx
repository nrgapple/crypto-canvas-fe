import {
  Text,
  VStack,
  Heading,
  HStack,
  Button,
  Input,
  Center,
  Image,
  Spinner,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Divider,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Wrap,
  Flex,
} from "@chakra-ui/react";
import React, { useMemo } from "react";
import { useDarts } from "../hooks/useDarts";
import { useContractAndAccount } from "../hooks/useContractAndAccount";
import DisplayUser from "./DisplayUser";
import { useUpload } from "../hooks/useUpload";
import { useInputItem } from "../hooks/useInputItem";

const MAX_FILE_SIZE = 3000;

const FileUpload = () => {
  const { connect, status, account } = useContractAndAccount();
  const { createRaw } = useDarts();
  const {
    parts,
    loading,
    expandedImage,
    convertedImage,
    remove,
    openFileSelector,
    error: uploadError,
  } = useUpload(MAX_FILE_SIZE);

  const [name, nameError, onValidateName] = useInputItem<string>(
    "",
    (title: string) => {
      let error: string = "";
      if (title === "") {
        error = "Title is required";
      }
      if (title.length > 32) {
        error = "Title is too long (32 character max)";
      }
      return error;
    }
  );

  const onUpload = () => {
    if (parts?.buffer && name) {
      const array = new Uint8Array(parts.buffer);
      console.log({ array });
      createRaw(array, { height: 0, width: 0 }, name);
    }
  };

  const isErrors = useMemo(() => !!uploadError || !!nameError, [
    nameError,
    uploadError,
  ]);

  const renderActual = useMemo(
    () => (
      <VStack p="8px" width="300px" justifyContent="space-between">
        <Heading as="h3" size="md" textAlign="center">
          Actual image converted to webp
        </Heading>
        <Image src={convertedImage ?? ""} p="16px" />
        <StatGroup w="100%" justifyContent="center" textAlign="center">
          <Stat>
            <StatLabel>Width</StatLabel>
            <StatNumber>{parts?.dimensions.width}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Height</StatLabel>
            <StatNumber>{parts?.dimensions.height}</StatNumber>
          </Stat>
        </StatGroup>
      </VStack>
    ),
    [parts, convertedImage]
  );

  const renderExpanded = useMemo(
    () => (
      <VStack width="300px" minW="0">
        <Heading as="h3" size="md">
          Preview
        </Heading>
        <VStack
          p="8px"
          w="100%"
          height={{ base: "200px", md: "200px" }}
          justifyContent="center"
        >
          <Image src={expandedImage ?? ""} h="100%" width="auto" minW="0" />
        </VStack>
      </VStack>
    ),
    [expandedImage]
  );

  const renderSubmitActions = useMemo(
    () => (
      <>
        {status === "connected" && account ? (
          <HStack>
            <Text>Connected to</Text>
            <DisplayUser id={account} />
          </HStack>
        ) : status === "connecting" ? (
          <Spinner />
        ) : (
          <Button disabled={isErrors} onClick={() => connect("injected")}>
            Connect to Your Wallet
          </Button>
        )}
        <HStack p="16px">
          <Text>{parts?.name ?? ""}</Text>
          <Button onClick={remove}>Remove</Button>
          {status === "connected" && (
            <Button disabled={isErrors} onClick={onUpload}>
              Upload
            </Button>
          )}
        </HStack>
      </>
    ),
    [parts, isErrors, account, status]
  );

  return (
    <VStack maxW="700px" w="100%">
      <FormControl isRequired isInvalid={!!nameError}>
        <FormLabel>Name</FormLabel>
        <Input
          type="text"
          placeholder="deART Name"
          value={name}
          onChange={(e) => onValidateName(e.target.value)}
          isRequired
        />
        <FormErrorMessage>{nameError}</FormErrorMessage>
      </FormControl>
      {loading ? (
        <Center>
          <Spinner />
        </Center>
      ) : (
        <FormControl isRequired isInvalid={!!uploadError}>
          <FormLabel>Upload</FormLabel>
          <Center
            w="100%"
            border="1px solid var(--chakra-colors-gray-200)"
            borderRadius="var(--chakra-radii-md)"
            p="8px"
          >
            {parts ? (
              <VStack w="100%" h="100%">
                <HStack wrap="wrap" w="100%" justifyContent="center">
                  {renderActual}
                  {renderExpanded}
                </HStack>
                <Divider />
                <VStack>
                  <Stat>
                    <StatLabel>Size</StatLabel>
                    <StatNumber>{parts.buffer.length / 1000} KB</StatNumber>
                  </Stat>
                </VStack>
                <VStack>{renderSubmitActions}</VStack>
              </VStack>
            ) : (
              <Center w="100%" h="100%">
                <VStack>
                  <Heading>Drop image file here...</Heading>
                  <Button onClick={openFileSelector}>Browse Files</Button>
                </VStack>
              </Center>
            )}
          </Center>
          <FormErrorMessage>{uploadError}</FormErrorMessage>
        </FormControl>
      )}
    </VStack>
  );
};

export default FileUpload;
