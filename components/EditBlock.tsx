import React, { useEffect } from "react";
import { ChromePicker } from "react-color";
import { Button } from "reactstrap";
import { useRecoilState, useSetRecoilState } from "recoil";
import { usePixels } from "../hooks/usePixels";
import { Pixel, Web3Contract, WorldStateType } from "../interfaces";
import { currentColorState, editedBlockState, worldState } from "../state";

interface Props {
  blocksPixels: Pixel[];
  web3Contract: Web3Contract;
}

const EditBlock = ({ blocksPixels, web3Contract }: Props) => {
  const [currentColor, setCurrentColor] = useRecoilState(currentColorState);
  const [editedBlock, setEditedBlock] = useRecoilState(editedBlockState);
  const setWorld = useSetRecoilState(worldState);
  const { editPixels } = usePixels(web3Contract);

  const handleEditSubmit = async () => {
    try {
      await editPixels(editedBlock);
      setEditedBlock([]);
      setWorld(WorldStateType.view);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <ChromePicker
        color={currentColor}
        onChange={(color) => setCurrentColor(color.hex)}
        disableAlpha={true}
      />
      {!editedBlock.every((x) => blocksPixels.includes(x)) && (
        <Button onClick={() => handleEditSubmit()}>Update Block</Button>
      )}
    </div>
  );
};

export default EditBlock;
