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
} from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";
import { useDropArea, useAsync } from "react-use";
import { useDarts } from "../hooks/useDarts";
import { ImageParts } from "../interfaces";
import { useContractAndAccount } from "../hooks/useContractAndAccount";
import DisplayUser from "./DisplayUser";
import bufferToDataUrl from "buffer-to-data-url";
import useFilePicker from "../hooks/useFilePicker";

const MAX_FILE_SIZE = 3000;

const FileUpload = () => {
  const { connect, status, account } = useContractAndAccount();
  const [parts, setParts] = useState<ImageParts | undefined>(undefined);
  const [name, setName] = useState<string>("");
  const { createRaw } = useDarts();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [selectorFiles, openFileSelector] = useFilePicker({
    multiple: false,
    accept: [".png", ".jpeg", "webp"],
  });

  const onFiles = async (files: File[]) => {
    setLoading(true);
    try {
      const mainFile = files[0];
      const mainBuffer = await mainFile.arrayBuffer();
      const data = new FormData();
      data.append("file", mainFile);
      const resp = await fetch(`/api/util/webp`, {
        method: "POST",
        body: data,
      });
      //@ts-ignore
      const buffer = (await resp.body?.getReader().read()).value;
      console.log("resp", resp);
      const parts = {
        buffer: Buffer.from(buffer!),
        name: mainFile.name.replace(/\..*/, ".webp"),
      } as ImageParts;
      console.log({
        before: Buffer.from(mainBuffer).length,
        after: parts.buffer.length,
      });

      if (parts.buffer.length > MAX_FILE_SIZE) {
        toast({
          title: "File too large",
          description: `Files must be less than ${MAX_FILE_SIZE / 1000}kb`,
          position: "top-right",
          isClosable: true,
          status: "error",
        });
        throw Error("File too large");
      }
      setParts(parts);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const [bond, state] = useDropArea({
    onFiles,
  });

  useEffect(() => {
    if (selectorFiles?.length > 0) {
      onFiles(selectorFiles);
    }
  }, [selectorFiles]);

  const imageFromBuffer = useAsync(async () => {
    if (!parts?.buffer) return undefined;

    return await bufferToDataUrl("image/webp", parts.buffer);
  }, [parts]);

  const onRemove = () => {
    setParts(undefined);
  };

  const onUpload = () => {
    if (parts?.buffer) {
      const array = new Uint8Array(parts.buffer);
      console.log({ array });
      createRaw(array, { height: 0, width: 0 }, name);
    }
  };

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
      {loading ? (
        <Center>
          <Spinner />
        </Center>
      ) : (
        <Center
          {...bond}
          w="100%"
          border="1px solid var(--chakra-colors-gray-200)"
          borderRadius="var(--chakra-radii-md)"
          p="8px"
        >
          {parts ? (
            <VStack>
              <VStack
                p="8px"
                w="100%"
                height={{ base: "200px", md: "200px" }}
                justifyContent="center"
              >
                <Image src={imageFromBuffer.value ?? ""} h="100%" />
              </VStack>
              <VStack>
                <Stat>
                  <StatLabel>Size</StatLabel>
                  <StatNumber>{parts.buffer.length / 1000} KB</StatNumber>
                </Stat>
              </VStack>
              <VStack>
                {status === "connected" && account ? (
                  <Text>
                    Connected to <DisplayUser id={account} />
                  </Text>
                ) : status === "connecting" ? (
                  <Spinner />
                ) : (
                  <Button onClick={() => connect("injected")}>
                    Connect to Your Wallet
                  </Button>
                )}
                <HStack p="16px">
                  <Text>{parts?.name ?? ""}</Text>
                  <Button onClick={onRemove}>Remove</Button>
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
