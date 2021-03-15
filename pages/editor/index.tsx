import { Center, Square, Stack, VStack } from "@chakra-ui/layout";
import {
  Skeleton,
  Box,
  ButtonGroup,
  Button,
  Portal,
  Modal,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Stat,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import React, { useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import Layout from "../../components/Layout";
import { usePixels } from "../../hooks/usePixels";
import { useWeb3 } from "../../hooks/useWeb3";
import {
  currentColorState,
  selectedPixelsState,
  worldState,
} from "../../state";
import { ChromePicker as Picker } from "react-color";
import { WorldStateType } from "../../interfaces";

const World = dynamic(() => import("../../components/World"), {
  ssr: false,
});

const EditorPage = () => {
  const { loading, web3Contract } = useWeb3();
  const { checkout } = usePixels(web3Contract);
  const [currentColor, setCurrentColor] = useRecoilState(currentColorState);
  const setWorld = useSetRecoilState(worldState);
  const [selectedPixels, setSelectedPixels] = useRecoilState(
    selectedPixelsState
  );
  const {
    isOpen: isClearOpen,
    onOpen: onClearOpen,
    onClose: onClearClose,
    onToggle: onToggleClose,
  } = useDisclosure();

  const onCheckout = async () => {
    try {
      await checkout(selectedPixels);
      setSelectedPixels([]);
    } catch (e) {
      console.error(e);
    }
  };

  const clearSelected = () => {
    setSelectedPixels([]);
    onToggleClose();
  };

  useEffect(() => {
    setWorld(WorldStateType.create);
  }, []);

  return (
    <Layout title="Editor" isEditor={true}>
      <Stack className="picker overlay">
        <Picker
          color={currentColor}
          disableAlpha={true}
          onChange={(color) => setCurrentColor(color.hex)}
        />
        <Stack justifyContent="flex-end">
          <Stat mb={3} ml={8}>
            <StatLabel>Pixels</StatLabel>
            <StatNumber>{selectedPixels.length}</StatNumber>
          </Stat>
          <ButtonGroup justifyContent="center">
            <Button onClick={onClearOpen}>Clear</Button>
            <Button onClick={() => onCheckout()}>Check out</Button>
          </ButtonGroup>
        </Stack>
      </Stack>
      <Square w="100%" h="100%" flex={1}>
        {loading && !web3Contract !== undefined ? (
          <Skeleton />
        ) : (
          <Box h="100%" p="8px" w="100%">
            <World you={web3Contract?.accounts[0] ?? ""} />
          </Box>
        )}
      </Square>
      <Portal>
        <Modal isOpen={isClearOpen} onClose={onClearClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Clear Pixels</ModalHeader>
            <ModalBody>Are you sure you want to clear?</ModalBody>
            <ModalFooter>
              <Button onClick={onClearClose} mr={3}>
                Cancel
              </Button>
              <Button onClick={() => clearSelected()}>Clear</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Portal>
    </Layout>
  );
};

export default EditorPage;
