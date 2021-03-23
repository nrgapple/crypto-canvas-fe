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
} from "@chakra-ui/react";
import React, { useMemo, useState } from "react";
import { useDropArea } from "react-use";
import { useDarts } from "../hooks/useDarts";
import { ImageParts } from "../interfaces";
import { pngToDartRaw } from "../utils/helpers";

const FileUpload = () => {
  const [file, setFile] = useState<File | undefined>(undefined);
  const [parts, setParts] = useState<ImageParts | undefined>(undefined);
  const [name, setName] = useState<string>("");
  const [buffer, setBuffer] = useState<ArrayBuffer>();
  const { createRaw } = useDarts();

  const onFiles = async (files: File[]) => {
    const mainFile = files[0];
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
      <InputGroup p="8px">
        <InputLeftAddon children="Title" />
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </InputGroup>
      <Box {...bond}>
        {file ? (
          <HStack border="1px solid var(--border)" p="16px">
            <Text>{file.name}</Text>
            <Button onClick={onRemove}>Remove</Button>
            <Button onClick={onUpload}>Upload</Button>
          </HStack>
        ) : (
          <Heading border="1px solid var(--border)" p="16px">
            Drop png file here...
          </Heading>
        )}
      </Box>
    </VStack>
  );
};

export default FileUpload;
