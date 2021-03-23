import {
  Text,
  VStack,
  Box,
  Heading,
  HStack,
  Button,
  InputGroup,
  InputLeftAddon,
  Input,
  useToast,
  Center,
  Image,
} from "@chakra-ui/react";
import React, { useMemo, useState } from "react";
import { useDropArea } from "react-use";
import { useDarts } from "../hooks/useDarts";
import { ImageParts } from "../interfaces";
import { pngToDartRaw, reader } from "../utils/helpers";
import { useAsync } from "react-use";
import Viewer from "./Viewer";

const MAX_FILE_SIZE = 2000;

const FileUpload = () => {
  const [file, setFile] = useState<File | undefined>(undefined);
  const [parts, setParts] = useState<ImageParts | undefined>(undefined);
  const [name, setName] = useState<string>("");
  const [buffer, setBuffer] = useState<ArrayBuffer>();
  const { createRaw } = useDarts();
  const toast = useToast();

  const onFiles = async (files: File[]) => {
    const mainFile = files[0];
    if (mainFile.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: `Files must be less than ${MAX_FILE_SIZE / 1000}kb`,
        position: "top-right",
        isClosable: true,
        status: "error",
      });
      return;
    }
    try {
      const buffer = await mainFile.arrayBuffer();
      const parts = await pngToDartRaw(buffer);
      setParts(parts);
      setFile(mainFile);
      setBuffer(buffer);
    } catch (e) {
      console.error(e);
    }
  };
  const [bond, state] = useDropArea({
    onFiles,
  });

  const image = useAsync(async () => {
    if (file) {
      return await reader(file);
    } else {
      return "";
    }
  }, [file]);

  const onRemove = () => {
    setFile(undefined);
    setParts(undefined);
  };

  const onUpload = () => {
    if (parts && buffer) {
      const array = new Uint8Array(buffer);
      console.log({ array });
      createRaw(array, parts?.dimensions, name);
    }
  };

  console.log({ parts });

  return (
    <VStack>
      <InputGroup>
        <InputLeftAddon children="Title" />
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </InputGroup>
      <Center
        {...bond}
        w="100%"
        border="1px solid var(--chakra-colors-gray-200)"
        borderRadius="var(--chakra-radii-md)"
        p="8px"
        h="300px"
      >
        {file ? (
          <VStack>
            <VStack
              p="8px"
              w="100%"
              height={{ base: "200px", md: "200px" }}
              justifyContent="center"
            >
              <Image src={image.value} h="100%" />
            </VStack>
            <HStack p="16px">
              <Text>{file.name}</Text>
              <Button onClick={onRemove}>Remove</Button>
              <Button onClick={onUpload}>Upload</Button>
            </HStack>
          </VStack>
        ) : (
          <Center w="100%" h="100%">
            <Heading>Drop png file here...</Heading>
          </Center>
        )}
      </Center>
    </VStack>
  );
};

export default FileUpload;
