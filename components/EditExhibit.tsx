import React from "react";
import { ChromePicker } from "react-color";
import { useRecoilState, useSetRecoilState } from "recoil";
import { usePixels } from "../hooks/usePixels";
import { Pixel, Web3Contract, WorldStateType } from "../interfaces";
import { currentColorState, editedExhibitState, worldState } from "../state";

interface Props {
  exhibitPixels: Pixel[];
  web3Contract: Web3Contract;
}

const EditExhibit = ({ exhibitPixels }: Props) => {
  const [currentColor, setCurrentColor] = useRecoilState(currentColorState);
  const [editedExhibit, setEditedExibit] = useRecoilState(editedExhibitState);
  const setWorld = useSetRecoilState(worldState);
  const { editPixels } = usePixels();

  const handleEditSubmit = async () => {
    try {
      await editPixels(editedExhibit);
      setEditedExibit([]);
      setWorld(WorldStateType.view);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="border-sm p8 flex-c-center">
      <ChromePicker
        color={currentColor}
        onChange={(color) => setCurrentColor(color.hex)}
        disableAlpha={true}
      />
      <div className="flex-space-center m8 p8">
        {!editedExhibit.every((x) => exhibitPixels.includes(x)) && (
          <div className="button" onClick={() => handleEditSubmit()}>
            Update Exhibit
          </div>
        )}
      </div>
    </div>
  );
};

export default EditExhibit;
