import { Center, Divider, HStack, Square, Stack } from "@chakra-ui/layout";
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
  IconButton,
  Collapse,
  Input,
  InputGroup,
  InputLeftAddon,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import Layout from "../../components/Layout";
import {
  centerState,
  currentColorState,
  moveExhibitState,
  selectedPixelsState,
  worldState,
} from "../../state";
import { WorldStateType } from "../../interfaces";
import { ChromePickerProps } from "react-color";
import Draggable from "react-draggable";
import { MinusIcon } from "@chakra-ui/icons";
import {
  useContractAndAccount,
  useRequireLogin,
} from "../../hooks/useContractAndAccount";
import { useDarts } from "../../hooks/useDarts";
import FileUpload from "../../components/UploadImage";

const World = dynamic(() => import("../../components/World"), {
  ssr: false,
});

const Picker = dynamic<ChromePickerProps>(
  () => import("react-color").then((mod) => mod.ChromePicker),
  { ssr: false }
);

const EditorPage = () => {
  const { status, account } = useContractAndAccount(true);
  const { create } = useDarts();
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
  const [name, setName] = useState("");
  const { isOpen: isMin, onToggle: onToggleMin } = useDisclosure({
    defaultIsOpen: false,
  });
  const {
    isOpen: isUpload,
    onToggle: onToggleUpload,
    onOpen: onUploadOpen,
    onClose: onUploadClose,
  } = useDisclosure({
    defaultIsOpen: false,
  });
  useRequireLogin(status);

  const onCheckout = async () => {
    try {
      await create(selectedPixels, name);

      setSelectedPixels([]);
    } catch (e) {
      console.log(e);
    }
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
      <Draggable grid={[25, 25]} bounds="parent" handle="#handle">
        <Stack className="picker overlay" justifyContent="center" w="250px">
          <HStack
            flexBasis="10px"
            justifyContent="flex-end"
            justifyItems="stretch"
            alignItems="stretch"
          >
            <Box id="handle" flex={1} />
            <IconButton
              aria-label="minimize"
              variant="outline"
              icon={<MinusIcon />}
              onClick={onToggleMin}
              size="xs"
            />
          </HStack>
          <Divider />
          <Collapse in={!isMin} animateOpacity>
            <InputGroup p="8px">
              <InputLeftAddon children="Title" />
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </InputGroup>
            <Center>
              <Picker
                color={currentColor}
                disableAlpha={true}
                onChange={(color) => setCurrentColor(color.hex)}
              />
            </Center>
            <Stack justifyContent="flex-end">
              <Stat mb={3} ml={8}>
                <StatLabel>Pixels</StatLabel>
                <StatNumber>{selectedPixels.length}</StatNumber>
              </Stat>
              <Divider />
              <ButtonGroup justifyContent="center">
                {world === WorldStateType.create && (
                  <>
                    <Button onClick={onClearOpen}>Clear</Button>
                    <Button onClick={() => toggleMove()}>
                      {moveExhibit ? "Moving" : "Move"}
                    </Button>
                    <Button onClick={onUploadOpen}>Upoad</Button>
                  </>
                )}
                <Button onClick={() => onCenter()}>Recenter</Button>
              </ButtonGroup>
              <ButtonGroup justifyContent="center">
                <Button onClick={() => onCheckout()}>Check out</Button>
              </ButtonGroup>
            </Stack>
          </Collapse>
        </Stack>
      </Draggable>
      <Square w="100%" h="100%" flex={1}>
        {status !== "connected" ? (
          <Skeleton />
        ) : (
          <Box h="100%" p="8px" w="100%">
            <World you={account ?? ""} />
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
        <Modal isOpen={isUpload} onClose={onToggleUpload}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Upload Image</ModalHeader>
            <ModalBody>
              <FileUpload />
            </ModalBody>
          </ModalContent>
        </Modal>
      </Portal>
    </Layout>
  );
};

export default EditorPage;
