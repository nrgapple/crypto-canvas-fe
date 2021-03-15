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
import dynamic, { DynamicOptions } from "next/dynamic";
import React, { Component, useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import Layout from "../../components/Layout";
import { usePixels } from "../../hooks/usePixels";
import { useWeb3 } from "../../hooks/useWeb3";
import {
  centerState,
  currentColorState,
  moveExhibitState,
  selectedPixelsState,
  worldState,
} from "../../state";
import { WorldStateType } from "../../interfaces";
import { ChromePickerProps } from "react-color";

const World = dynamic(() => import("../../components/World"), {
  ssr: false,
});

const Picker = dynamic<ChromePickerProps>(
  () => import("react-color").then((mod) => mod.ChromePicker),
  { ssr: false }
);

const EditorPage = () => {
  const { loading, web3Contract } = useWeb3();
  const { checkout } = usePixels(web3Contract);
  const [currentColor, setCurrentColor] = useRecoilState(currentColorState);
  const [selectedPixels, setSelectedPixels] = useRecoilState(
    selectedPixelsState
  );
  const {
    isOpen: isClearOpen,
    onOpen: onClearOpen,
    onClose: onClearClose,
    onToggle: onToggleClose,
  } = useDisclosure();
  const [world, setWorld] = useRecoilState(worldState);
  const setCenter = useSetRecoilState(centerState);
  const [moveExhibit, setMoveExhibit] = useRecoilState(moveExhibitState);

  const onCheckout = async () => {
    try {
      await checkout(selectedPixels);
      setSelectedPixels([]);
    } catch (e) {}
  };

  const clearSelected = () => {
    setSelectedPixels([]);
    onToggleClose();
  };

  const onCenter = () => {
    setCenter(true);
  };

  const toggleMove = () => setMoveExhibit(!moveExhibit);

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
            <Button onClick={() => toggleMove()}>
              {moveExhibit ? "Moving" : "Move"}
            </Button>
            <Button onClick={() => onCenter()}>Recenter</Button>
          </ButtonGroup>
          <ButtonGroup justifyContent="center">
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
