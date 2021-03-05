import React, { useEffect } from "react";
import { ChromePicker } from "react-color";
import { Button } from "reactstrap";
import { useRecoilState } from "recoil";
import { Pixel } from "../interfaces";
import { currentColorState, editedBlockState } from "../state";

interface Props {
  blocksPixels: Pixel[];
}

const EditBlock = ({ blocksPixels }: Props) => {
  const [currentColor, setCurrentColor] = useRecoilState(currentColorState);
  const [editedBlock, setEditedBlock] = useRecoilState(editedBlockState);

  return (
    <div>
      <ChromePicker
        color={currentColor}
        onChange={(color) => setCurrentColor(color.hex)}
        disableAlpha={true}
      />
      {!editedBlock.every((x) => blocksPixels.includes(x)) && (
        <Button>Update Block</Button>
      )}
    </div>
  );
};

export default EditBlock;
