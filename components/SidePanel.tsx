import React, { useState } from "react";
import { ChromePicker } from "react-color";
import { useRecoilState, useRecoilValue } from "recoil";
import { currentColorState, selectedPixelsState, worldError } from "../state";
import { Button, Modal, ModalFooter, ModalBody } from "reactstrap";
import { Pixel } from "../interfaces";

interface Props {
  onCheckout: (selectedPixels: Pixel[]) => void;
}

export default ({ onCheckout }: Props) => {
  const [selectedPixels, setSelectedPixels] = useRecoilState(
    selectedPixelsState
  );
  const [currentColor, setCurrentColor] = useRecoilState(currentColorState);
  const [showClearModal, setShowClearModal] = useState(false);

  const clearSelected = () => {
    setSelectedPixels([]);
    toggleClearModal();
  };
  const toggleClearModal = () => setShowClearModal(!showClearModal);
  const error = useRecoilValue(worldError);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
        borderRight: "1px solid black",
        borderBottom: "1px solid black",
        borderTop: "1px solid black",
        padding: "8px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div>Selected Pixels</div>
        <div>{selectedPixels.length}</div>
      </div>
      {error && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div>Error</div>
          <div>{error}</div>
        </div>
      )}
      <ChromePicker
        color={currentColor}
        onChange={(color) => setCurrentColor(color.hex)}
        disableAlpha={true}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          border: "1px solid black",
        }}
      >
        <Button onClick={() => toggleClearModal()}>Clear</Button>
        <Button onClick={() => onCheckout(selectedPixels)}>Check out</Button>
      </div>
      <Modal isOpen={showClearModal} toggle={() => toggleClearModal()}>
        <ModalBody>Are you sure you want to clear?</ModalBody>
        <ModalFooter>
          <Button onClick={() => toggleClearModal()} variant="secondary">
            Cancel
          </Button>
          <Button onClick={() => clearSelected()} variant="primary">
            Clear
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};
