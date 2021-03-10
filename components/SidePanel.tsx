import React, { useMemo, useState } from "react";
import { ChromePicker } from "react-color";
import { useRecoilState, useRecoilValue } from "recoil";
import { currentColorState, selectedPixelsState, worldError } from "../state";
import { Modal, ModalFooter, ModalBody } from "reactstrap";
import { Pixel } from "../interfaces";
import UploadModal from "./UploadModal";

interface Props {
  onCheckout: (selectedPixels: Pixel[]) => void;
}

export default ({ onCheckout }: Props) => {
  const [selectedPixels, setSelectedPixels] = useRecoilState(
    selectedPixelsState
  );
  const [currentColor, setCurrentColor] = useRecoilState(currentColorState);
  const [showClearModal, setShowClearModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const clearSelected = () => {
    setSelectedPixels([]);
    toggleClearModal();
  };
  const toggleClearModal = () => setShowClearModal(!showClearModal);
  const toggleUploadModal = () => setShowUploadModal(!showUploadModal);
  const error = useRecoilValue(worldError);

  const isError = useMemo(() => error != "", [error]);

  return (
    <div className="plaque side-panel">
      <div className="flex-c-space-between p8 hw100">
        <div className="flex-center-center title">
          <h1>Create</h1>
        </div>
        <div className="border-sm">
          <div className="flex-c-center-center p8">
            <div className="text-center">
              <h5>Selected Pixels</h5>
            </div>
            <div>{selectedPixels.length}</div>
          </div>
          {error && (
            <div className="error flex-c-center-center">
              <div>
                <h5>Error</h5>
              </div>
              <div>{error}</div>
            </div>
          )}
        </div>
        <div className="border-sm p8 flex-c-center">
          <ChromePicker
            color={currentColor}
            onChange={(color) => setCurrentColor(color.hex)}
            disableAlpha={true}
          />
          <div className="flex-c-center-center">
            <div className="flex-space-center m8">
              {selectedPixels.length > 0 && (
                <>
                  <div className="button" onClick={() => toggleClearModal()}>
                    Clear
                  </div>
                  <div
                    className={`button ${isError && "disabled"}`}
                    onClick={() => onCheckout(selectedPixels)}
                  >
                    Check out
                  </div>
                </>
              )}
            </div>
            {selectedPixels.length == 1 && (
              <div className="button" onClick={() => toggleUploadModal()}>
                Upload at Pixel
              </div>
            )}
          </div>
        </div>
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
      <UploadModal
        isOpen={showUploadModal}
        close={() => toggleUploadModal()}
        toggle={() => toggleUploadModal()}
      />
    </div>
  );
};
