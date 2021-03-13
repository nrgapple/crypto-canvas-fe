import { Flex, HStack, Square, Stack, VStack } from "@chakra-ui/layout";
import {
  Skeleton,
  Box,
  Stat,
  StatLabel,
  StatNumber,
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
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import React, { useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import Layout from "../../components/Layout";
import { usePixels } from "../../hooks/usePixels";
import { useWeb3 } from "../../hooks/useWeb3";
import {
  currentColorState,
  selectedExhibitState,
  selectedPixelsState,
  worldState,
} from "../../state";
import { SwatchesPicker as Picker } from "react-color";
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
    <Layout>
      <VStack w="100%" h="100%" padding="8px">
        <HStack w="100%" justifyContent="center">
          <HStack
            w="100%"
            h="200px"
            justifyContent="space-evenly"
            padding="8px"
            borderRadius="4px"
            border="1px solid var(--border)"
            flexBasis="800px"
          >
            <Square>
              <Picker
                color={currentColor}
                onChange={(color) => setCurrentColor(color.hex)}
              />
            </Square>
            <Box>
              <Stat>
                <StatLabel>SelectedPixels</StatLabel>
                <StatNumber>{selectedPixels.length}</StatNumber>
              </Stat>
            </Box>
            <ButtonGroup>
              <Button onClick={onClearOpen}>Clear</Button>
              <Button onClick={() => onCheckout()}>Check out</Button>
            </ButtonGroup>
          </HStack>
        </HStack>
        <Square w="100%" h="100%" flex={1}>
          {loading && !web3Contract !== undefined ? (
            <Skeleton />
          ) : (
            <Box
              flexBasis="800px"
              h="100%"
              p="8px"
              borderRadius="4px"
              border="1px solid var(--border)"
            >
              <World you={web3Contract?.accounts[0] ?? ""} />
            </Box>
          )}
        </Square>
      </VStack>
      <Portal>
        <Modal isOpen={isClearOpen} onClose={onClearClose}>
          <ModalOverlay />
          <ModalContent>
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
