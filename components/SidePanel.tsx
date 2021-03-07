import React, { useMemo, useState } from "react";
import { ChromePicker } from "react-color";
import { useRecoilState, useRecoilValue } from "recoil";
import { currentColorState, selectedPixelsState, worldError } from "../state";
import { Modal, ModalFooter, ModalBody } from "reactstrap";
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

  const isError = useMemo(() => error != "", [error]);

  return (
    <div className="flex-c-space p8 lb-t lb-b lb-r">
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
        <div className="error flex-c-center">
          <div>Error</div>
          <div>{error}</div>
        </div>
      )}
      <ChromePicker
        color={currentColor}
        onChange={(color) => setCurrentColor(color.hex)}
        disableAlpha={true}
      />
      <div className="flex-space-center m8 lb p8">
        <div className="button" onClick={() => toggleClearModal()}>
          Clear
        </div>
        {selectedPixels.length > 0 && (
          <div
            className={`button ${isError && "disabled"}`}
            onClick={() => onCheckout(selectedPixels)}
          >
            Check out
          </div>
        )}
      </div>
      <Modal isOpen={showClearModal} toggle={() => toggleClearModal()}>
        <ModalBody>Are you sure you want to clear?</ModalBody>
        <ModalFooter>
          <div className="button" onClick={() => toggleClearModal()}>
            Cancel
          </div>
          <div className="button" onClick={() => clearSelected()}>
            Clear
          </div>
        </ModalFooter>
      </Modal>
    </div>
  );
};
